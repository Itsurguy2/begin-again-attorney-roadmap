import { useState } from "react";
import bgImage from "../assets/welcome_attorney2.webp";
import "./welcome.css";

function Welcome({ onStart }) {
  const [name, setName] = useState("");
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    setIsStarted(true);
  };

  const handleHome = () => {
    setIsStarted(false);
    setName("");
  };

  const handleContinue = () => {
    if (!name.trim()) {
      alert("Please enter your name before continuing.");
      return;
    }

    onStart(name);
  };

  return (
    <div
      className="welcome-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="overlay">
        <h1>Begin Attorney Roadmap</h1>

        {!isStarted ? (
          <div className="welcome-card">
            <h2>Welcome Future Attorney</h2>

            <p>Enter your name to begin your legal journey.</p>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button onClick={handleStart}>
              Get Started
            </button>
          </div>
        ) : (
          <div className="message-card">
            <h2>Welcome, {name}</h2>

            <div className="legal-message">
              <p>
                Becoming an attorney is not a title you earn once—it is a responsibility you choose every day.
              </p>

              <p>
                If you are here, you are stepping into a profession that demands clarity under pressure, discipline in the face of complexity, and integrity when no one is watching. The law is not just a system of rules; it is a living structure that shapes lives, resolves conflict, and protects what people value most.
              </p>

              <p>
                There will be moments when the work feels technical and demanding: drafting, research, deadlines, and complex reasoning. Precision is not bureaucracy—it is service.
              </p>

              <p>
                The strongest attorneys are defined not by how quickly they speak, but by how carefully they listen and how consistently they earn trust.
              </p>

              <p>
                <strong>Welcome to the practice of law. Now the work begins.</strong>
              </p>
            </div>

            <div className="button-row">
              <button className="home-btn" onClick={handleHome}>
                Home
              </button>

              <button
                className="continue-btn"
                onClick={handleContinue}
                disabled={!name.trim()}
              >
                Continue to Questionnaire
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Welcome;