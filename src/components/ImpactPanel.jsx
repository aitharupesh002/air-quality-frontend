import { LEVELS } from "../aqi";
import { IMPACT, LONG_TERM_NOTE, WEATHER_NOTE } from "../impact";

const COLUMNS = [
  { key: "body", title: "In your body" },
  { key: "land", title: "In the landscape" },
  { key: "act", title: "What to do" },
];

// "What this means": the health and environmental consequences of the AQI
// level currently shown (the real reading, or whatever the visitor is
// previewing with the slider).
export default function ImpactPanel({ level, aqi, previewing, placeName, onPickLevel }) {
  const info = level ? IMPACT[level.key] : null;

  let context = "";
  if (level && previewing) context = `You are previewing AQI ${aqi}. This is not the air at your location.`;
  if (level && !previewing) context = placeName ? `Based on the air in ${placeName} right now (AQI ${aqi}).` : `Based on AQI ${aqi}.`;

  return (
    <section id="impact" className="impact glass" aria-labelledby="impact-heading">
      {info ? (
        <>
          <h2 id="impact-heading">{info.headline}</h2>
          <p className="impact-context">{context}</p>

          <div className="impact-columns">
            {COLUMNS.map((col) => (
              <div className="impact-col" key={col.key}>
                <h3>{col.title}</h3>
                <ul style={{ "--marker": level.color }}>
                  {info[col.key].map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="impact-notes">
            <p>
              <strong>Weather.</strong> {WEATHER_NOTE}
            </p>
            <p>
              <strong>Over years.</strong> {LONG_TERM_NOTE}
            </p>
          </div>
        </>
      ) : (
        <>
          <h2 id="impact-heading">Air quality is graded from 0 to 500</h2>
          <p className="impact-context">
            Check your location above, or choose a level below, to see what it
            means for your health and for the landscape around you.
          </p>
        </>
      )}

      <h3 className="scale-title">The scale</h3>
      <ul className="scale-list">
        {LEVELS.map((l) => (
          <li key={l.key}>
            <button
              type="button"
              className="scale-row"
              aria-current={level !== null && level.key === l.key ? "true" : undefined}
              onClick={() => onPickLevel(l.key)}
            >
              <span className="swatch" style={{ backgroundColor: l.color }} aria-hidden="true" />
              <span className="scale-range">
                {l.min}&ndash;{l.max === 500 ? "500" : l.max}
              </span>
              <span className="scale-name">{l.category}</span>
              <span className="scale-summary">{IMPACT[l.key].summary}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
