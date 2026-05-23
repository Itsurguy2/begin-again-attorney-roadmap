"""
Attorney Roadmap API
====================
Production-ready Flask + SQLAlchemy backend.

Environment variables (all optional):
  DATABASE_URL       Postgres connection string (Render provides this).
                     Falls back to a local SQLite file (attorney_roadmap.db).
  FRONTEND_ORIGIN    Comma-separated list of allowed CORS origins.
                     Defaults to "*" (development).
  SECRET_KEY         Flask secret. Defaults to a dev key.
  PORT               Port to bind. Defaults to 5000.
"""

import json
import os
from datetime import datetime, timezone

from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, sessionmaker, scoped_session


# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------
def _normalize_database_url(url: str) -> str:
    # Render / Heroku give "postgres://..." but SQLAlchemy 2.x expects "postgresql://"
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    # Prefer psycopg (v3) driver if available; otherwise psycopg2 works too
    return url


DATABASE_URL = _normalize_database_url(
    os.environ.get("DATABASE_URL", "sqlite:///attorney_roadmap.db")
)

# SQLite needs a special connect arg for multi-threaded Flask
engine_kwargs = {"pool_pre_ping": True}
if DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, **engine_kwargs)
SessionLocal = scoped_session(sessionmaker(bind=engine, autoflush=False, autocommit=False))
Base = declarative_base()


# ---------------------------------------------------------------------------
# MODELS
# ---------------------------------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    assessments = relationship("Assessment", back_populates="user", cascade="all, delete-orphan")


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    score = Column(Integer, nullable=False)
    level = Column(String(60), nullable=False)
    message = Column(Text, nullable=False)
    answers_json = Column(Text, nullable=True)  # raw answers, stored as JSON text
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    user = relationship("User", back_populates="assessments")


# ---------------------------------------------------------------------------
# DOMAIN LOGIC
# ---------------------------------------------------------------------------
LEVELS = [
    {
        "min": 360,
        "level": "FAST-TRACK READY",
        "message": "You are highly prepared. Move into LSAT prep immediately and target scholarship-tier scores.",
        "color": "#22c55e",
    },
    {
        "min": 280,
        "level": "POTENTIAL TO SUCCEED",
        "message": "Strong potential. Tighten study discipline and financial runway before applying.",
        "color": "#38bdf8",
    },
    {
        "min": 200,
        "level": "NOT YET READY",
        "message": "You need more preparation. Build the foundation before committing to law school.",
        "color": "#f59e0b",
    },
    {
        "min": 0,
        "level": "BUILD FOUNDATION FIRST",
        "message": "Focus first on discipline, consistency, and finances. Law school can wait.",
        "color": "#ef4444",
    },
]

MAX_SCORE = 420  # 42 questions * 10


def classify(score: int) -> dict:
    for bracket in LEVELS:
        if score >= bracket["min"]:
            return bracket
    return LEVELS[-1]


def roadmap_for(score: int) -> dict:
    """Return a personalized roadmap payload based on score band."""
    bracket = classify(score)
    base_steps = [
        {
            "id": "direction",
            "title": "Choose a legal direction",
            "detail": "Immigration, public interest, government, or corporate law — pick one to focus prep around.",
        },
        {
            "id": "lsat",
            "title": "LSAT strategy",
            "detail": "155–160 strong admissions · 160–165 scholarships · 165+ major advantage.",
        },
        {
            "id": "schools",
            "title": "Target affordable schools",
            "detail": "CUNY, UDC, and UND lead on cost-to-outcome ratio.",
        },
        {
            "id": "accelerate",
            "title": "Consider an accelerated JD",
            "detail": "Touro FlexTime, Albany hybrid, or Southwestern SCALE 2-year program.",
        },
        {
            "id": "bar",
            "title": "Bar plan",
            "detail": "Start bar prep in 3L; target a single jurisdiction first.",
        },
    ]

    # Tailor recommendations by level
    if bracket["level"] == "FAST-TRACK READY":
        focus = "Aggressive timeline: register for the LSAT within 90 days."
        timeline_months = 9
    elif bracket["level"] == "POTENTIAL TO SUCCEED":
        focus = "Tighten weekly study cadence and shore up finances for 6 months."
        timeline_months = 12
    elif bracket["level"] == "NOT YET READY":
        focus = "Build a 12-month foundation in discipline and academic stamina."
        timeline_months = 18
    else:
        focus = "Spend 12+ months on habits and savings before any commitment."
        timeline_months = 24

    return {
        "score": score,
        "max_score": MAX_SCORE,
        "percent": round((score / MAX_SCORE) * 100, 1),
        "level": bracket["level"],
        "message": bracket["message"],
        "color": bracket["color"],
        "focus": focus,
        "timeline_months": timeline_months,
        "steps": base_steps,
        "schools_affordable": [
            {"name": "CUNY School of Law", "url": "https://www.law.cuny.edu",
             "blurb": "Low cost · public-interest focus · strong clinics."},
            {"name": "UDC Law", "url": "https://www.law.udc.edu",
             "blurb": "Hands-on courtroom training · extremely low tuition."},
            {"name": "University of North Dakota Law", "url": "https://law.und.edu",
             "blurb": "Small classes · strong bar prep support."},
        ],
        "schools_accelerated": [
            {"name": "Touro Law (FlexTime JD)", "url": "https://tourolaw.edu",
             "blurb": "Hybrid program for working professionals."},
            {"name": "Albany Law School", "url": "https://www.albanylaw.edu",
             "blurb": "Flexible hybrid JD with policy focus."},
            {"name": "Southwestern Law (SCALE)", "url": "https://www.swlaw.edu",
             "blurb": "2-year accelerated JD."},
        ],
        "schools_elite": [
            {"name": "NYU School of Law", "url": "https://www.law.nyu.edu/",
             "blurb": "Elite · strong public-interest funding · global reach."},
            {"name": "Fordham Law School", "url": "https://www.fordham.edu/school-of-law/",
             "blurb": "Strong NYC employment outcomes · litigation pipeline."},
        ],
    }


