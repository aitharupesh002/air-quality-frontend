// Place suggestions for the city search box.
//
// 1. A built-in list of Indian cities (instant, works offline, and knows old
//    names such as Bangalore, Madras and Calcutta).
// 2. Open-Meteo's free geocoding API (restricted to India) for towns that are
//    not in the list.
//
// Matching forgives typos, so "bengalure" still finds Bengaluru.

// [name, state, latitude, longitude, other names]
// Rough city-centre coordinates; the air quality model grid is far coarser.
const CITIES = [
  ["Delhi", "Delhi", 28.61, 77.21, ["New Delhi"]],
  ["Mumbai", "Maharashtra", 19.08, 72.88, ["Bombay"]],
  ["Bengaluru", "Karnataka", 12.97, 77.59, ["Bangalore", "Bengalooru"]],
  ["Hyderabad", "Telangana", 17.39, 78.49, []],
  ["Chennai", "Tamil Nadu", 13.08, 80.27, ["Madras"]],
  ["Kolkata", "West Bengal", 22.57, 88.36, ["Calcutta"]],
  ["Pune", "Maharashtra", 18.52, 73.86, ["Poona"]],
  ["Ahmedabad", "Gujarat", 23.02, 72.57, []],
  ["Surat", "Gujarat", 21.17, 72.83, []],
  ["Jaipur", "Rajasthan", 26.91, 75.79, []],
  ["Lucknow", "Uttar Pradesh", 26.85, 80.95, []],
  ["Kanpur", "Uttar Pradesh", 26.45, 80.33, ["Cawnpore"]],
  ["Nagpur", "Maharashtra", 21.15, 79.09, []],
  ["Indore", "Madhya Pradesh", 22.72, 75.86, []],
  ["Bhopal", "Madhya Pradesh", 23.26, 77.41, []],
  ["Patna", "Bihar", 25.59, 85.14, []],
  ["Vadodara", "Gujarat", 22.31, 73.18, ["Baroda"]],
  ["Ghaziabad", "Uttar Pradesh", 28.67, 77.45, []],
  ["Noida", "Uttar Pradesh", 28.54, 77.39, []],
  ["Gurugram", "Haryana", 28.46, 77.03, ["Gurgaon"]],
  ["Faridabad", "Haryana", 28.41, 77.31, []],
  ["Ludhiana", "Punjab", 30.9, 75.86, []],
  ["Agra", "Uttar Pradesh", 27.18, 78.01, []],
  ["Visakhapatnam", "Andhra Pradesh", 17.69, 83.22, ["Vizag", "Vishakhapatnam"]],
  ["Coimbatore", "Tamil Nadu", 11.02, 76.96, ["Kovai"]],
  ["Kochi", "Kerala", 9.93, 76.27, ["Cochin", "Ernakulam"]],
  ["Thiruvananthapuram", "Kerala", 8.52, 76.94, ["Trivandrum"]],
  ["Chandigarh", "Chandigarh", 30.73, 76.78, []],
  ["Guwahati", "Assam", 26.14, 91.74, ["Gauhati"]],
  ["Bhubaneswar", "Odisha", 20.3, 85.82, []],
  ["Nashik", "Maharashtra", 20.0, 73.79, ["Nasik"]],
  ["Thane", "Maharashtra", 19.22, 72.98, []],
  ["Navi Mumbai", "Maharashtra", 19.03, 73.03, []],
  ["Meerut", "Uttar Pradesh", 28.98, 77.71, []],
  ["Rajkot", "Gujarat", 22.3, 70.8, []],
  ["Varanasi", "Uttar Pradesh", 25.32, 82.97, ["Benares", "Banaras", "Kashi"]],
  ["Srinagar", "Jammu and Kashmir", 34.08, 74.8, []],
  ["Aurangabad", "Maharashtra", 19.88, 75.34, ["Chhatrapati Sambhajinagar"]],
  ["Dhanbad", "Jharkhand", 23.8, 86.43, []],
  ["Amritsar", "Punjab", 31.63, 74.87, []],
  ["Prayagraj", "Uttar Pradesh", 25.44, 81.85, ["Allahabad"]],
  ["Ranchi", "Jharkhand", 23.34, 85.31, []],
  ["Howrah", "West Bengal", 22.59, 88.31, []],
  ["Jabalpur", "Madhya Pradesh", 23.18, 79.99, []],
  ["Gwalior", "Madhya Pradesh", 26.22, 78.18, []],
  ["Vijayawada", "Andhra Pradesh", 16.51, 80.65, ["Bezawada"]],
  ["Jodhpur", "Rajasthan", 26.24, 73.02, []],
  ["Madurai", "Tamil Nadu", 9.93, 78.12, []],
  ["Raipur", "Chhattisgarh", 21.25, 81.63, []],
  ["Kota", "Rajasthan", 25.18, 75.83, []],
  ["Solapur", "Maharashtra", 17.66, 75.91, []],
  ["Hubballi", "Karnataka", 15.36, 75.12, ["Hubli", "Dharwad"]],
  ["Mysuru", "Karnataka", 12.3, 76.64, ["Mysore"]],
  ["Tiruchirappalli", "Tamil Nadu", 10.79, 78.7, ["Trichy", "Tiruchi"]],
  ["Bareilly", "Uttar Pradesh", 28.37, 79.43, []],
  ["Moradabad", "Uttar Pradesh", 28.84, 78.78, []],
  ["Aligarh", "Uttar Pradesh", 27.88, 78.08, []],
  ["Gorakhpur", "Uttar Pradesh", 26.76, 83.37, []],
  ["Jalandhar", "Punjab", 31.33, 75.58, []],
  ["Salem", "Tamil Nadu", 11.66, 78.15, []],
  ["Warangal", "Telangana", 17.97, 79.6, []],
  ["Secunderabad", "Telangana", 17.44, 78.5, []],
  ["Guntur", "Andhra Pradesh", 16.31, 80.44, []],
  ["Kozhikode", "Kerala", 11.26, 75.78, ["Calicut"]],
  ["Thrissur", "Kerala", 10.53, 76.21, ["Trichur"]],
  ["Mangaluru", "Karnataka", 12.91, 74.86, ["Mangalore"]],
  ["Belagavi", "Karnataka", 15.85, 74.5, ["Belgaum"]],
  ["Kalaburagi", "Karnataka", 17.33, 76.83, ["Gulbarga"]],
  ["Dehradun", "Uttarakhand", 30.32, 78.03, []],
  ["Haridwar", "Uttarakhand", 29.95, 78.16, []],
  ["Rishikesh", "Uttarakhand", 30.09, 78.27, []],
  ["Haldwani", "Uttarakhand", 29.22, 79.51, []],
  ["Roorkee", "Uttarakhand", 29.85, 77.89, []],
  ["Shimla", "Himachal Pradesh", 31.1, 77.17, ["Simla"]],
  ["Manali", "Himachal Pradesh", 32.24, 77.19, []],
  ["Dharamshala", "Himachal Pradesh", 32.22, 76.32, []],
  ["Jammu", "Jammu and Kashmir", 32.73, 74.86, []],
  ["Leh", "Ladakh", 34.16, 77.58, []],
  ["Panaji", "Goa", 15.49, 73.83, ["Panjim", "Goa"]],
  ["Puducherry", "Puducherry", 11.93, 79.83, ["Pondicherry"]],
  ["Imphal", "Manipur", 24.82, 93.94, []],
  ["Shillong", "Meghalaya", 25.58, 91.89, []],
  ["Aizawl", "Mizoram", 23.73, 92.72, []],
  ["Kohima", "Nagaland", 25.67, 94.11, []],
  ["Itanagar", "Arunachal Pradesh", 27.08, 93.62, []],
  ["Agartala", "Tripura", 23.83, 91.28, []],
  ["Gangtok", "Sikkim", 27.33, 88.61, []],
  ["Silchar", "Assam", 24.83, 92.78, []],
  ["Port Blair", "Andaman and Nicobar Islands", 11.62, 92.73, []],
  ["Jamshedpur", "Jharkhand", 22.8, 86.18, []],
  ["Asansol", "West Bengal", 23.68, 86.98, []],
  ["Siliguri", "West Bengal", 26.72, 88.43, []],
  ["Durgapur", "West Bengal", 23.55, 87.32, []],
  ["Darjeeling", "West Bengal", 27.04, 88.26, []],
  ["Bilaspur", "Chhattisgarh", 22.08, 82.14, []],
  ["Bhilai", "Chhattisgarh", 21.21, 81.38, []],
  ["Ujjain", "Madhya Pradesh", 23.18, 75.78, []],
  ["Udaipur", "Rajasthan", 24.59, 73.71, []],
  ["Ajmer", "Rajasthan", 26.45, 74.64, []],
  ["Bikaner", "Rajasthan", 28.02, 73.31, []],
  ["Jaisalmer", "Rajasthan", 26.92, 70.91, []],
  ["Mathura", "Uttar Pradesh", 27.49, 77.67, []],
  ["Jhansi", "Uttar Pradesh", 25.45, 78.57, []],
  ["Saharanpur", "Uttar Pradesh", 29.97, 77.55, []],
  ["Rohtak", "Haryana", 28.89, 76.61, []],
  ["Panipat", "Haryana", 29.39, 76.97, []],
  ["Karnal", "Haryana", 29.69, 76.99, []],
  ["Hisar", "Haryana", 29.15, 75.72, []],
  ["Patiala", "Punjab", 30.34, 76.39, []],
  ["Bathinda", "Punjab", 30.21, 74.95, []],
  ["Gaya", "Bihar", 24.8, 85.0, []],
  ["Muzaffarpur", "Bihar", 26.12, 85.39, []],
  ["Bhagalpur", "Bihar", 25.24, 86.97, []],
  ["Darbhanga", "Bihar", 26.15, 85.9, []],
  ["Cuttack", "Odisha", 20.46, 85.88, []],
  ["Rourkela", "Odisha", 22.26, 84.85, []],
  ["Puri", "Odisha", 19.81, 85.83, []],
  ["Nellore", "Andhra Pradesh", 14.44, 79.99, []],
  ["Tirupati", "Andhra Pradesh", 13.63, 79.42, []],
  ["Kurnool", "Andhra Pradesh", 15.83, 78.04, []],
  ["Rajahmundry", "Andhra Pradesh", 17.0, 81.78, ["Rajamahendravaram"]],
  ["Karimnagar", "Telangana", 18.44, 79.13, []],
  ["Nizamabad", "Telangana", 18.67, 78.09, []],
  ["Tirunelveli", "Tamil Nadu", 8.73, 77.7, ["Nellai"]],
  ["Vellore", "Tamil Nadu", 12.92, 79.13, []],
  ["Erode", "Tamil Nadu", 11.34, 77.72, []],
  ["Thanjavur", "Tamil Nadu", 10.79, 79.14, ["Tanjore"]],
  ["Tiruppur", "Tamil Nadu", 11.11, 77.34, ["Tirupur"]],
  ["Ooty", "Tamil Nadu", 11.41, 76.7, ["Udhagamandalam"]],
  ["Kodaikanal", "Tamil Nadu", 10.24, 77.49, []],
  ["Kollam", "Kerala", 8.89, 76.61, ["Quilon"]],
  ["Kannur", "Kerala", 11.87, 75.37, ["Cannanore"]],
  ["Alappuzha", "Kerala", 9.49, 76.33, ["Alleppey"]],
  ["Palakkad", "Kerala", 10.78, 76.65, ["Palghat"]],
  ["Davangere", "Karnataka", 14.47, 75.92, []],
  ["Ballari", "Karnataka", 15.14, 76.92, ["Bellary"]],
  ["Shivamogga", "Karnataka", 13.93, 75.57, ["Shimoga"]],
  ["Tumakuru", "Karnataka", 13.34, 77.1, ["Tumkur"]],
  ["Udupi", "Karnataka", 13.34, 74.75, []],
  ["Nanded", "Maharashtra", 19.16, 77.31, []],
  ["Kolhapur", "Maharashtra", 16.7, 74.24, []],
  ["Amravati", "Maharashtra", 20.93, 77.75, []],
  ["Akola", "Maharashtra", 20.71, 77.0, []],
  ["Sangli", "Maharashtra", 16.85, 74.57, []],
  ["Jalgaon", "Maharashtra", 21.0, 75.57, []],
  ["Latur", "Maharashtra", 18.4, 76.56, []],
  ["Bhavnagar", "Gujarat", 21.76, 72.15, []],
  ["Jamnagar", "Gujarat", 22.47, 70.07, []],
  ["Gandhinagar", "Gujarat", 23.22, 72.65, []],
  ["Junagadh", "Gujarat", 21.52, 70.46, []],
  ["Bhuj", "Gujarat", 23.25, 69.67, []],
].map(([name, region, latitude, longitude, aliases]) => ({
  name,
  region,
  country: "India",
  latitude,
  longitude,
  aliases,
  names: [name, ...aliases].map(normalize),
}));

