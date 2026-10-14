// Browser location helpers. Geolocation only works on localhost or HTTPS.

export function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Your browser does not support location."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 60000,
    });
  });
}

export function locationErrorMessage(err) {
  if (err && err.code === 1) {
    return "Location permission was denied. Allow it in your browser's address bar, or search a city instead.";
  }
  if (err && err.code === 3) {
    return "Finding your location timed out. Try again, or search a city instead.";
  }
  if (err && err.code === 2) {
    return "Your location could not be determined. Search a city instead.";
  }
  return (err && err.message) || "Could not get your location.";
}

// Turns coordinates into a place name using a free, key-less service.
// If it fails for any reason we simply fall back to showing coordinates.
export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      city: data.city || data.locality || data.principalSubdivision || "",
      region: data.principalSubdivision || null,
      country: data.countryName || null,
    };
  } catch {
    return null;
  }
}
