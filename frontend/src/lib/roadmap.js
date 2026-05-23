// Client-side mirror of backend/app.py's classify() + roadmap_for().
// Used as a fallback so the user always sees their roadmap, even if the
// backend is unreachable. Keep this in sync with backend logic.

export const MAX_SCORE = 420;

const LEVELS = [
  { min: 360, level: "FAST-TRACK READY",
    message: "You are highly prepared. Move into LSAT prep immediately and target scholarship-tier scores.",
    color: "#22c55e" },
  { min: 280, level: "POTENTIAL TO SUCCEED",
    message: "Strong potential. Tighten study discipline and financial runway before applying.",
    color: "#38bdf8" },
  { min: 200, level: "NOT YET READY",
    message: "You need more preparation. Build the foundation before committing to law school.",
    color: "#f59e0b" },
  { min: 0,   level: "BUILD FOUNDATION FIRST",
    message: "Focus first on discipline, consistency, and finances. Law school can wait.",
    color: "#ef4444" },
];

function classify(score) {
  return LEVELS.find((b) => score >= b.min) || LEVELS[LEVELS.length - 1];
}

const STEPS = [
  { id: "direction", title: "Choose a legal direction",
    detail: "Immigration, public interest, government, or corporate law — pick one to focus prep around." },
  { id: "lsat", title: "LSAT strategy",
    detail: "155–160 strong admissions · 160–165 scholarships · 165+ major advantage." },
  { id: "schools", title: "Target affordable schools",
    detail: "CUNY, UDC, and UND lead on cost-to-outcome ratio." },
  { id: "accelerate", title: "Consider an accelerated JD",
    detail: "Touro FlexTime, Albany hybrid, or Southwestern SCALE 2-year program." },
  { id: "bar", title: "Bar plan",
    detail: "Start bar prep in 3L; target a single jurisdiction first." },
];

const SCHOOLS_AFFORDABLE = [
  { name: "CUNY School of Law", url: "https://www.law.cuny.edu",
    blurb: "Low cost · public-interest focus · strong clinics." },
  { name: "UDC Law", url: "https://www.law.udc.edu",
    blurb: "Hands-on courtroom training · extremely low tuition." },
  { name: "University of North Dakota Law", url: "https://law.und.edu",
    blurb: "Small classes · strong bar prep support." },
];

const SCHOOLS_ACCELERATED = [
  { name: "Touro Law (FlexTime JD)", url: "https://tourolaw.edu",
    blurb: "Hybrid program for working professionals." },
  { name: "Albany Law School", url: "https://www.albanylaw.edu",
    blurb: "Flexible hybrid JD with policy focus." },
  { name: "Southwestern Law (SCALE)", url: "https://www.swlaw.edu",
    blurb: "2-year accelerated JD." },
];

const SCHOOLS_ELITE = [
  { name: "NYU School of Law", url: "https://www.law.nyu.edu/",
    blurb: "Elite · strong public-interest funding · global reach." },
  { name: "Fordham Law School", url: "https://www.fordham.edu/school-of-law/",
    blurb: "Strong NYC employment outcomes · litigation pipeline." },
];

export function buildLocalRoadmap(score) {
  const safeScore = Math.max(0, Math.min(Number(score) || 0, MAX_SCORE));
  const bracket = classify(safeScore);

  let focus, timeline_months;
  switch (bracket.level) {
    case "FAST-TRACK READY":
      focus = "Aggressive timeline: register for the LSAT within 90 days.";
      timeline_months = 9; break;
    case "POTENTIAL TO SUCCEED":
      focus = "Tighten weekly study cadence and shore up finances for 6 months.";
      timeline_months = 12; break;
    case "NOT YET READY":
      focus = "Build a 12-month foundation in discipline and academic stamina.";
      timeline_months = 18; break;
    default:
      focus = "Spend 12+ months on habits and savings before any commitment.";
      timeline_months = 24;
  }

  return {
    score: safeScore,
    max_score: MAX_SCORE,
    percent: Math.round((safeScore / MAX_SCORE) * 1000) / 10,
    level: bracket.level,
    message: bracket.message,
    color: bracket.color,
    focus,
    timeline_months,
    steps: STEPS,
    schools_affordable: SCHOOLS_AFFORDABLE,
    schools_accelerated: SCHOOLS_ACCELERATED,
    schools_elite: SCHOOLS_ELITE,
    offline: true, // marker so UI can show a "saved offline" indicator
  };
}
