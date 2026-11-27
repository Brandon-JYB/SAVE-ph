import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

/*  ---------- COMPONENTS/LAYOUT ----------  */
import Section from "../components/layout/Section";

/*  ---------- COMPONENTS/PREDICTIONS ----------  */
import PriceChart from "../components/predictions/PriceChart";
import RainChart from "../components/predictions/RainChart";

/*  ---------- API ----------  */
import {
    DATA_IS_SAMPLE,
    QUARTERS,
    currentQuarter,
    formatPeso,
    loadOptions,
    loadRegionForecast,
} from "../api/Predictions";

function trendOf(change) {
    if (change === null || change === undefined) {
        return { cls: "flat", text: "Price trend: not enough history yet" };
    }
    if (change > 1) return { cls: "up", text: `▲ ${change}% vs last year` };
    if (change < -1) return { cls: "down", text: `▼ ${Math.abs(change)}% vs last year` };
    return { cls: "flat", text: "▬ steady vs last year" };
}

export default function PredictionsPage() {
    const [searchParams] = useSearchParams();

    const [regions, setRegions] = useState([]);
    const [optionsError, setOptionsError] = useState(false);
    const [region, setRegion] = useState("");
    const [quarter, setQuarter] = useState(() => {
        const wanted = Number(searchParams.get("quarter"));
        return QUARTERS.some((q) => q.value === wanted) ? wanted : currentQuarter();
    });
    const [forecast, setForecast] = useState(null);
    const [status, setStatus] = useState("idle");          // idle | loading | done | error
    const [highlight, setHighlight] = useState("");

    // regions for the dropdown (+ a region picked on the landing page)
    useEffect(() => {
        let cancelled = false;

        loadOptions()
            .then(({ regions: list }) => {
                if (cancelled) return;
                setRegions(list);
                const wanted = searchParams.get("region");
                if (list.includes(wanted)) setRegion(wanted);
            })
            .catch(() => {
                if (!cancelled) setOptionsError(true);
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // choosing a region loads all four quarters at once, so changing quarter is instant
    useEffect(() => {
        if (!region) return undefined;
        let cancelled = false;
        setStatus("loading");

        loadRegionForecast(region)
            .then((data) => {
                if (cancelled) return;
                setForecast(data);
                setStatus("done");
            })
            .catch(() => {
                if (!cancelled) setStatus("error");
            });

        return () => {
            cancelled = true;
        };
    }, [region]);

    const result = forecast?.[quarter];
    const quarterInfo = QUARTERS.find((q) => q.value === quarter);
    const crops = result?.crops ?? [];
    const cropNames = crops.map((crop) => crop.name);
    const activeName = cropNames.includes(highlight) ? highlight : cropNames[0];

    const rainData = forecast
        ? QUARTERS.map((q) => {
              const list = forecast[q.value]?.crops ?? [];
              const mm = list.length
                  ? Math.round(list.reduce((sum, crop) => sum + crop.avg_rainfall_mm, 0) / list.length)
                  : 0;
              return { ...q, mm };
          })
        : [];

    function renderResults() {
        if (optionsError) {
            return (
                <div className="pred-state pred-state--error" role="alert">
                    <strong>The predictor isn't reachable</strong>
                    Check that the backend is running, then refresh the page.
                </div>
            );
        }

        if (!region) {
            return (
                <div className="pred-state">
                    <strong>Ready when you are</strong>
                    Choose your region to see what grows best.
                </div>
            );
        }

        if (status === "loading") {
            return (
                <div className="pred-state" role="status">
                    <strong>Crunching the data…</strong>
                    Checking past weather and prices for {region}.
                </div>
            );
        }

        if (status === "error") {
            return (
                <div className="pred-state pred-state--error" role="alert">
                    <strong>We couldn't get predictions</strong>
                    Check your connection and try another region, or refresh the page.
                </div>
            );
        }

        if (!result || !crops.length) {
            return (
                <div className="pred-state">
                    <strong>No recommendation for this combination yet</strong>
                    Try another quarter or region.
                </div>
            );
        }

        return (
            <>
                <div className="pred-summary">
                    <div>
                        <h2>Best bets for {region} · {quarterInfo.label}</h2>
                        <p className="pred-season">{result.season}</p>
                    </div>
                    {DATA_IS_SAMPLE && <span className="pred-sample">SAMPLE DATA</span>}
                </div>

                <div className="pred-grid">
                    <section className="pred-card pred-card--picks" aria-label="Recommended crops">
                        <span className="pred-label">TOP PICKS</span>
                        <h3>What to plant</h3>
                        <ol className="pred-picks">
                            {crops.map((crop, index) => {
                                const trend = trendOf(crop.price_change_pct);
                                const isActive = crop.name === activeName;

                                return (
                                    <li key={crop.name}>
                                        <button
                                            type="button"
                                            className={"pred-pick" + (isActive ? " is-selected" : "")}
                                            aria-pressed={isActive}
                                            onClick={() => setHighlight(crop.name)}
                                        >
                                            <span className={`pred-pick__rank pred-pick__rank--${index + 1}`}>
                                                {crop.rank}
                                            </span>
                                            <span className="pred-pick__main">
                                                <span className="pred-pick__top">
                                                    <span className="pred-pick__name">{crop.name}</span>
                                                    <span className="pred-score">
                                                        {crop.score}<small>/100</small>
                                                    </span>
                                                </span>
                                                <span
                                                    className="pred-conf"
                                                    role="img"
                                                    aria-label={`Income potential ${crop.score} out of 100`}
                                                >
                                                    <span className="pred-conf__fill" style={{ width: `${crop.score}%` }} />
                                                </span>
                                                <span className="pred-pick__meta">
                                                    <span>{formatPeso(crop.est_income_php_ha)} / ha</span>
                                                    <span>{formatPeso(crop.avg_price_php_kg, 1)} / kg</span>
                                                </span>
                                                <span className={`pred-trend pred-trend--${trend.cls}`}>{trend.text}</span>
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ol>
                    </section>

                    <section className="pred-card pred-card--price" aria-label="Price history">
                        <span className="pred-label">PRICE TREND</span>
                        <h3>Past prices, per quarter</h3>
                        <div className="pred-chart-scroll">
                            <PriceChart history={result.price_history} crops={cropNames} highlight={activeName} />
                        </div>
                        <ul className="pred-legend" aria-hidden="true">
                            {cropNames.map((name, i) => (
                                <li key={name} className={`pred-legend__item pred-legend__item--${i + 1}`}>
                                    {name}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="pred-card pred-card--weather" aria-label="Rainfall through the year">
                        <span className="pred-label">WEATHER OUTLOOK</span>
                        <h3>Rain through the year</h3>
                        <div className="pred-chart-scroll">
                            <RainChart data={rainData} selected={quarter} />
                        </div>
                        <p className="pred-caption">
                            Average rainfall per quarter in {region}. Highlighted: {quarterInfo.label}, {result.season.toLowerCase()}.
                        </p>
                    </section>

                    <aside className="pred-card pred-card--note">
                        <span className="pred-label">HOW TO READ THIS</span>
                        <h3>Estimates, not promises</h3>
                        <p>
                            Income potential compares each crop's expected income with the best crop-and-season combination in our data. It's a score out of 100, not a guarantee.
                        </p>
                        <p>{result.disclaimer}</p>
                        {DATA_IS_SAMPLE && (
                            <p>
                                Right now the model learns from generated sample data, so treat these results as a demo.
                            </p>
                        )}
                    </aside>
                </div>
            </>
        );
    }

    return (
        <Section id="Predictions" tone="light" watermark="PLAN">
            <div className="pred">
                <header className="pred-header">
                    <p className="pred-eyebrow">check out our predictions!</p>
                    <h1>Next generation of crops</h1>
                    <p className="pred-lede">
                        Pick your region and the quarter you plan to plant in. Our AI model suggests which crops fit best, using past weather and price data.
                    </p>
                </header>

                <form className="pred-form" onSubmit={(event) => event.preventDefault()}>
                    <div className="pred-field">
                        <label htmlFor="pred-region">Region</label>
                        <select
                            id="pred-region"
                            value={region}
                            onChange={(event) => setRegion(event.target.value)}
                            disabled={!regions.length}
                        >
                            <option value="">{regions.length ? "Select your region" : "Loading regions…"}</option>
                            {regions.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>

                    <fieldset className="pred-quarters">
                        <legend>Quarter</legend>
                        <div className="pred-quarters__row">
                            {QUARTERS.map((q) => {
                                const top = forecast?.[q.value]?.crops?.[0]?.name;
                                return (
                                    <label key={q.value} className="pred-quarter">
                                        <input
                                            type="radio"
                                            name="quarter"
                                            value={q.value}
                                            checked={quarter === q.value}
                                            onChange={() => setQuarter(q.value)}
                                        />
                                        <span>
                                            <strong>{q.label}</strong>
                                            <small>{q.months}</small>
                                            {top && <em>{top}</em>}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </fieldset>
                </form>

                <div className="pred-results" aria-live="polite">
                    {renderResults()}
                </div>
            </div>
        </Section>
    );
}