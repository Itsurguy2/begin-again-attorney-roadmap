import { useEffect, useState } from "react";
import Welcome from "./pages/welcome";
import Questionnaire from "./pages/questionnaire";
import Roadmap from "./pages/roadmap";

const STORAGE_KEY = "attorney_roadmap_state_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function App() {
  const initial = loadState();
  const [userName, setUserName] = useState(initial.userName ?? null);
  const [score, setScore] = useState(initial.score ?? null);
  const [result, setResult] = useState(initial.result ?? null);

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ userName, score, result })
      );
    } catch {
      /* localStorage disabled — silently no-op */
    }
  }, [userName, score, result]);

  const reset = () => {
    setUserName(null);
    setScore(null);
    setResult(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const onAssessmentComplete = (finalScore, backendResult) => {
    setScore(finalScore);
    setResult(backendResult ?? null);
  };

  return (
    <>
      {!userName && <Welcome onStart={setUserName} />}

      {userName && score === null && (
        <Questionnaire
          userName={userName}
          onBack={reset}
          onComplete={onAssessmentComplete}
        />
      )}

      {userName && score !== null && (
        <Roadmap
          userName={userName}
          score={score}
          result={result}
          onRestart={reset}
        />
      )}
    </>
  );
}

export default App;
