import "./roadmap.css";

function Roadmap({ userName, score }) {
  return (
    <div className="roadmap-container">

      {/* HERO */}
      <div className="roadmap-hero">
        <h1>⚖️ Fast-Track Attorney Roadmap</h1>

        {userName && (
          <p>
            Welcome, <strong>{userName}</strong>
          </p>
        )}

        {score !== null && (
          <p>Your Score: <strong>{score}</strong></p>
        )}

        <p>
          A structured execution plan for working adults pursuing a legal career efficiently.
        </p>
      </div>

      {/* CORE REALITY */}
      <section className="roadmap-section">
        <h2>🧠 Core Reality</h2>
        <p>
          Becoming an attorney requires four things: LSAT performance, strategic law school selection,
          completion of a JD program, and passing the bar exam.
        </p>
      </section>

      {/* STEP 1 */}
      <section className="roadmap-section">
        <h2>⚡ Step 1: Legal Direction</h2>
        <p>
          Focused paths include immigration law, public interest law, government law, and corporate law.
        </p>
      </section>

      {/* STEP 2 */}
      <section className="roadmap-section">
        <h2>🎯 Step 2: Affordable Law Schools</h2>

        <div className="card-grid">

          <a className="school-card" href="https://www.law.cuny.edu" target="_blank" rel="noreferrer">
            <h3>CUNY School of Law</h3>
            <p>Low-cost, public interest focused, strong clinical training.</p>
          </a>

          <a className="school-card" href="https://www.law.udc.edu" target="_blank" rel="noreferrer">
            <h3>UDC Law</h3>
            <p>Hands-on courtroom training with extremely low tuition.</p>
          </a>

          <a className="school-card" href="https://law.und.edu" target="_blank" rel="noreferrer">
            <h3>University of North Dakota Law</h3>
            <p>Small classes and strong bar exam preparation support.</p>
          </a>

        </div>
      </section>

      {/* STEP 3 */}
      <section className="roadmap-section">
        <h2>⚡ Step 3: Accelerated JD Programs</h2>

        <div className="card-grid">

          <a className="school-card" href="https://tourolaw.edu" target="_blank" rel="noreferrer">
            <h3>Touro Law Center</h3>
            <p>FlexTime JD designed for working professionals (hybrid learning).</p>
          </a>

          <a className="school-card" href="https://www.albanylaw.edu" target="_blank" rel="noreferrer">
            <h3>Albany Law School</h3>
            <p>Flexible JD program with hybrid structure and policy focus.</p>
          </a>

          <a className="school-card" href="https://www.swlaw.edu" target="_blank" rel="noreferrer">
            <h3>Southwestern Law School</h3>
            <p>2-year SCALE accelerated JD program.</p>
          </a>

        </div>
      </section>

      {/* STEP 4 */}
      <section className="roadmap-section">
        <h2>🏆 High-Return Schools</h2>

        <div className="card-grid">

          {/* FIXED NYU LINK (CONFIRMED CORRECT) */}
          <a
            className="school-card"
            href="https://www.law.nyu.edu/"
            target="_blank"
            rel="noreferrer"
          >
            <h3>NYU School of Law</h3>
            <p>
              Elite legal education with strong public interest funding and global opportunities.
            </p>
          </a>

          <a
            className="school-card"
            href="https://www.fordham.edu/school-of-law/"
            target="_blank"
            rel="noreferrer"
          >
            <h3>Fordham Law School</h3>
            <p>Strong NYC employment outcomes and litigation pipeline.</p>
          </a>

        </div>
      </section>

      {/* LSAT */}
      <section className="roadmap-section highlight">
        <h2>🧠 LSAT Strategy (Most Important Lever)</h2>
        <p>
          155–160: strong admissions | 160–165: scholarships | 165+: major advantage.
        </p>
      </section>

      {/* TIMELINE */}
      <section className="roadmap-section">
        <h2>📅 Fast-Track Timeline</h2>

        <ul className="timeline">
          <li><strong>Months 1–3:</strong> LSAT fundamentals</li>
          <li><strong>Months 3–6:</strong> Practice exams</li>
          <li><strong>Months 6–12:</strong> Applications</li>
          <li><strong>2–4 Years:</strong> Law school completion</li>
          <li><strong>After:</strong> Bar exam → licensure</li>
        </ul>
      </section>

      {/* FINAL MESSAGE */}
      <section className="roadmap-section final">
        <h2>🏁 Final Message</h2>
        <p>
          Success is about execution, not prestige — consistency, affordability, and discipline win.
        </p>
      </section>

    </div>
  );
}

export default Roadmap;