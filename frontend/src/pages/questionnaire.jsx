import { useMemo, useRef, useState } from "react";
import { api } from "../api";
import { buildLocalRoadmap } from "../lib/roadmap";
import "./questionnaire.css";

const QUESTIONS = [
  {
    id: 1,
    q: "What is your primary motivation for becoming an attorney?",
    type: "mc",
    options: [
      { text: "Prestige only", value: 2 },
      { text: "Primarily financial gain", value: 4 },
      { text: "Career growth and stability", value: 6 },
      { text: "Purpose and financial freedom", value: 8 },
      { text: "Passion and long-term mission", value: 10 },
    ],
  },
  { id: 2, q: "Are you willing to sacrifice most of your free time for the next 2–3 years?", type: "scale" },
  { id: 3, q: "Can you consistently study after work and on weekends?", type: "scale" },
  { id: 4, q: "How disciplined are you when no one is supervising you?", type: "scale" },
  { id: 5, q: "How well do you handle stress and deadlines?", type: "scale" },
  { id: 6, q: "Would you continue even when you feel exhausted or discouraged?", type: "scale" },
  { id: 7, q: "How committed are you to completing law school regardless of difficulty?", type: "scale" },
  { id: 8, q: "How confident are you in your ability to transform your life through education?", type: "scale" },
  {
    id: 9,
    q: "How many hours per week can you realistically dedicate to studying?",
    type: "mc",
    options: [
      { text: "Less than 5 hours", value: 1 },
      { text: "5–8 hours", value: 3 },
      { text: "9–12 hours", value: 5 },
      { text: "13–18 hours", value: 8 },
      { text: "19+ hours", value: 10 },
    ],
  },
  { id: 10, q: "How supportive is your current schedule for academic study?", type: "scale" },
  { id: 11, q: "Can you temporarily reduce distractions in your daily environment?", type: "scale" },
  { id: 12, q: "How stable is your current daily routine?", type: "scale" },
  { id: 13, q: "How supportive is your household or family environment?", type: "scale" },
  { id: 14, q: "Are you willing to consistently study on weekends?", type: "scale" },
  { id: 15, q: "How comfortable are you with independent online learning?", type: "scale" },
  {
    id: 16,
    q: "Which best describes your current financial situation?",
    type: "mc",
    options: [
      { text: "Severe financial instability", value: 1 },
      { text: "Living paycheck to paycheck", value: 3 },
      { text: "Tight but manageable", value: 5 },
      { text: "Stable with budgeting", value: 8 },
      { text: "Financially secure", value: 10 },
    ],
  },
  { id: 17, q: "Are you willing to avoid unnecessary debt during your studies?", type: "scale" },
  { id: 18, q: "Would you consider an affordable or hybrid law program?", type: "scale" },
  { id: 19, q: "Are you able to work while attending school if necessary?", type: "scale" },
  {
    id: 20,
    q: "How much emergency savings do you currently have?",
    type: "mc",
    options: [
      { text: "None", value: 1 },
      { text: "Less than 1 month of expenses", value: 3 },
      { text: "1–3 months", value: 6 },
      { text: "3–6 months", value: 8 },
      { text: "6+ months", value: 10 },
    ],
  },
  { id: 21, q: "Are you willing to temporarily live below your means?", type: "scale" },
  { id: 22, q: "Would you relocate for better opportunities?", type: "scale" },
  {
    id: 23,
    q: "When did you last engage in serious academic study?",
    type: "mc",
    options: [
      { text: "More than 10 years ago", value: 2 },
      { text: "5–10 years ago", value: 4 },
      { text: "2–5 years ago", value: 6 },
      { text: "Within the last 2 years", value: 8 },
      { text: "Currently studying regularly", value: 10 },
    ],
  },
  { id: 24, q: "How strong are your reading skills?", type: "scale" },
  { id: 25, q: "How strong are your writing skills?", type: "scale" },
  { id: 26, q: "Can you focus for long periods?", type: "scale" },
  { id: 27, q: "Have you completed long-term goals before?", type: "scale" },
  { id: 28, q: "Are you willing to improve weak academic areas?", type: "scale" },
  {
    id: 29,
    q: "How do you respond to academic pressure?",
    type: "mc",
    options: [
      { text: "I shut down", value: 1 },
      { text: "I avoid it", value: 3 },
      { text: "I struggle but continue", value: 6 },
      { text: "I adapt and improve", value: 8 },
      { text: "Pressure motivates me", value: 10 },
    ],
  },
  { id: 30, q: "Are you open to nontraditional paths?", type: "scale" },
  { id: 31, q: "How clear is your legal career vision?", type: "scale" },
  {
    id: 32,
    q: "What motivates you most?",
    type: "mc",
    options: [
      { text: "Status", value: 2 },
      { text: "Money only", value: 4 },
      { text: "Stability", value: 6 },
      { text: "Freedom and opportunity", value: 8 },
      { text: "Purpose and impact", value: 10 },
    ],
  },
  { id: 33, q: "How willing are you to network?", type: "scale" },
  { id: 34, q: "How committed are you to improving financially?", type: "scale" },
  { id: 35, q: "Are you comfortable speaking professionally?", type: "scale" },
  { id: 36, q: "Have you researched licensing requirements?", type: "scale" },
  { id: 37, q: "How determined are you to succeed?", type: "scale" },
  { id: 38, q: "Can you stay committed during slow progress?", type: "scale" },
  { id: 39, q: "How resilient are you after setbacks?", type: "scale" },
  { id: 40, q: "How strong is your desire for a better future?", type: "scale" },
  { id: 41, q: "Are you willing to commit 2–3 difficult years?", type: "scale" },
  {
    id: 42,
    q: "Would you regret not pursuing law?",
    type: "mc",
    options: [
      { text: "Not at all", value: 1 },
      { text: "Maybe", value: 4 },
      { text: "Probably", value: 6 },
      { text: "Definitely", value: 8 },
      { text: "Absolutely", value: 10 },
    ],
  },
];

