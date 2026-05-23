import { useState } from "react";
import bgImage from "../assets/welcome_attorney2.webp";
import "./welcome.css";

function Welcome({ onStart }) {
  const [name, setName] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [error, setError] = useState("");

  const handleStart = (e) => {
    e?.preventDefault?.();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name to continue.");
      return;
    }
    setError("");
    setIsStarted(true);
  };

  const handleHome = () => {
    setIsStarted(false);
    setName("");
    setError("");
  };

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name before continuing.");
      return;
    }
    onStart(trimmed);
  };

  return (
    <div
      className="welcome-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="overlay">
        <header className="brand">
          <span className="brand-mark" aria-hidden>⚖️</span>
          <span className="brand-name">Attorney Roadmap</span>
        </header>

        {!isStarted ? (
          <form className="welcome-card" onSubmit={handleStart}>
            <p className="eyebrow">Begin Your Journey</p>
            <h1>Welcome, Future Attorney</h1>
            <p className="lead">
              A focused, no-fluff plan for working adults pursuing a legal
              career. Take the 5-minute readiness assessment to get your
              personalized roadmap.
            </p>

            <label htmlFor="name" className="field-label">
              Your name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="given-name"
              inputMode="text"
              placeholder="e.g. Jose Rivera"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              aria-invalid={!!error}
              aria-describedby={error ? "name-error" : undefined}
            />
            {error && (
              <p id="name-error" className="error-text" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary">
              Get Started
            </button>

            <ul className="trust-row" aria-label="What you get">
              <li>✅ 42-question readiness assessment</li>
              <li>✅ Personalized score &amp; level</li>
              <li>✅ Custom roadmap with schools and timeline</li>
            </ul>
          </form>
        ) : (
          <div className="message-card">
            <p className="eyebrow">A Word Before You Begin</p>
            <h2>Welcome, {name}</h2>

            <div className="legal-message">
              <p>
                Becoming an attorney is not a title you earn once — it is a
                responsibility you choose every day.
              </p>
              <p>
                If you are here, you are stepping into a profession that demands
                clarity under pressure, discipline in the face of complexity,
                and integrity when no one is watching.
              </p>
              <p>
                There will be moments when the work feels technical and
                demanding: drafting, research, deadlines, complex reasoning.
                Precision is not bureaucracy — it is service.
              </p>
              <p>
                The strongest attorneys are defined not by how quickly they
                speak, but by how carefully they listen and how consistently
                they earn trust.
              </p>
              <p>
                <strong>Welcome to the practice of law. Now the work begins.</strong>
              </p>
            </div>

            <div className="button-row">
              <button className="btn-secondary" onClick={handleHome}>
                ← Back
              </button>
              <button
                className="btn-primary"
                onClick={handleContinue}
                disabled={!name.trim()}
              >
                Continue to Assessment →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Welcome;
