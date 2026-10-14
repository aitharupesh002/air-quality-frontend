import { SCALE_STEPS, aqiToPos } from "../aqi";

const R = 54;
const CIRCUMFERENCE = 2 * Math.PI * R;

// A ring that fills as air quality gets worse. The fill follows the same
// scale as the explorer slider, so each AQI band takes up an equal share.
export default function Gauge({ aqi, color }) {
  const fraction = Math.min(Math.max(aqiToPos(aqi) / SCALE_STEPS, 0.03), 1);

  return (
    <svg
      className="gauge"
      viewBox="0 0 132 132"
      width="132"
      height="132"
      role="img"
      aria-label={`US AQI ${aqi}`}
    >
      <circle className="gauge-track" cx="66" cy="66" r={R} />
      <circle
        className="gauge-arc"
        cx="66"
        cy="66"
        r={R}
        stroke={color}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
        transform="rotate(-90 66 66)"
        style={{ "--circ": CIRCUMFERENCE }}
      />
      <text className="gauge-number" x="66" y="76" textAnchor="middle">
        {aqi}
      </text>
      <text className="gauge-unit" x="66" y="96" textAnchor="middle">
        US AQI
      </text>
    </svg>
  );
}
