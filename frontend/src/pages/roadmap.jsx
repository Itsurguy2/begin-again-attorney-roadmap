import { useEffect, useState } from "react";
import { api } from "../api";
import "./roadmap.css";

function Roadmap({ userName, score, result, onRestart }) {
  const [data, setData] = useState(result || null);
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState("");

  useEffect(() => {
    if (data) return;
    let cancelled = false;
    setLoading(true);
    api
      .roadmap(score)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err?.message || "Could not load your roadmap.");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [data, score]);

  if (loading) {
    return (
      <div className="roadmap-container">
        <div className="loading-state" role="status" aria-live="polite">
          <div className="spinner-lg" aria-hidden />
          <p>Building your roadmap…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="roadmap-container">
        <div className="error-state">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={onRestart}>
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const r = data || {};

  return (
    <div className="roadmap-container">
      {/* TOP BAR */}
      <header className="roadmap-topbar">
        <span className="brand-tag">⚖️ Attorney Roadmap</span>
        <button className="restart-btn" onClick={onRestart}>
          Start Over
        </button>
      </header>

      {/* HERO */}
      <section className="roadmap-hero">
        <span
          className="level-pill"
          style={{ background: r.color || "var(--accent-2)" }}
        >
          {r.level || "Your Roadmap"}
        </span>
        <h1>Fast-Track Attorney Roadmap</h1>
        {userName && (
          <p className="greeting">
            Built for <strong>{userName}</strong>
          </p>
        )}

        <div className="score-row">
          <div className="score-card">
            <span className="score-label">Score</span>
            <span className="score-value">{r.score ?? score}</span>
            <span className="score-out">/ {r.max_score ?? 420}</span>
          </div>
          <div className="score-card">
            <span className="score-label">Percent</span>
            <span className="score-value">{r.percent ?? "—"}%</span>
          </div>
          <div className="score-card">
            <span className="score-label">Timeline</span>
            <span className="score-value">{r.timeline_months ?? "—"}</span>
            <span className="score-out">months</span>
          </div>
        </div>

        {r.message && <p className="hero-message">{r.message}</p>}
        {r.focus && <p className="hero-focus">→ {r.focus}</p>}
      </section>

      {/* STEPS */}
      {Array.isArray(r.steps) && r.steps.length > 0 && (
        <section className="roadmap-section">
          <h2>🧭 Your Plan</h2>
          <ol className="step-list">
            {r.steps.map((s, i) => (
              <li key={s.id || i} className="step-item">
                <span className="step-num">{i + 1}</span>
                <div className="step-body">
                  <h3>{s.title}</h3>
                  <p>{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* AFFORDABLE SCHOOLS */}
      <SchoolSection
        title="🎯 Affordable Law Schools"
        items={r.schools_affordable}
      />

      {/* ACCELERATED PROGRAMS */}
      <SchoolSection
        title="⚡ Accelerated JD Programs"
        items={r.schools_accelerated}
      />

      {/* ELITE SCHOOLS */}
      <SchoolSection
        title="🏆 High-Return Schools"
        items={r.schools_elite}
      />

      {/* LSAT */}
      <section className="roadmap-section highlight">
        <h2>🧠 LSAT Strategy</h2>
        <p>
          The LSAT is your single largest admissions lever.
        </p>
        <ul className="lsat-tiers">
          <li><span className="tier">155–160</span> Strong admissions</li>
          <li><span className="tier tier-mid">160–165</span> Scholarship range</li>
          <li><span className="tier tier-high">165+</span> Major advantage</li>
        </ul>
      </section>

      {/* TIMELINE */}
      <section className="roadmap-section">
        <h2>📅 Fast-Track Timeline</h2>
        <ul className="timeline">
          <li><strong>Months 1–3:</strong> LSAT fundamentals</li>
          <li><strong>Months 3–6:</strong> Practice exams</li>
          <li><strong>Months 6–12:</strong> Applications</li>
          <li><strong>2–4 Years:</strong> Law school</li>
          <li><strong>After:</strong> Bar exam → licensure</li>
        </ul>
      </section>

      {/* FINAL */}
      <section className="roadmap-section final">
        <h2>🏁 Final Word</h2>
        <p>
          Success is execution, not prestige — consistency, affordability, and
          discipline win. The plan above is yours. Now do the work.
        </p>
      </section>

      <footer className="roadmap-footer">
        <p>Built for working adults · © {new Date().getFullYear()} Attorney Roadmap</p>
      </footer>
    </div>
  );
}

function SchoolSection({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="roadmap-section">
      <h2>{title}</h2>
      <div className="card-grid">
        {items.map((s, i) => (
          <a
            key={s.url || i}
            className="school-card"
            href={s.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            <h3>{s.name}</h3>
            <p>{s.blurb}</p>
            <span className="card-cta">Visit site →</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Roadmap;
