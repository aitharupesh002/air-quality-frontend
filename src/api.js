const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function handleResponse(res) {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      message = body.message || JSON.stringify(body.fields || body);
    } catch {
      // ignore - response had no JSON body
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function getRecords(cityFilter = "") {
  const url = cityFilter
    ? `${BASE_URL}/api/records?city=${encodeURIComponent(cityFilter)}`
    : `${BASE_URL}/api/records`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function getRecord(id) {
  const res = await fetch(`${BASE_URL}/api/records/${id}`);
  return handleResponse(res);
}

export async function createRecord(payload) {
  const res = await fetch(`${BASE_URL}/api/records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateRecord(id, payload) {
  const res = await fetch(`${BASE_URL}/api/records/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteRecord(id) {
  const res = await fetch(`${BASE_URL}/api/records/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}

export { BASE_URL };
