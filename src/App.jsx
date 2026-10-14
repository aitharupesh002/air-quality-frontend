import { useEffect, useState } from "react";
import "./App.css";
import Explorer from "./components/Explorer";
import ImpactPanel from "./components/ImpactPanel";
import LivePanel from "./components/LivePanel";
import RecordForm from "./components/RecordForm";
import RecordTable from "./components/RecordTable";
import Scene from "./components/Scene";
import { createRecord, deleteRecord, getRecords, updateRecord } from "./api";
import { centerPosOf, levelFor, posToAqi } from "./aqi";
import { useLiveAir } from "./useLiveAir";

function App() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [cityFilter, setCityFilter] = useState("");
  const [error, setError] = useState("");

  const live = useLiveAir();
  // null = show the real reading; otherwise a slider position (0-600) the
  // visitor is previewing.
  const [previewPos, setPreviewPos] = useState(null);

  const previewing = previewPos !== null;
  const aqi = previewing ? posToAqi(previewPos) : live.reading ? live.reading.aqi : null;
  const level = aqi === null ? null : levelFor(aqi);
  // While we are fetching, and before any reading exists, show the calm scene.
  const sceneLevel = live.loading || !level ? "calm" : level.key;

  async function loadRecords(filter = cityFilter) {
    setLoading(true);
    setError("");
    try {
      const data = await getRecords(filter);
      setRecords(data);
    } catch (err) {
      setError(`Could not load records: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLocate() {
    setPreviewPos(null);
    live.locate();
  }

  function handlePickPlace(place) {
    setPreviewPos(null);
    live.searchPlace(place);
  }

  function handleSearchText(query) {
    setPreviewPos(null);
    live.searchCity(query);
  }

  function handlePickLevel(levelKey) {
    setPreviewPos(centerPosOf(levelKey));
    document.getElementById("impact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSave(payload) {
    setSaving(true);
    setError("");
    try {
      if (editingRecord) {
        await updateRecord(editingRecord.id, payload);
      } else {
        await createRecord(payload);
      }
      setEditingRecord(null);
      await loadRecords();
    } catch (err) {
      setError(`Could not save record: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this record?")) return;
    setError("");
    try {
      await deleteRecord(id);
      await loadRecords();
    } catch (err) {
      setError(`Could not delete record: ${err.message}`);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    loadRecords(cityFilter);
  }

  return (
    <div
      className="app"
      data-level={sceneLevel}
      data-loading={live.loading ? "true" : "false"}
    >
      <Scene />

      <div className="page">
        <header className="topbar">
          <p className="brand">Air Quality Monitor</p>
        </header>

        <main>
          <div className="hero">
            <div className="hero-main">
              <LivePanel
                live={live}
                onLocate={handleLocate}
                onPickPlace={handlePickPlace}
                onSearchText={handleSearchText}
                onSaved={() => loadRecords()}
              />
            </div>
            <Explorer
              reading={live.reading}
              previewPos={previewPos}
              onPreview={setPreviewPos}
            />
          </div>

          <div className="content">
            <ImpactPanel
              level={level}
              aqi={aqi}
              previewing={previewing}
              placeName={live.reading ? live.reading.city : ""}
              onPickLevel={handlePickLevel}
            />

            <RecordForm
              key={editingRecord?.id ?? "new"}
              editingRecord={editingRecord}
              onSave={handleSave}
              onCancel={() => setEditingRecord(null)}
              saving={saving}
            />

            <section className="list-section glass" aria-labelledby="history-heading">
              <h2 id="history-heading">Saved readings</h2>
              <form className="search-bar" onSubmit={handleSearch}>
                <input
                  aria-label="Filter saved readings by city"
                  placeholder="Filter by city..."
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                />
                <button type="submit">Search</button>
                {cityFilter && (
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      setCityFilter("");
                      loadRecords("");
                    }}
                  >
                    Clear
                  </button>
                )}
              </form>

              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}

              <RecordTable
                records={records}
                onEdit={setEditingRecord}
                onDelete={handleDelete}
                loading={loading}
              />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
