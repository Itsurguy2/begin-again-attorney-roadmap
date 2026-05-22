import { useRef, useState } from "react";
import "./questionnaire.css";

function Questionnaire({ onComplete }) {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [missing, setMissing] = useState([]);
  const [isReviewMode, setIsReviewMode] = useState(false);

  const questionRefs = useRef({});

  // =========================
  // HANDLE ANSWERS
  // =========================
  const handleSelect = (id, value) => {
    const updated = { ...answers, [id]: Number(value) };
    setAnswers(updated);

    const total = Object.values(updated).reduce((a, b) => a + b, 0);
    setScore(total);

    setMissing((prev) => prev.filter((q) => q !== id));
  };

  // =========================
  // QUESTIONS
  // =========================
  const questions = [
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

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async () => {
    const unanswered = questions
      .filter((q) => !answers[q.id])
      .map((q) => q.id);

    if (unanswered.length > 0) {
      setMissing(unanswered);

      const firstMissing = unanswered[0];
      questionRefs.current[firstMissing]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      alert(`Please complete ${unanswered.length} unanswered question(s).`);
      return;
    }

    const finalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    setScore(finalScore);

    setSubmitted(true);
    setIsReviewMode(false);

    // =========================
  // 🔥 BACKEND CALL (ADDED ONLY)
  // =========================
  try {
    const response = await fetch("http://localhost:5000/api/analyze-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: userName,   // comes from props
        score: finalScore
      })
    });

    const data = await response.json();
    console.log("Backend response:", data);

  } catch (error) {
    console.error("Backend error:", error);
    alert("Could not connect to backend.");
  }
};
  

  // =========================
  // EDIT MODE
  // =========================
  const handleEdit = () => {
    setSubmitted(false);
    setIsReviewMode(true);
  };

  const getLevel = () => {
    if (score >= 360) return "FAST-TRACK READY";
    if (score >= 280) return "POTENTIAL TO SUCCEED";
    if (score >= 200) return "NOT YET READY";
    return "BUILD YOUR FOUNDATION FIRST";
  };

  return (
    <div className="questionnaire-container">
      <h1>Fast-Track Attorney Readiness Assessment</h1>

      {!submitted ? (
        <div className="questionnaire-card">

          {questions.map((q) => (
            <div
              key={q.id}
              ref={(el) => (questionRefs.current[q.id] = el)}
              className={`question-block ${missing.includes(q.id) ? "missing" : ""}`}
            >
              <h3>{q.q}</h3>

              <div className="options">
                {q.type === "scale"
                  ? [1,2,3,4,5,6,7,8,9,10].map((val) => (
                      <label key={val}>
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          checked={answers[q.id] === val}
                          onChange={() => handleSelect(q.id, val)}
                        />
                        {val}
                      </label>
                    ))
                  : q.options.map((opt, i) => (
                      <label key={i}>
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          checked={answers[q.id] === opt.value}
                          onChange={() => handleSelect(q.id, opt.value)}
                        />
                        {opt.text}
                      </label>
                    ))}
              </div>
            </div>
          ))}

          <button onClick={handleSubmit}>
            Submit Assessment
          </button>

        </div>
      ) : (
        <div className="result-card">
          <h2>{getLevel()}</h2>
          <p>Total Score: {score}</p>

          <button onClick={() => onComplete(score)}>
            Continue to Roadmap
          </button>

          <button
            onClick={handleEdit}
            style={{ marginTop: "10px", background: "#f59e0b" }}
          >
            Edit Answers
          </button>
        </div>
      )}
    </div>
  );
}

export default Questionnaire;