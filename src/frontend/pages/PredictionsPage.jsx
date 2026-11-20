import { useRef, useState } from "react";
import Section from "../components/Section";
import PriceChart from "../components/PriceChart";
import WeatherChart from "../components/WeatherChart";
import ArrowCircleIcon from "../svg/ArrowCircleIcon";
import { getPrediction } from "../api/Client";
import { getMockPrediction } from "../api/PredictionsMock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_PREDICTIONS === "true";
const fetchPrediction = USE_MOCK ? getMockPrediction : getPrediction;

/* The values are what gets sent to the API: match them to what the model was trained on. */
const REGIONS = [
    { value: "ncr", name: "NCR · National Capital Region" },
    { value: "car", name: "CAR · Cordillera Administrative Region" },
    { value: "r1", name: "Region I · Ilocos Region" },
    { value: "r2", name: "Region II · Cagayan Valley" },
    { value: "r3", name: "Region III · Central Luzon" },
    { value: "r4a", name: "Region IV-A · CALABARZON" },
    { value: "r4b", name: "MIMAROPA" },
    { value: "r5", name: "Region V · Bicol Region" },
    { value: "r6", name: "Region VI · Western Visayas" },
    { value: "r7", name: "Region VII · Central Visayas" },
    { value: "r8", name: "Region VIII · Eastern Visayas" },
    { value: "r9", name: "Region IX · Zamboanga Peninsula" },
    { value: "r10", name: "Region X · Northern Mindanao" },
    { value: "r11", name: "Region XI · Davao Region" },
    { value: "r12", name: "Region XII · SOCCSKSARGEN" },
    { value: "r13", name: "Region XIII · Caraga" },
    { value: "barmm", name: "BARMM · Bangsamoro" },
];

const QUARTERS = [
    { value: 1, label: "Q1", months: "Jan–Mar" },
    { value: 2, label: "Q2", months: "Apr–Jun" },
    { value: 3, label: "Q3", months: "Jul–Sep" },
    { value: 4, label: "Q4", months: "Oct–Dec" },
];

const TREND = {
    up: { arrow: "▲", label: "Prices rising" },
    down: { arrow: "▼", label: "Prices falling" },
    flat: { arrow: "▬", label: "Prices steady" },
};

const currentQuarter = () => Math.floor(new Date().getMonth() / 3) + 1;

