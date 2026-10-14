import { memo, useEffect } from "react";
import "./scene.css";

// A painted-with-code landscape: mountains, a sea, a pine forest and a sun.
// It has no props. Its colours come from CSS variables that the parent
// `.app` element sets from `data-level` (see scene.css), so changing the
// level repaints the whole view with a smooth colour transition.

const VIEW_W = 1600;
const VIEW_H = 900;

// Small seeded random generator so the forest looks the same on every render.
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Height of a ridge line (list of [x, y] points, ascending x) at a given x.
function ridgeY(points, x) {
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    if (x >= x1 && x <= x2) return y1 + (y2 - y1) * ((x - x1) / (x2 - x1));
  }
  return null;
}

// One three-tier pine with its base centred on (x, y).
function pinePath(x, y, h) {
  const w = h * 0.56;
  const p = (dx, dy) => `${(x + dx).toFixed(1)},${(y + dy).toFixed(1)}`;
  return (
    `M${p(0, -h)}L${p(w * 0.26, -h * 0.64)}L${p(w * 0.13, -h * 0.64)}` +
    `L${p(w * 0.38, -h * 0.34)}L${p(w * 0.2, -h * 0.34)}L${p(w * 0.5, 0)}` +
    `L${p(-w * 0.5, 0)}L${p(-w * 0.2, -h * 0.34)}L${p(-w * 0.38, -h * 0.34)}` +
    `L${p(-w * 0.13, -h * 0.64)}L${p(-w * 0.26, -h * 0.64)}Z`
  );
}

// Rows of pines down a hillside, far row first so nearer rows paint on top.
function buildForest(ridge, x0, x1, seed) {
  const rand = mulberry32(seed);
  const rows = [];
  for (let r = 0; r < 5; r++) {
    let d = "";
    const step = 30 - r * 2;
    for (let x = x0 + rand() * 10; x <= x1; x += step + rand() * 10) {
      const top = ridgeY(ridge, x);
      if (top === null) continue;
      const y = top + 20 + r * 36 + rand() * 12;
      if (y > 930) continue;
      d += pinePath(x, y, 56 + r * 15 + rand() * 18);
    }
    rows.push(d);
  }
  return rows;
}

const HILL_LEFT = [
  [-100, 620], [40, 590], [170, 585], [300, 610], [420, 660],
  [540, 720], [660, 790], [760, 860], [840, 920],
];
const HILL_RIGHT = [
  [1020, 920], [1060, 860], [1130, 790], [1220, 720], [1330, 660],
  [1450, 615], [1580, 590], [1700, 600],
];

const toPath = (points, close) =>
  `M${points.map(([x, y]) => `${x},${y}`).join("L")}${close}`;

const HILL_LEFT_D = toPath(HILL_LEFT, "L840,940L-100,940Z");
const HILL_RIGHT_D = toPath(HILL_RIGHT, "L1700,940L1020,940Z");

const FOREST_LEFT = buildForest(HILL_LEFT, -90, 820, 11);
const FOREST_RIGHT = buildForest(HILL_RIGHT, 1030, 1690, 29);

// Tall pines framing the view in the foreground.
const FRAME_PINES = [
  [40, 430], [135, 340], [225, 270],
  [1560, 450], [1465, 350], [1380, 265],
]
  .map(([x, h]) => pinePath(x, 940, h))
  .join("");

const CLOUDS = [
  { x: 280, y: 190, s: 1.1, drift: "d1" },
  { x: 1180, y: 150, s: 0.9, drift: "d2" },
  { x: 700, y: 260, s: 0.7, drift: "d3" },
];

const SMOG = [
  [200, 520, 160], [520, 600, 200], [820, 560, 220], [1150, 620, 200],
  [1420, 540, 180], [300, 760, 200], [700, 800, 240], [1100, 780, 220],
  [1450, 740, 200], [900, 420, 200], [400, 380, 150], [1300, 400, 170],
];

const REFLECTION = [150, 122, 98, 78, 60, 44, 30];

