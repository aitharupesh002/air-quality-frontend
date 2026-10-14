import { useState } from "react";

const emptyForm = {
  city: "",
  aqi: "",
  pm25: "",
  pm10: "",
  remarks: "",
};

function formFor(editingRecord) {
  if (!editingRecord) return emptyForm;
  return {
    city: editingRecord.city ?? "",
    aqi: editingRecord.aqi ?? "",
    pm25: editingRecord.pm25 ?? "",
    pm10: editingRecord.pm10 ?? "",
    remarks: editingRecord.remarks ?? "",
  };
}

// Parent passes `key={editingRecord?.id ?? "new"}` so this component
// remounts (and re-runs these initializers) whenever the edit target
// changes, instead of syncing local state to a prop via an effect.
export default function RecordForm({ editingRecord, onSave, onCancel, saving }) {
  const [form, setForm] = useState(() => formFor(editingRecord));
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.city.trim()) {
      setError("City is required.");
      return;
    }
    if (form.aqi === "" || Number.isNaN(Number(form.aqi))) {
      setError("AQI must be a number.");
      return;
    }

    setError("");
    onSave({
      city: form.city.trim(),
      aqi: Number(form.aqi),
      pm25: form.pm25 === "" ? null : Number(form.pm25),
      pm10: form.pm10 === "" ? null : Number(form.pm10),
      remarks: form.remarks.trim() || null,
    });
  }

  return (
    <form className="record-form glass" onSubmit={handleSubmit}>
      <h2>{editingRecord ? "Edit record" : "Add a record manually"}</h2>

      <div className="field-row">
        <label>
          City
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="e.g. Hyderabad"
          />
        </label>

        <label>
          AQI
          <input
            name="aqi"
            type="number"
            value={form.aqi}
            onChange={handleChange}
            placeholder="e.g. 112"
          />
        </label>
      </div>

      <div className="field-row">
        <label>
          PM2.5 (µg/m³)
          <input
            name="pm25"
            type="number"
            step="0.1"
            value={form.pm25}
            onChange={handleChange}
            placeholder="optional"
          />
        </label>

        <label>
          PM10 (µg/m³)
          <input
            name="pm10"
            type="number"
            step="0.1"
            value={form.pm10}
            onChange={handleChange}
            placeholder="optional"
          />
        </label>
      </div>

      <label className="full-width">
        Remarks
        <textarea
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
          placeholder="optional notes"
          rows={2}
        />
      </label>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : editingRecord ? "Update record" : "Add record"}
        </button>
        {editingRecord && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