# ---------------------------------------------------------------------------
# FLASK APP FACTORY
# ---------------------------------------------------------------------------
def create_app() -> Flask:
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-change-me")

    # CORS — allow comma-separated list in FRONTEND_ORIGIN, default "*"
    raw_origins = os.environ.get("FRONTEND_ORIGIN", "*")
    origins = [o.strip() for o in raw_origins.split(",")] if raw_origins != "*" else "*"
    CORS(app, resources={r"/api/*": {"origins": origins}}, supports_credentials=False)

    # Create tables on boot (safe — only creates missing ones).
    # In a larger app this would live behind Alembic migrations.
    Base.metadata.create_all(engine)

    @app.teardown_appcontext
    def remove_session(exc=None):
        SessionLocal.remove()

    # -----------------------------------------------------------------
    # ROUTES
    # -----------------------------------------------------------------
    @app.route("/")
    def home():
        return jsonify({
            "service": "Attorney Roadmap API",
            "status": "ok",
            "version": "2.0.0",
            "db": "postgres" if DATABASE_URL.startswith("postgresql") else "sqlite",
        })

    @app.route("/api/health")
    def health():
        # Used by Render's healthCheckPath
        try:
            with engine.connect() as conn:
                conn.exec_driver_sql("SELECT 1")
            return jsonify({"status": "ok"}), 200
        except Exception as e:  # pragma: no cover
            return jsonify({"status": "degraded", "error": str(e)}), 503

    @app.route("/api/analyze-score", methods=["POST"])
    def analyze_score():
        data = request.get_json(silent=True) or {}

        name = (data.get("name") or "").strip()
        try:
            score = int(data.get("score", 0))
        except (TypeError, ValueError):
            return jsonify({"error": "score must be an integer"}), 400

        if not name:
            return jsonify({"error": "name is required"}), 400
        if score < 0 or score > MAX_SCORE:
            return jsonify({"error": f"score must be between 0 and {MAX_SCORE}"}), 400

        answers = data.get("answers")  # optional dict

        bracket = classify(score)
        roadmap = roadmap_for(score)

        # Persist
        session = SessionLocal()
        try:
            user = session.query(User).filter(User.name == name).first()
            if not user:
                user = User(name=name)
                session.add(user)
                session.flush()

            assessment = Assessment(
                user_id=user.id,
                score=score,
                level=bracket["level"],
                message=bracket["message"],
                answers_json=json.dumps(answers) if answers else None,
            )
            session.add(assessment)
            session.commit()
            assessment_id = assessment.id
        except Exception as e:
            session.rollback()
            return jsonify({"error": "database error", "detail": str(e)}), 500

        return jsonify({
            "assessment_id": assessment_id,
            "name": name,
            **roadmap,
        })

    @app.route("/api/roadmap", methods=["GET"])
    def get_roadmap():
        try:
            score = int(request.args.get("score", 0))
        except ValueError:
            return jsonify({"error": "score must be an integer"}), 400
        return jsonify(roadmap_for(max(0, min(score, MAX_SCORE))))

    @app.route("/api/assessments/<int:assessment_id>", methods=["GET"])
    def get_assessment(assessment_id: int):
        session = SessionLocal()
        a = session.get(Assessment, assessment_id)
        if not a:
            return jsonify({"error": "not found"}), 404
        return jsonify({
            "assessment_id": a.id,
            "name": a.user.name,
            "score": a.score,
            "level": a.level,
            "message": a.message,
            "created_at": a.created_at.isoformat() if a.created_at else None,
            "roadmap": roadmap_for(a.score),
        })

    @app.route("/api/users/<string:name>/assessments", methods=["GET"])
    def list_user_assessments(name: str):
        session = SessionLocal()
        user = session.query(User).filter(User.name == name.strip()).first()
        if not user:
            return jsonify({"assessments": []})
        items = [{
            "assessment_id": a.id,
            "score": a.score,
            "level": a.level,
            "created_at": a.created_at.isoformat() if a.created_at else None,
        } for a in sorted(user.assessments, key=lambda x: x.created_at or datetime.min, reverse=True)]
        return jsonify({"name": user.name, "assessments": items})

    # Friendly JSON 404 / 500
    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"error": "not found"}), 404

    @app.errorhandler(500)
    def server_error(_):
        return jsonify({"error": "internal server error"}), 500

    return app


# Module-level app for gunicorn: `gunicorn app:app`
app = create_app()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=bool(os.environ.get("FLASK_DEBUG")))