function SceneView() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const root = document.documentElement;
    let frame = 0;
    function onMove(e) {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        root.style.setProperty("--px", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        root.style.setProperty("--py", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      });
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
      root.style.removeProperty("--px");
      root.style.removeProperty("--py");
    };
  }, []);

  return (
    <div className="scene" aria-hidden="true">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMax slice"
        focusable="false"
      >
        <defs>
          <linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="stop-sky-top" />
            <stop offset="0.55" className="stop-sky-mid" />
            <stop offset="1" className="stop-sky-bot" />
          </linearGradient>
          <radialGradient id="g-glow">
            <stop offset="0" className="stop-glow" stopOpacity="0.85" />
            <stop offset="0.35" className="stop-glow" stopOpacity="0.3" />
            <stop offset="1" className="stop-glow" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="g-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="stop-sea-top" />
            <stop offset="1" className="stop-sea-bot" />
          </linearGradient>
          <linearGradient id="g-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="stop-haze" stopOpacity="0" />
            <stop offset="0.55" className="stop-haze" stopOpacity="1" />
            <stop offset="1" className="stop-haze" stopOpacity="0.25" />
          </linearGradient>
          <radialGradient id="g-vignette" cx="0.5" cy="0.45" r="0.75">
            <stop offset="0.35" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="1" />
          </radialGradient>
          <filter id="f-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="38" />
          </filter>
        </defs>

        {/* Sky, sun and clouds */}
        <g className="layer l-sky">
          <rect x="-300" y="-600" width="2200" height="1700" fill="url(#g-sky)" />
          <circle className="sun-glow" cx="900" cy="330" r="430" fill="url(#g-glow)" />
          <g className="sun-pulse">
            <circle className="ring r1" cx="900" cy="330" r="58" />
            <circle className="ring r2" cx="900" cy="330" r="58" />
            <circle className="ring r3" cx="900" cy="330" r="58" />
            <circle className="sun" cx="900" cy="330" r="58" />
          </g>
          {CLOUDS.map((c) => (
            <g key={c.drift} className={`cloud-drift ${c.drift}`}>
              <g transform={`translate(${c.x} ${c.y}) scale(${c.s})`}>
                <ellipse cx="0" cy="0" rx="92" ry="26" />
                <ellipse cx="-42" cy="-14" rx="52" ry="24" />
                <ellipse cx="30" cy="-22" rx="58" ry="29" />
                <ellipse cx="74" cy="-6" rx="42" ry="20" />
              </g>
            </g>
          ))}
          <g className="birds">
            <g className="bird-drift">
              <path d="M300 300q9-11 18 0q9-11 18 0" />
              <path d="M360 270q7-9 14 0q7-9 14 0" />
              <path d="M340 335q6-8 12 0q6-8 12 0" />
            </g>
          </g>
        </g>

        {/* Far mountains */}
        <g className="layer l-far">
          <path
            className="mtn-far"
            d="M-120 660L-120 440L30 400L110 430L210 350L300 410L380 385L470 440L560 430L650 490L760 520L880 535L1000 525L1100 495L1190 440L1280 395L1370 350L1450 400L1530 375L1620 420L1720 410L1720 660Z"
          />
          <rect className="haze-band" x="-120" y="380" width="1840" height="280" fill="url(#g-haze)" style={{ opacity: "calc(var(--haze) * 0.9)" }} />
        </g>

        {/* Mid mountains */}
        <g className="layer l-mid">
          <path
            className="mtn-mid"
            d="M-120 670L-120 520L60 490L160 520L270 470L380 520L480 540L600 570L720 600L820 615L1000 615L1120 585L1230 540L1340 500L1450 520L1560 480L1720 505L1720 670Z"
          />
          <rect className="haze-band" x="-120" y="430" width="1840" height="260" fill="url(#g-haze)" style={{ opacity: "calc(var(--haze) * 0.7)" }} />
        </g>

        {/* Sea */}
        <g className="layer l-sea">
          <rect className="sea" x="-120" y="610" width="1840" height="340" fill="url(#g-sea)" />
          <g className="reflection">
            {REFLECTION.map((w, i) => (
              <rect
                key={w}
                className="glint"
                x={900 - w / 2}
                y={628 + i * 26}
                width={w}
                height="6"
                rx="3"
                style={{ animationDelay: `${i * -0.7}s` }}
              />
            ))}
          </g>
          <g className="waves">
            <g className="wave-drift w1">
              <path d="M-200 668q50-9 100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0" />
              <path d="M-150 742q60-11 120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0" />
            </g>
            <g className="wave-drift w2">
              <path d="M-180 705q55-10 110 0t110 0t110 0t110 0t110 0t110 0t110 0t110 0t110 0t110 0t110 0t110 0t110 0t110 0t110 0" />
              <path d="M-120 800q70-12 140 0t140 0t140 0t140 0t140 0t140 0t140 0t140 0t140 0t140 0t140 0t140 0" />
            </g>
          </g>
          <rect className="haze-band" x="-120" y="540" width="1840" height="220" fill="url(#g-haze)" style={{ opacity: "calc(var(--haze) * 0.6)" }} />
        </g>

        {/* Pine-covered hills either side of the bay */}
        <g className="layer l-hill">
          <path className="hill" d={HILL_LEFT_D} />
          <path className="hill" d={HILL_RIGHT_D} />
          {FOREST_LEFT.map((d, i) => (
            <path key={`l${i}`} className={i < 2 ? "tree tree-b" : "tree tree-a"} d={d} />
          ))}
          {FOREST_RIGHT.map((d, i) => (
            <path key={`r${i}`} className={i < 2 ? "tree tree-b" : "tree tree-a"} d={d} />
          ))}
          <rect className="haze-band" x="-120" y="560" width="1840" height="380" fill="url(#g-haze)" style={{ opacity: "calc(var(--haze) * 0.4)" }} />
        </g>

        {/* Tall pines framing the view */}
        <g className="layer l-fore">
          <path className="fore" d={FRAME_PINES} />
        </g>

        {/* Smog drifting in front of everything */}
        <g className="smog" filter="url(#f-blur)">
          <g className="smog-drift s1">
            {SMOG.slice(0, 4).map(([cx, cy, r]) => (
              <circle key={`a${cx}`} cx={cx} cy={cy} r={r} />
            ))}
          </g>
          <g className="smog-drift s2">
            {SMOG.slice(4, 8).map(([cx, cy, r]) => (
              <circle key={`b${cx}`} cx={cx} cy={cy} r={r} />
            ))}
          </g>
          <g className="smog-drift s3">
            {SMOG.slice(8).map(([cx, cy, r]) => (
              <circle key={`c${cx}`} cx={cx} cy={cy} r={r} />
            ))}
          </g>
        </g>

        <rect className="vignette" x="-300" y="-600" width="2200" height="1700" fill="url(#g-vignette)" />
      </svg>
    </div>
  );
}

export default memo(SceneView);
