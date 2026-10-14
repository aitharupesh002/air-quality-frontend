// The six US AQI bands. `color` is the band's chip colour and `ink` is the
// text colour that stays readable on top of it.
export const LEVELS = [
  { key: "good", category: "Good", short: "Good", min: 0, max: 50, color: "#4cbf6b", ink: "#0c2915" },
  { key: "moderate", category: "Moderate", short: "Moderate", min: 51, max: 100, color: "#f2c230", ink: "#2b2100" },
  {
    key: "sensitive",
    category: "Unhealthy for Sensitive Groups",
    short: "Sensitive groups",
    min: 101,
    max: 150,
    color: "#f08a24",
    ink: "#2e1600",
  },
  { key: "unhealthy", category: "Unhealthy", short: "Unhealthy", min: 151, max: 200, color: "#e5534b", ink: "#2b0806" },
  {
    key: "very-unhealthy",
    category: "Very Unhealthy",
    short: "Very unhealthy",
    min: 201,
    max: 300,
    color: "#8e4b9e",
    ink: "#ffffff",
  },
  { key: "hazardous", category: "Hazardous", short: "Hazardous", min: 301, max: 500, color: "#7a1f2e", ink: "#ffffff" },
];

export function levelFor(aqi) {
  const value = Number(aqi);
  if (aqi === null || aqi === undefined || Number.isNaN(value)) return null;
  if (value <= 50) return LEVELS[0];
  if (value <= 100) return LEVELS[1];
  if (value <= 150) return LEVELS[2];
  if (value <= 200) return LEVELS[3];
  if (value <= 300) return LEVELS[4];
  return LEVELS[5];
}

export function categoryFor(aqi) {
  const level = levelFor(aqi);
  return level ? level.category : "Unknown";
}

export function adviceFor(category) {
  switch (category) {
    case "Good":
      return "Air quality is good. Enjoy outdoor activities.";
    case "Moderate":
      return "Air quality is acceptable. Unusually sensitive people should limit long outdoor exertion.";
    case "Unhealthy for Sensitive Groups":
      return "Children, older adults and people with asthma or heart conditions should limit prolonged outdoor exertion.";
    case "Unhealthy":
      return "Everyone may start to feel effects. Limit outdoor exertion; sensitive groups should stay indoors.";
    case "Very Unhealthy":
      return "Health alert: avoid outdoor activity. If you must go out, wear an N95 mask.";
    case "Hazardous":
      return "Emergency conditions. Stay indoors, keep windows closed and avoid all outdoor activity.";
    default:
      return "";
  }
}

export function colorFor(category) {
  const level = LEVELS.find((l) => l.category === category);
  return level ? level.color : "#757575";
}

export function inkFor(category) {
  const level = LEVELS.find((l) => l.category === category);
  return level ? level.ink : "#ffffff";
}

// ---- The explorer slider ----
// The slider gives every band the same width, so "Good" (0-50) is as easy to
// land on as "Hazardous" (301-500). These helpers convert between a slider
// position (0-600) and an AQI value (0-500).
const EDGES = [0, 51, 101, 151, 201, 301, 501];
export const SCALE_STEPS = LEVELS.length * 100;

export function posToAqi(pos) {
  const p = Math.min(Math.max(Number(pos), 0), SCALE_STEPS);
  const i = Math.min(Math.floor(p / 100), LEVELS.length - 1);
  const fraction = (p - i * 100) / 100;
  const value = EDGES[i] + fraction * (EDGES[i + 1] - EDGES[i]);
  return Math.min(500, Math.round(value));
}

export function aqiToPos(aqi) {
  const a = Math.min(Math.max(Number(aqi), 0), 500);
  let i = LEVELS.length - 1;
  for (let idx = 0; idx < LEVELS.length; idx++) {
    if (a < EDGES[idx + 1]) {
      i = idx;
      break;
    }
  }
  return i * 100 + ((a - EDGES[i]) / (EDGES[i + 1] - EDGES[i])) * 100;
}

// Position in the middle of a band, used when a level chip is clicked.
export function centerPosOf(levelKey) {
  const i = LEVELS.findIndex((l) => l.key === levelKey);
  return i * 100 + 50;
}
