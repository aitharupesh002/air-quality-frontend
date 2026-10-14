import { useState } from "react";
import { createRecord } from "../api";
import { adviceFor, levelFor } from "../aqi";
import CitySearch from "./CitySearch";
import Gauge from "./Gauge";

const POLLUTANTS = [
  { key: "pm25", label: "PM2.5" },
  { key: "pm10", label: "PM10" },
  { key: "co", label: "CO" },
  { key: "no2", label: "NO₂" },
  { key: "so2", label: "SO₂" },
  { key: "o3", label: "O₃" },
];

// The main card on the page: ask for the user's location (or a city) and
// show the live reading. The lookup itself lives in useLiveAir (App.jsx).
export default function LivePanel({ live, onLocate, onPickPlace, onSearchText, onSaved }) {
  const { reading, stage, placeHint, error, loading } = live;

  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  // Remember which reading was saved, so a new reading starts "unsaved".
  const [savedReading, setSavedReading] = useState(null);
  // Pollutant tiles start open on wide screens and closed on phones, so the
  // landscape stays visible after a reading arrives.
  const [showPollutants, setShowPollutants] = useState(
    () => window.matchMedia("(min-width: 761px)").matches
  );

  async function handleSave() {
    setSaving(true);
    setSaveError("");
    try {
      await createRecord({
        city: reading.city,
        aqi: reading.aqi,
        pm25: reading.pm25,
        pm10: reading.pm10,
        remarks: "Auto-fetched (Open-Meteo)",
      });
      setSavedReading(reading);
      await onSaved();
    } catch (err) {
      setSaveError(`Could not save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  let status = "";
  if (stage === "locating") status = "Finding where you are";
  if (stage === "reading") {
    status = placeHint ? `Reading the air over ${placeHint}` : "Reading the air";
  }

  const level = reading ? levelFor(reading.aqi) : null;
  // "Delhi, Delhi, India" reads badly, so drop repeated parts.
  const placeName = reading
    ? [
        ...new Set(
          [reading.city, reading.region, reading.country]
            .filter(Boolean)
            .map((part) => part.trim())
        ),
      ].join(", ")
    : "";
  const saved = reading !== null && savedReading === reading;
  const shownError = formError || error;

  let heading = "What is in the air where you are?";
  if (loading) heading = status;
  if (reading) heading = placeName;

  return (
    <section className="live-panel glass" aria-labelledby="live-heading">
      <h1 id="live-heading" className={reading ? "place-name" : undefined}>
        {heading}
        {loading && (
          <span className="dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        )}
      </h1>

      {/* Announces progress to screen readers. */}
      <p className="sr-only" role="status">
        {status}
      </p>

      {!reading && !loading && (
        <p className="live-hint">
          Share your location or search a city. The view behind this page will
          change to match the air.
        </p>
      )}

      <div className="live-actions">
        <button type="button" onClick={onLocate} disabled={loading}>
          {loading ? "Working..." : "Use my location"}
        </button>

        <CitySearch
          disabled={loading}
          onPick={onPickPlace}
          onSearchText={onSearchText}
          onFormError={setFormError}
        />
      </div>

      {shownError && (
        <p className="form-error" role="alert">
          {shownError}
        </p>
      )}

      {reading && level && (
        <div className="live-result">
          <div className="result-top">
            <Gauge
              key={`${reading.city}-${reading.observedAt}-${reading.aqi}`}
              aqi={reading.aqi}
              color={level.color}
            />
            <div className="result-text">
              <span className="chip" style={{ backgroundColor: level.color, color: level.ink }}>
                {reading.category || level.category}
              </span>
              <p className="advice">{adviceFor(level.category)}</p>
              {reading.observedAt && (
                <p className="muted">
                  Reading time (local):{" "}
                  <span className="nowrap">{reading.observedAt.replace("T", " ")}</span>
                </p>
              )}
            </div>
          </div>

          <details
            className="pollutant-details"
            open={showPollutants}
            onToggle={(e) => setShowPollutants(e.currentTarget.open)}
          >
            <summary>Pollutant details</summary>
            <dl className="pollutants">
              {POLLUTANTS.map((p) => (
                <div className="pollutant" key={p.key}>
                  <dt>{p.label}</dt>
                  <dd>
                    {reading[p.key] ?? "-"}
                    <span className="unit"> &micro;g/m&sup3;</span>
                  </dd>
                </div>
              ))}
            </dl>
          </details>

          <div className="result-actions">
            <button onClick={handleSave} disabled={saving || saved}>
              {saved ? "Saved to history" : saving ? "Saving..." : "Save to history"}
            </button>
            <a className="text-link" href="#impact">
              What this means for you
            </a>
          </div>
          {saveError && (
            <p className="form-error" role="alert">
              {saveError}
            </p>
          )}
        </div>
      )}

      <p className="attribution">
        Air quality data: CAMS ENSEMBLE model via{" "}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Open-Meteo
        </a>
        . Values are model estimates on the US AQI scale.
      </p>
    </section>
  );
}