export default function PredictionsPage() {
    const [region, setRegion] = useState("");
    const [quarter, setQuarter] = useState(currentQuarter());
    const [regionError, setRegionError] = useState("");
    const [status, setStatus] = useState("idle");          // idle | loading | done | error
    const [result, setResult] = useState(null);
    const [submitted, setSubmitted] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    const requestId = useRef(0);
    const resultsRef = useRef(null);

    const regionName = REGIONS.find((r) => r.value === submitted?.region)?.name ?? "";
    const quarterInfo = QUARTERS.find((q) => q.value === submitted?.quarter);
    const selected = result?.crops?.find((c) => c.id === selectedId) ?? result?.crops?.[0];

    async function handleSubmit(event) {
        event.preventDefault();

        if (!region) {
            setRegionError("Choose your region first.");
            return;
        }

        const id = ++requestId.current;
        setRegionError("");
        setStatus("loading");

        try {
            const data = await fetchPrediction({ region, quarter });
            if (id !== requestId.current) return;          // ignore an older, slower answer

            setSubmitted({ region, quarter });
            setResult(data);
            setSelectedId(data.crops?.[0]?.id ?? null);
            setStatus("done");

            requestAnimationFrame(() => {
                resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        } catch {
            if (id !== requestId.current) return;
            setStatus("error");
        }
    }

    function renderResults() {
        if (status === "idle") {
            return (
                <div className="pred-state">
                    <strong>Ready when you are</strong>
                    Choose a region and a quarter, then tap “Show recommendations”.
                </div>
            );
        }

        if (status === "loading") {
            return (
                <div className="pred-state" role="status">
                    <strong>Crunching the data…</strong>
                    Checking past weather and prices for your region.
                </div>
            );
        }

        if (status === "error") {
            return (
                <div className="pred-state pred-state--error" role="alert">
                    <strong>We couldn't get predictions</strong>
                    Check your connection and try again in a moment.
                </div>
            );
        }

        if (!result?.crops?.length || !selected) {
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
                    <h2>Best bets for {regionName} · {quarterInfo?.label}</h2>
                    {result.isSample && <span className="pred-sample">SAMPLE DATA</span>}
                </div>

                <div className="pred-grid">
                    <section className="pred-card pred-card--picks" aria-label="Recommended crops">
                        <span className="pred-label">TOP PICKS</span>
                        <h3>What to plant</h3>
                        <ol className="pred-picks">
                            {result.crops.map((crop, index) => {
                                const pct = Math.round(crop.confidence * 100);
                                const trend = TREND[crop.trend] ?? TREND.flat;
                                const isSelected = crop.id === selected.id;

                                return (
                                    <li key={crop.id}>
                                        <button
                                            type="button"
                                            className={"pred-pick" + (isSelected ? " is-selected" : "")}
                                            aria-pressed={isSelected}
                                            onClick={() => setSelectedId(crop.id)}
                                        >
                                            <span className="pred-pick__rank">{index + 1}</span>
                                            <span className="pred-pick__main">
                                                <span className="pred-pick__name">{crop.name}</span>
                                                <span className="pred-conf" aria-hidden="true">
                                                    <span className="pred-conf__fill" style={{ width: `${pct}%` }} />
                                                </span>
                                                <span className="pred-pick__meta">
                                                    <span>{pct}% confidence</span>
                                                    <span className={`pred-trend pred-trend--${crop.trend}`}>
                                                        {trend.arrow} {trend.label}
                                                    </span>
                                                </span>
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ol>
                    </section>

                    <section className="pred-card pred-card--price" aria-label="Price trend">
                        <span className="pred-label">PRICE TREND</span>
                        <h3>{selected.name}</h3>
                        <div className="pred-chart-scroll">
                            <PriceChart series={selected.priceSeries} unit={selected.priceUnit} />
                        </div>
                        <ul className="pred-legend" aria-hidden="true">
                            <li><i /> Past prices</li>
                            <li><i className="is-forecast" /> Forecast</li>
                            <li><i className="is-band" /> Likely range</li>
                        </ul>
                        {selected.reasons?.length > 0 && (
                            <ul className="pred-reasons">
                                {selected.reasons.map((reason) => (
                                    <li key={reason}>{reason}</li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {result.weather?.months?.length > 0 && (
                        <section className="pred-card pred-card--weather" aria-label="Weather outlook">
                            <span className="pred-label">WEATHER OUTLOOK</span>
                            <h3>Rain and temperature</h3>
                            <div className="pred-chart-scroll">
                                <WeatherChart months={result.weather.months} />
                            </div>
                        </section>
                    )}

                    <aside className="pred-card pred-card--note">
                        <span className="pred-label">HOW TO READ THIS</span>
                        <h3>Estimates, not promises</h3>
                        <p>
                            Confidence is the model's own score: the higher it is, the more certain the model is about that crop.
                        </p>
                        <p>
                            The shaded band on the price chart is the likely range. Weather and prices can change, so check with your local agriculture office before you plant.
                        </p>
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

                <form className="pred-form" onSubmit={handleSubmit} noValidate>
                    <div className="pred-field">
                        <label htmlFor="pred-region">Region</label>
                        <select
                            id="pred-region"
                            value={region}
                            onChange={(e) => {
                                setRegion(e.target.value);
                                setRegionError("");
                            }}
                            aria-invalid={!!regionError}
                            aria-describedby={regionError ? "pred-region-error" : undefined}
                        >
                            <option value="">Select your region</option>
                            {REGIONS.map((r) => (
                                <option key={r.value} value={r.value}>{r.name}</option>
                            ))}
                        </select>
                        {regionError && (
                            <p className="pred-error" id="pred-region-error" role="alert">{regionError}</p>
                        )}
                    </div>

                    <fieldset className="pred-quarters">
                        <legend>Quarter</legend>
                        <div className="pred-quarters__row">
                            {QUARTERS.map((q) => (
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
                                    </span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <button type="submit" className="pred-submit" disabled={status === "loading"}>
                        <span>{status === "loading" ? "Crunching the data…" : "Show recommendations"}</span>
                        <ArrowCircleIcon className="pred-submit__icon" />
                    </button>
                </form>

                <div className="pred-results" ref={resultsRef} aria-live="polite">
                    {renderResults()}
                </div>
            </div>
        </Section>
    );
}