function normalize(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Edit distance that counts a swapped pair of letters as one mistake.
function editDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const d = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) d[i][0] = i;
  for (let j = 0; j < cols; j++) d[0][j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

// Lower is better; Infinity means "does not match".
function scoreName(q, candidate) {
  if (candidate === q) return 0;
  if (candidate.startsWith(q)) return 1 + (candidate.length - q.length) / 100;
  if (candidate.split(" ").some((word) => word.startsWith(q))) return 2;
  if (q.length >= 3 && candidate.includes(q)) return 3;
  // Typos rarely hit the first letter, so require it to match.
  if (q.length >= 4 && candidate[0] === q[0]) {
    const allowed = q.length <= 5 ? 1 : 2;
    // Compare with the start of the name too, so half-typed misspellings work.
    let best = editDistance(q, candidate);
    for (const len of [q.length - 1, q.length, q.length + 1]) {
      if (len >= 1 && len <= candidate.length) {
        best = Math.min(best, editDistance(q, candidate.slice(0, len)));
      }
    }
    if (best <= allowed) return 4 + best;
  }
  return Infinity;
}

// Matches from the built-in list, best first.
export function searchIndianCities(query, limit = 8) {
  const q = normalize(query);
  if (q.length < 2) return [];

  const matches = [];
  CITIES.forEach((city, index) => {
    let best = Infinity;
    let bestAlias = null;
    city.names.forEach((candidate, i) => {
      // Other names rank just below the main name for the same kind of match.
      const s = scoreName(q, candidate) + (i === 0 ? 0 : 0.5);
      if (s < best) {
        best = s;
        bestAlias = i === 0 ? null : city.aliases[i - 1];
      }
    });
    if (best !== Infinity) matches.push({ city, score: best, index, alias: bestAlias });
  });

  matches.sort((a, b) => a.score - b.score || a.index - b.index);

  // If something matches directly (same start, or contains the text), do not
  // pad the list with "close spellings"; they are only a fallback.
  const direct = matches.filter((m) => m.score < 4);
  const shown = direct.length > 0 ? direct : matches.slice(0, 4);

  return shown.slice(0, limit).map(({ city, alias }) => ({
    name: city.name,
    region: city.region,
    country: city.country,
    latitude: city.latitude,
    longitude: city.longitude,
    alias,
  }));
}

// Extra places from Open-Meteo's geocoding API, limited to India. Resolves to
// an empty list if the service is unreachable.
export async function fetchIndianPlaces(query, signal) {
  const url =
    "https://geocoding-api.open-meteo.com/v1/search" +
    `?name=${encodeURIComponent(query)}&count=8&language=en&format=json&countryCode=IN`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Place lookup failed (${res.status})`);
  const data = await res.json();
  return (data.results || [])
    .filter((r) => typeof r.latitude === "number" && typeof r.longitude === "number")
    .map((r) => ({
      name: r.name,
      region: r.admin1 || r.admin2 || null,
      country: "India",
      latitude: r.latitude,
      longitude: r.longitude,
      alias: null,
    }));
}

// Built-in matches first, then any extra places that are not duplicates.
export function mergePlaces(local, remote, limit = 8) {
  const merged = [...local];
  for (const place of remote) {
    const name = normalize(place.name);
    const duplicate = merged.some((p) => {
      const dLat = Math.abs(p.latitude - place.latitude);
      const dLon = Math.abs(p.longitude - place.longitude);
      const sameName = normalize(p.name) === name || (p.alias && normalize(p.alias) === name);
      // Same name nearby, or practically the same spot.
      return (sameName && dLat < 0.5 && dLon < 0.5) || (dLat < 0.02 && dLon < 0.02);
    });
    if (!duplicate) merged.push(place);
  }
  return merged.slice(0, limit);
}
