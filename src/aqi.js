export function categoryFor(aqi) {
  const value = Number(aqi);
  if (Number.isNaN(value)) return "Unknown";
  if (value <= 50) return "Good";
  if (value <= 100) return "Moderate";
  if (value <= 150) return "Unhealthy for Sensitive Groups";
  if (value <= 200) return "Unhealthy";
  if (value <= 300) return "Very Unhealthy";
  return "Hazardous";
}

export function colorFor(category) {
  switch (category) {
    case "Good":
      return "#2e7d32";
    case "Moderate":
      return "#f9a825";
    case "Unhealthy for Sensitive Groups":
      return "#ef6c00";
    case "Unhealthy":
      return "#c62828";
    case "Very Unhealthy":
      return "#6a1b9a";
    case "Hazardous":
      return "#4e0707";
    default:
      return "#757575";
  }
}
