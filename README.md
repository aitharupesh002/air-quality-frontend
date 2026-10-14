# Air Quality Monitor — Frontend

React + CSS single-page app for the Smart Air Quality Monitoring and Health
Alert System project. Lists, adds, edits, and deletes air quality records
against the backend REST API.

## Tech stack

- React 19 + Vite
- Plain CSS (no UI framework)

## Project structure

```
src/
  api.js                     fetch wrapper around the backend REST API
  aqi.js                     AQI levels, colours, and slider helpers
  impact.js                  health + environment text for each AQI level
  location.js                browser geolocation + reverse geocoding
  places.js                  Indian city list, typo-tolerant search, geocoding
  useLiveAir.js              hook: locate / search city / reading / stage
  App.jsx                    page layout and state
  components/
    Scene.jsx, scene.css     the landscape (SVG) and its colour themes
    LivePanel.jsx            "Use my location" + city search, live AQI card
    CitySearch.jsx           search box with a dropdown of places in India
    Gauge.jsx                ring gauge for the AQI number
    Explorer.jsx             slider to preview any AQI level
    ImpactPanel.jsx          "What this means" (body, landscape, what to do)
    RecordForm.jsx           add/edit form
    RecordTable.jsx          list view with edit/delete
```

## Live air quality

The **Use my location** button asks the browser for the user's position
(browsers only allow this on `localhost` or HTTPS, which Vercel/Netlify
provide), names the place with a free key-less reverse-geocoding service,
and asks the backend (`/api/live`) for the current air quality. Users can
also search any city. The result can be saved to history with one click.

### City search dropdown

Typing in the search box shows matching places in India. Suggestions come
from a built-in list of about 150 cities (instant, works offline, and knows
old names such as Bangalore, Madras and Calcutta) plus Open-Meteo's free
geocoding API for smaller towns. Matching forgives spelling mistakes, so
"bengalure" still finds Bengaluru. Choosing a suggestion fetches that exact
place by its coordinates. To add a city to the built-in list, add a line to
`CITIES` in `src/places.js`.

## The landscape

The page background is a landscape (mountains, a bay, a pine forest, a sun)
drawn as an inline SVG and coloured with CSS custom properties.

- Before any reading, and while the location and air quality are being
  fetched, it shows a calm morning view. The sun pulses like a radar ping
  while the request is in flight.
- When the reading arrives, the whole view fades to the theme for that AQI
  level: clear blue day, golden haze, orange smog, brown-red smog, purple
  murk, and a dark ember sky. Birds disappear, hills vanish into the haze.
- The **See how the view changes** slider lets anyone drag along the AQI
  scale to preview any level. The **What this means** section underneath
  updates with the health effects, landscape effects and what to do.
- It respects `prefers-reduced-motion` (no ambient animation, short colour
  changes) and works with the keyboard.

The colour themes live in `src/components/scene.css` (one block per level,
for example `.app[data-level="unhealthy"]`). Change a hex value there to
restyle a level.

## Run locally

```bash
npm install
cp .env.example .env     # defaults to http://localhost:8080
npm run dev
```

Open `http://localhost:5173`. Make sure the backend is running on
`http://localhost:8080` (see the backend README) — this app won't show
data without it.

## Environment variables

| Variable              | Purpose                                  |
|------------------------|-------------------------------------------|
| `VITE_API_BASE_URL`    | Base URL of the backend API               |

Set it in `.env` locally, and in your deployment platform's environment
variable settings in production (pointing at your Render backend URL).

## Build for production

```bash
npm run build
```

Output goes to `dist/`.

## Deploying to Vercel / Netlify

1. Push this folder to its own GitHub repository.
2. Import it into [Vercel](https://vercel.com/) or
   [Netlify](https://www.netlify.com/) as a new project.
3. Build command: `npm run build` — Output directory: `dist`
4. Add the environment variable `VITE_API_BASE_URL` set to your deployed
   Render backend URL (e.g. `https://air-quality-backend.onrender.com`).
5. Deploy. Once live, go back to the backend's `APP_CORS_ALLOWED_ORIGINS`
   environment variable on Render and set it to this frontend's URL so the
   browser is allowed to call the API.
