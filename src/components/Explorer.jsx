import { LEVELS, SCALE_STEPS, aqiToPos, centerPosOf, levelFor, posToAqi } from "../aqi";

// Six equal colour bands, one per AQI level.
const SCALE_GRADIENT = `linear-gradient(to right, ${LEVELS.map((l, i) => {
  const from = ((i / LEVELS.length) * 100).toFixed(3);
  const to = (((i + 1) / LEVELS.length) * 100).toFixed(3);
  return `${l.color} ${from}% ${to}%`;
}).join(", ")})`;

// Lets the visitor drag along the AQI scale to see how the landscape (and
// the "what this means" section) changes. `previewPos` is null when we are
// showing the real reading, otherwise a slider position from 0 to 600.
export default function Explorer({ reading, previewPos, onPreview }) {
  const realPos = reading ? aqiToPos(reading.aqi) : null;
  const previewing = previewPos !== null;
  const pos = previewing ? previewPos : (realPos ?? 0);
  const aqi = previewing ? posToAqi(previewPos) : reading ? reading.aqi : null;
  const level = aqi === null ? null : levelFor(aqi);

  let readout = "Drag the slider, or pick a level, to see how the view changes.";
  if (level && previewing) readout = `Previewing AQI ${aqi}: ${level.category}. This is not your air.`;
  if (level && !previewing) readout = `Your air right now: AQI ${aqi}, ${level.category}.`;

  return (
    <section className="explorer glass" aria-label="Explore air quality levels">
      <div className="explorer-head">
        <div>
          <h2>See how the view changes</h2>
          <p className="explorer-readout" aria-live="polite">
            {readout}
          </p>
        </div>
        {previewing && (
          <button type="button" className="secondary small" onClick={() => onPreview(null)}>
            {reading ? "Back to my air" : "Reset"}
          </button>
        )}
      </div>

      <div className="scale" style={{ "--scale": SCALE_GRADIENT }}>
        {realPos !== null && (
          <span className="you-marker" style={{ "--f": realPos / SCALE_STEPS }}>
            Your air
          </span>
        )}
        <input
          className="scale-input"
          type="range"
          min="0"
          max={SCALE_STEPS}
          step="1"
          value={pos}
          aria-label="Preview an air quality level"
          aria-valuetext={level ? `AQI ${aqi}, ${level.category}` : "No level chosen"}
          onChange={(e) => onPreview(Number(e.target.value))}
        />
      </div>

      <div className="level-chips">
        {LEVELS.map((l) => (
          <button
            key={l.key}
            type="button"
            className="level-chip"
            aria-pressed={level !== null && level.key === l.key}
            onClick={() => onPreview(centerPosOf(l.key))}
          >
            <span className="swatch" style={{ backgroundColor: l.color }} aria-hidden="true" />
            {l.short}
          </button>
        ))}
      </div>
    </section>
  );
}
