import { useEffect, useId, useMemo, useState } from "react";
import { fetchIndianPlaces, mergePlaces, searchIndianCities } from "../places";

// Search box with a dropdown of matching places in India. It follows the
// ARIA "combobox" pattern: type to filter, Arrow keys to move, Enter to
// choose, Escape to close.
//
// - onPick(place): the visitor chose a suggestion (we know its coordinates)
// - onSearchText(text): nothing matched, so let the backend try the text
// - onFormError(message): shown by the parent (for example "Enter a city")
export default function CitySearch({ disabled, onPick, onSearchText, onFormError }) {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  // The suggestion the visitor last chose, and the text we put in the box for it.
  const [picked, setPicked] = useState(null);
  // Extra places from the online lookup, remembered with the text they are for.
  const [remote, setRemote] = useState({ query: "", items: [], done: false });

  const trimmed = query.trim();
  const settled = picked !== null && query === picked.label;

  // Ask Open-Meteo for more places a moment after the visitor stops typing.
  useEffect(() => {
    if (settled || trimmed.length < 3) return undefined;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const items = await fetchIndianPlaces(trimmed, controller.signal);
        setRemote({ query: trimmed, items, done: true });
      } catch (err) {
        if (err.name !== "AbortError") {
          setRemote({ query: trimmed, items: [], done: true });
        }
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed, settled]);

  const suggestions = useMemo(() => {
    const local = searchIndianCities(trimmed);
    const extra = remote.query === trimmed ? remote.items : [];
    return mergePlaces(local, extra);
  }, [trimmed, remote]);

  const waiting = trimmed.length >= 3 && !(remote.query === trimmed && remote.done);
  const showList = open && trimmed.length >= 2 && !disabled && !settled;
  const showEmpty = showList && suggestions.length === 0 && !waiting;

  function labelOf(place) {
    return place.region ? `${place.name}, ${place.region}` : place.name;
  }

  function choose(place) {
    const label = labelOf(place);
    setQuery(label);
    setPicked({ label, place });
    setOpen(false);
    setActiveIndex(-1);
    onFormError("");
    onPick(place);
  }

  function handleChange(e) {
    setQuery(e.target.value);
    setOpen(true);
    setActiveIndex(-1);
    onFormError("");
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!showList || suggestions.length === 0) {
        setOpen(true);
        return;
      }
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (showList && suggestions.length > 0) {
        setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!trimmed) {
      onFormError("Enter a city name.");
      return;
    }
    // Use the highlighted suggestion, otherwise the best match we have.
    const chosen = settled ? picked.place : (suggestions[activeIndex] ?? suggestions[0]);
    if (chosen) {
      choose(chosen);
      return;
    }
    setOpen(false);
    onFormError("");
    onSearchText(trimmed);
  }

  const activeId = activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined;

  let announcement = "";
  if (showList) {
    announcement = suggestions.length
      ? `${suggestions.length} places found. Use the arrow keys to choose one.`
      : waiting
        ? "Searching"
        : "No places found in India";
  }

  return (
    <form className="live-search" onSubmit={handleSubmit}>
      <input
        role="combobox"
        aria-label="City name"
        aria-expanded={showList}
        aria-controls={showList && suggestions.length > 0 ? listId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={activeId}
        autoComplete="off"
        spellCheck="false"
        placeholder="Or search a city in India"
        value={query}
        disabled={disabled}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" className="secondary" disabled={disabled}>
        Search
      </button>

      <p className="sr-only" role="status">
        {announcement}
      </p>

      {showList && (
        <div className="combo-list">
          {suggestions.length > 0 && (
            <ul id={listId} role="listbox" aria-label="Matching places in India">
              {suggestions.map((place, i) => (
                <li
                  key={`${place.name}-${place.region}-${place.latitude}`}
                  id={`${listId}-opt-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  className="combo-option"
                  // Keep focus in the input so choosing does not trigger blur first.
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => choose(place)}
                >
                  <span className="combo-name">
                    {place.name}
                    {place.alias && <span className="combo-alias"> also {place.alias}</span>}
                  </span>
                  <span className="combo-sub">{place.region || "India"}</span>
                </li>
              ))}
            </ul>
          )}
          {suggestions.length === 0 && waiting && (
            <p className="combo-note">Searching...</p>
          )}
          {showEmpty && (
            <p className="combo-note">
              No place found in India. Check the spelling, or try a nearby city.
            </p>
          )}
        </div>
      )}
    </form>
  );
}
