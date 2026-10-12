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
  api.js                    fetch wrapper around the backend REST API
  aqi.js                    AQI category + color helpers
  App.jsx                   page layout and state
  components/
    RecordForm.jsx           add/edit form
    RecordTable.jsx           list view with edit/delete
```

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