const SCALE_LABELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

function Questionnaire({ userName, onComplete, onBack }) {
  const [answers, setAnswers] = useState({});
  const [missing, setMissing] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState(null);
  const [isReviewMode, setIsReviewMode] = useState(false);

  const questionRefs = useRef({});

  const totalQuestions = QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const score = useMemo(
    () => Object.values(answers).reduce((a, b) => a + b, 0),
    [answers]
  );
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  const handleSelect = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: Number(value) }));
    setMissing((prev) => prev.filter((q) => q !== id));
    if (submitError) setSubmitError("");
  };

  const handleSubmit = async () => {
    const unanswered = QUESTIONS.filter((q) => !answers[q.id]).map((q) => q.id);
    if (unanswered.length > 0) {
      setMissing(unanswered);
      const firstMissingEl = questionRefs.current[unanswered[0]];
      firstMissingEl?.scrollIntoView({ behavior: "smooth", block: "center" });
      setSubmitError(
        `${unanswered.length} question${unanswered.length === 1 ? "" : "s"} still need an answer.`
      );
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const data = await api.analyzeScore({
        name: userName,
        score,
        answers,
      });
      setResult(data);
    } catch (err) {
      // Backend unreachable — degrade gracefully. Compute the same result
      // locally so the user still sees their score and roadmap.
      console.warn("Backend unreachable, using local fallback:", err);
      const local = buildLocalRoadmap(score);
      setResult({ ...local, name: userName });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = () => {
    setResult(null);
    setIsReviewMode(true);
  };

  const handleReset = () => {
    setAnswers({});
    setMissing([]);
    setResult(null);
    setIsReviewMode(false);
    setSubmitError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -----------------------------------------------------------
  // RESULT VIEW
  // -----------------------------------------------------------
  if (result) {
    return (
      <div className="questionnaire-container">
        <div className="result-card" role="status" aria-live="polite">
          <span
            className="result-pill"
            style={{ background: result.color || "var(--accent-2)" }}
          >
            {result.level}
          </span>
          <h2>Your Readiness Score</h2>
          <p className="result-score">
            <span className="score-big">{result.score}</span>
            <span className="score-max"> / {result.max_score}</span>
            <span className="score-pct"> · {result.percent}%</span>
          </p>

          <div className="result-progress">
            <div
              className="result-progress-bar"
              style={{
                width: `${result.percent}%`,
                background: result.color || "var(--accent)",
              }}
            />
          </div>

          <p className="result-message">{result.message}</p>
          {result.focus && <p className="result-focus">{result.focus}</p>}

          {result.offline && (
            <p className="offline-note" role="status">
              ⚠ Couldn't reach the server, so this result wasn't saved to
              your history. Your roadmap is still ready below.
            </p>
          )}

          <div className="button-row">
            <button className="btn-ghost" onClick={handleEdit}>
              Edit Answers
            </button>
            <button
              className="btn-primary"
              onClick={() => onComplete(result.score, result)}
            >
              View Your Roadmap →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // QUESTIONNAIRE VIEW
  // -----------------------------------------------------------
  return (
    <div className="questionnaire-container">
      <div className="progress-bar-wrap" role="region" aria-label="Progress">
        <div className="progress-bar-inner">
          <div className="progress-meta">
            <button className="back-link" onClick={onBack} aria-label="Back to start">
              ← Restart
            </button>
            <span className="progress-text">
              {answeredCount} of {totalQuestions} answered
              {isReviewMode && <span className="review-tag"> · editing</span>}
            </span>
          </div>
          <div className="progress-track" aria-hidden>
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <header className="questionnaire-header">
        <h1>Fast-Track Attorney Readiness Assessment</h1>
        <p className="lede">
          Answer honestly. Your responses generate a personalized roadmap.
        </p>
      </header>

      <div className="questionnaire-card">
        {QUESTIONS.map((q, idx) => (
          <div
            key={q.id}
            ref={(el) => (questionRefs.current[q.id] = el)}
            className={`question-block ${missing.includes(q.id) ? "missing" : ""} ${answers[q.id] ? "answered" : ""}`}
          >
            <div className="q-head">
              <span className="q-number">{idx + 1}</span>
              <h3>{q.q}</h3>
            </div>

            {q.type === "scale" ? (
              <div
                className="scale-grid"
                role="radiogroup"
                aria-label={q.q}
              >
                {[1,2,3,4,5,6,7,8,9,10].map((val) => (
                  <button
                    key={val}
                    type="button"
                    role="radio"
                    aria-checked={answers[q.id] === val}
                    className={`scale-btn ${answers[q.id] === val ? "selected" : ""}`}
                    onClick={() => handleSelect(q.id, val)}
                  >
                    {val}
                  </button>
                ))}
                <div className="scale-legend" aria-hidden>
                  <span>{SCALE_LABELS[0]}</span>
                  <span>{SCALE_LABELS[4]}</span>
                </div>
              </div>
            ) : (
              <div
                className="options"
                role="radiogroup"
                aria-label={q.q}
              >
                {q.options.map((opt, i) => {
                  const selected = answers[q.id] === opt.value;
                  return (
                    <button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`option-btn ${selected ? "selected" : ""}`}
                      onClick={() => handleSelect(q.id, opt.value)}
                    >
                      <span className="option-radio" aria-hidden />
                      <span className="option-text">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {submitError && (
          <p className="form-error" role="alert">
            {submitError}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary submit-btn"
        >
          {submitting ? (
            <>
              <span className="spinner" aria-hidden /> Analyzing…
            </>
          ) : (
            <>Submit Assessment</>
          )}
        </button>

        <p className="live-score" aria-live="polite">
          Current score: <strong>{score}</strong> / 420
        </p>
      </div>
    </div>
  );
}

export default Questionnaire;
