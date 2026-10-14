import { useCallback, useState } from "react";
import { getLiveByCity, getLiveByCoords } from "./api";
import { getPosition, locationErrorMessage, reverseGeocode } from "./location";

// Owns everything about the "live air quality" lookup so the page can react
// to it (the background scene changes while we are fetching, and again when
// the reading arrives).
//
// stage: "idle" | "locating" | "reading" | "done" | "error"
export function useLiveAir() {
  const [reading, setReading] = useState(null);
  const [stage, setStage] = useState("idle");
  const [placeHint, setPlaceHint] = useState("");
  const [error, setError] = useState("");

  const locate = useCallback(async () => {
    setReading(null);
    setError("");
    setPlaceHint("");
    setStage("locating");
    try {
      let position;
      try {
        position = await getPosition();
      } catch (err) {
        throw new Error(locationErrorMessage(err));
      }
      const { latitude, longitude } = position.coords;
      const place = await reverseGeocode(latitude, longitude);
      const label =
        (place && place.city) ||
        `Location ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;

      setPlaceHint(label);
      setStage("reading");
      const result = await getLiveByCoords(latitude, longitude, label);
      setReading({
        ...result,
        region: result.region ?? (place ? place.region : null),
        country: result.country ?? (place ? place.country : null),
      });
      setStage("done");
    } catch (err) {
      setError(err.message);
      setStage("error");
    }
  }, []);

  // A place the visitor picked from the suggestions: we already know where it is.
  const searchPlace = useCallback(async (place) => {
    setReading(null);
    setError("");
    setPlaceHint(place.name);
    setStage("reading");
    try {
      const result = await getLiveByCoords(place.latitude, place.longitude, place.name);
      setReading({
        ...result,
        region: result.region ?? place.region ?? null,
        country: result.country ?? place.country ?? null,
      });
      setStage("done");
    } catch (err) {
      setError(err.message);
      setStage("error");
    }
  }, []);

  // Free text that matched no suggestion: let the backend look the name up.
  const searchCity = useCallback(async (query) => {
    setReading(null);
    setError("");
    setPlaceHint(query);
    setStage("reading");
    try {
      setReading(await getLiveByCity(query));
      setStage("done");
    } catch (err) {
      setError(err.message);
      setStage("error");
    }
  }, []);

  const loading = stage === "locating" || stage === "reading";

  return { reading, stage, placeHint, error, loading, locate, searchPlace, searchCity };
}
