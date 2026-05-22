import { useState } from "react";
import Welcome from "./pages/welcome";
import Questionnaire from "./pages/questionnaire";
import Roadmap from "./pages/roadmap";

function App() {
  const [userName, setUserName] = useState(null);
  const [score, setScore] = useState(null);

  return (
    <div>
      {/* STEP 1: WELCOME */}
      {!userName && (
        <Welcome onStart={setUserName} />
      )}

      {/* STEP 2: QUESTIONNAIRE */}
      {userName && score === null && (
        <Questionnaire onComplete={setScore} />
      )}

      {/* STEP 3: ROADMAP */}
      {userName && score !== null && (
        <Roadmap userName={userName} score={score} />
      )}
    </div>
  );
}

export default App;