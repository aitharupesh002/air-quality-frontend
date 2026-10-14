import { categoryFor, colorFor, inkFor } from "../aqi";

export default function RecordTable({ records, onEdit, onDelete, loading }) {
  if (loading) {
    return <p className="status-text">Loading records...</p>;
  }

  if (records.length === 0) {
    return <p className="status-text">No records yet. Add one above to get started.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>City</th>
            <th>AQI</th>
            <th>Category</th>
            <th>PM2.5</th>
            <th>PM10</th>
            <th>Recorded at</th>
            <th>Remarks</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const category = record.category || categoryFor(record.aqi);
            return (
              <tr key={record.id}>
                <td>{record.city}</td>
                <td>{record.aqi}</td>
                <td>
                  <span
                    className="chip"
                    style={{ backgroundColor: colorFor(category), color: inkFor(category) }}
                  >
                    {category}
                  </span>
                </td>
                <td>{record.pm25 ?? "-"}</td>
                <td>{record.pm10 ?? "-"}</td>
                <td>
                  {record.recordedAt
                    ? new Date(record.recordedAt).toLocaleString()
                    : "-"}
                </td>
                <td className="remarks-cell">{record.remarks || "-"}</td>
                <td className="actions-cell">
                  <button className="link-button" onClick={() => onEdit(record)}>
                    Edit
                  </button>
                  <button
                    className="link-button danger"
                    onClick={() => onDelete(record.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
