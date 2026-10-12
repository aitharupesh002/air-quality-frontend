import { useEffect, useState } from "react";
import "./App.css";
import RecordForm from "./components/RecordForm";
import RecordTable from "./components/RecordTable";
import { createRecord, deleteRecord, getRecords, updateRecord } from "./api";

function App() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [cityFilter, setCityFilter] = useState("");
  const [error, setError] = useState("");

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
    <div className="app-shell">
      <header>
        <h1>Air Quality Monitor</h1>
        <p className="subtitle">Track AQI readings by city — add, edit, and review history.</p>
      </header>

      <RecordForm
        key={editingRecord?.id ?? "new"}
        editingRecord={editingRecord}
        onSave={handleSave}
        onCancel={() => setEditingRecord(null)}
        saving={saving}
      />

      <section className="list-section">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
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

        {error && <p className="form-error">{error}</p>}

        <RecordTable
          records={records}
          onEdit={setEditingRecord}
          onDelete={handleDelete}
          loading={loading}
        />
      </section>
    </div>
  );
}

export default App;
