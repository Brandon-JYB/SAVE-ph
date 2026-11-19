import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOptions, getPrediction } from "../lib/api";
import "../css/predictions.css";

const QUARTER_LABELS = {
  1: "Q1 (Jan to Mar)",
  2: "Q2 (Apr to Jun)",
  3: "Q3 (Jul to Sep)",
  4: "Q4 (Oct to Dec)",
};

const LINE_COLORS = ["#f2c500", "#7fd17f", "#8ec5ff"];

const peso = (n) => `₱${Number(n).toLocaleString("en-PH")}`;

// Simple line chart (plain SVG, no extra library needed)
function PriceChart({ history, names }) {
  const W = 640, H = 280, L = 52, R = 16, T = 16, B = 40;
  const values = history.flatMap((row) => names.map((n) => row[n]));
  const min = Math.floor(Math.min(...values) * 0.9);
  const max = Math.ceil(Math.max(...values) * 1.05);
  const x = (i) => L + (i * (W - L - R)) / Math.max(history.length - 1, 1);
  const y = (v) => T + ((max - v) * (H - T - B)) / (max - min || 1);
  const ticks = [0, 1, 2, 3].map((i) => min + ((max - min) * i) / 3);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="pred-chart"
      role="img"
      aria-label="Price per kilo of the top crops over the last 8 quarters"
    >
      {ticks.map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} className="pred-grid" />
          <text x={L - 8} y={y(t) + 4} textAnchor="end" className="pred-axis">
            ₱{Math.round(t)}
          </text>
        </g>
      ))}

      {history.map((row, i) => (
        <text key={row.label} x={x(i)} y={H - 14} textAnchor="middle" className="pred-axis">
          {row.label}
        </text>
      ))}

      {names.map((name, ci) => (
        <g key={name}>
          <polyline
            fill="none"
            stroke={LINE_COLORS[ci]}
            strokeWidth="3"
            points={history.map((row, i) => `${x(i)},${y(row[name])}`).join(" ")}
          />
          {history.map((row, i) => (
            <circle key={i} cx={x(i)} cy={y(row[name])} r="4" fill={LINE_COLORS[ci]} />
          ))}
        </g>
      ))}
    </svg>
  );
}

function Trend({ pct }) {
  if (pct == null) return null;
  const up = pct >= 0;
  return (
    <span className={up ? "pred-up" : "pred-down"}>
      {up ? "▲" : "▼"} {Math.abs(pct)}% vs. a year ago
    </span>
  );
}

function PredictionsPage() {
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState("");
  const [quarter, setQuarter] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fill the region dropdown from the server
  useEffect(() => {
    getOptions()
      .then((o) => {
        setRegions(o.regions);
        setRegion(o.regions[0] || "");
      })
      .catch((e) => setError(e.message));
  }, []);

  const run = async (e) => {
    e.preventDefault();
    if (!region) return;
    setLoading(true);
    setError("");
    try {
      setResult(await getPrediction(region, quarter));
    } catch (err) {
      setResult(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const best = result?.crops[0];
  const others = result?.crops.slice(1) ?? [];
  const names = result?.crops.map((c) => c.name) ?? [];

  return (
    <main className="pred-page">
      <header className="pred-hero">
        <p className="pred-eyebrow">check out our predictions</p>
        <h1>Next generation of crops</h1>
        <p className="pred-sub">
          Pick a region and a quarter to see which crops are expected to do best,
          and how their prices moved in recent quarters.
        </p>
      </header>

      <section className="pred-card pred-form-card">
        <form onSubmit={run} className="pred-form">
          <label>
            Region
            <select value={region} onChange={(e) => setRegion(e.target.value)} disabled={!regions.length}>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>

          <label>
            Quarter
            <select value={quarter} onChange={(e) => setQuarter(Number(e.target.value))}>
              {[1, 2, 3, 4].map((q) => (
                <option key={q} value={q}>{QUARTER_LABELS[q]}</option>
              ))}
            </select>
          </label>

          <button type="submit" className="pred-btn" disabled={loading || !region}>
            {loading ? "Loading…" : "Show predictions"}
          </button>
        </form>
        {error && <p className="pred-error" role="alert">{error}</p>}
      </section>

      {result && best && (
        <>
          {/* BEST CROP */}
          <section className="pred-best" aria-label="Best crop">
            <p className="pred-best-label">
              Best crop for {QUARTER_LABELS[result.quarter]} in {result.region}
            </p>
            <p className="pred-season">{result.season}</p>
            <h2>{best.name}</h2>

            <div className="pred-score">
              <div className="pred-score-bar"><span style={{ width: `${best.score}%` }} /></div>
              <strong>{best.score}/100</strong>
            </div>

            <dl className="pred-stats">
              <div>
                <dt>Estimated income per hectare</dt>
                <dd>{peso(best.est_income_php_ha)}</dd>
              </div>
              <div>
                <dt>Latest price ({result.latest_period})</dt>
                <dd>
                  {peso(best.latest_price_php_kg)}<small> / kg</small>
                  <Trend pct={best.price_change_pct} />
                </dd>
              </div>
              <div>
                <dt>Usual price in this quarter</dt>
                <dd>{peso(best.avg_price_php_kg)}<small> / kg</small></dd>
              </div>
              <div>
                <dt>Usual rainfall in this quarter</dt>
                <dd>{best.avg_rainfall_mm}<small> mm</small></dd>
              </div>
            </dl>
          </section>

          {/* OTHER TOP CROPS */}
          <section className="pred-others" aria-label="Other recommended crops">
            {others.map((c) => (
              <article key={c.name} className="pred-card pred-other">
                <p className="pred-rank">#{c.rank} choice</p>
                <h3>{c.name}</h3>
                <p className="pred-other-score">Score: <strong>{c.score}/100</strong></p>
                <p>Est. income per hectare: <strong>{peso(c.est_income_php_ha)}</strong></p>
                <p>
                  Latest price: <strong>{peso(c.latest_price_php_kg)} / kg</strong>
                  <br /><Trend pct={c.price_change_pct} />
                </p>
              </article>
            ))}
          </section>

          {/* PRICE HISTORY */}
          <section className="pred-card pred-history">
            <h2>Price per kilo, last 8 quarters</h2>
            <p className="pred-note">
              Average farm-gate price in {result.region}. Newest quarter is on the right.
            </p>

            <PriceChart history={result.price_history} names={names} />

            <ul className="pred-legend">
              {names.map((n, i) => (
                <li key={n}><span style={{ background: LINE_COLORS[i] }} />{n}</li>
              ))}
            </ul>

            <div className="pred-table-wrap">
              <table className="pred-table">
                <caption className="pred-sr">Price per kilo by quarter</caption>
                <thead>
                  <tr>
                    <th scope="col">Quarter</th>
                    {names.map((n) => <th key={n} scope="col">{n}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[...result.price_history].reverse().map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      {names.map((n) => <td key={n}>{peso(row[n])}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* HOW TO READ + DISCLAIMER + CTA */}
          <section className="pred-card pred-info">
            <h2>How to read this</h2>
            <p>
              The score (0 to 100) compares each crop's expected income per hectare
              against the best result in our data. Higher is better. The prices are
              what farmers were paid per kilo in earlier quarters.
            </p>
            <p className="pred-disclaimer">{result.disclaimer}</p>
            <Link to="/register" className="pred-btn pred-cta">
              Volunteer on a farm
            </Link>
          </section>
        </>
      )}
    </main>
  );
}

export default PredictionsPage;