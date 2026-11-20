import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ArrowCircleIcon from "../svg/ArrowCircleIcon";
import {
    DATA_IS_SAMPLE,
    QUARTERS,
    currentQuarter,
    loadOptions,
    loadRegionForecast,
} from "../api/Predictions";

export default function PredictionTeaser() {
    const rootRef = useRef(null);
    const [started, setStarted] = useState(false);
    const [regions, setRegions] = useState([]);
    const [region, setRegion] = useState("");
    const [quarter, setQuarter] = useState(currentQuarter());
    const [forecast, setForecast] = useState(null);
    const [status, setStatus] = useState("idle");          // idle | loading | done | error

    // only talk to the backend once this section is close to the screen
    useEffect(() => {
        const el = rootRef.current;
        if (!el || started) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setStarted(true);
            },
            { rootMargin: "300px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return undefined;
        let cancelled = false;

        loadOptions()
            .then(({ regions: list }) => {
                if (cancelled || !list.length) return;
                setRegions(list);
                setRegion(list[0]);
            })
            .catch(() => {
                if (!cancelled) setStatus("error");
            });

        return () => {
            cancelled = true;
        };
    }, [started]);

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
    const showCard = status !== "error";

    return (
        <div className={"teaser" + (showCard ? "" : " teaser--solo")} ref={rootRef}>
            <div className="teaser__copy">
                <span className="teaser__chip">AI-POWERED</span>
                <p>
                    The latest development in Artificial Intelligence has made it possible for us to help the farmers even more by providing an AI prediction model that predicts which plants are most optimal to plant within that quarter of the year based on historical data regarding weather, price, and other external factors.
                </p>
                <Link className="ai-btn" to="/predictions">
                    <span className="ai-btn__text">Open the predictor</span>
                    <ArrowCircleIcon className="ai-btn__icon" />
                </Link>
            </div>

            {showCard && (
                <div className="teaser__card" aria-live="polite">
                    <div className="teaser__top">
                        <span className="teaser__label">TRY IT · LIVE FROM OUR MODEL</span>
                        {DATA_IS_SAMPLE && <span className="teaser__sample">SAMPLE DATA</span>}
                    </div>

                    <label className="teaser__field">
                        <span className="teaser__sr">Region</span>
                        <select
                            className="teaser__select"
                            value={region}
                            onChange={(event) => setRegion(event.target.value)}
                            disabled={!regions.length}
                        >
                            {!regions.length && <option>Loading regions…</option>}
                            {regions.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </label>

                    <div className="teaser__quarters" role="group" aria-label="Quarter">
                        {QUARTERS.map((q) => (
                            <button
                                key={q.value}
                                type="button"
                                className={"teaser__q" + (quarter === q.value ? " is-active" : "")}
                                aria-pressed={quarter === q.value}
                                onClick={() => setQuarter(q.value)}
                            >
                                {q.label}
                            </button>
                        ))}
                    </div>

                    <p className="teaser__season">{result?.season ?? "\u00a0"}</p>

                    {result ? (
                        <ol className="teaser__list">
                            {result.crops.map((crop, index) => (
                                <li
                                    className="teaser__row"
                                    key={`${region}-${quarter}-${crop.name}`}   // new key = the bars grow in again
                                    style={{ "--w": `${crop.score}%`, "--i": index }}
                                >
                                    <span className="teaser__rank">{crop.rank}</span>
                                    <span className="teaser__name">{crop.name}</span>
                                    <span className="teaser__bar" aria-hidden="true">
                                        <span className="teaser__fill" />
                                    </span>
                                    <span className="teaser__score">{crop.score}</span>
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p className="teaser__empty">Warming up the model…</p>
                    )}

                    {result && (
                        <Link
                            className="teaser__more"
                            to={`/predictions?region=${encodeURIComponent(region)}&quarter=${quarter}`}
                        >
                            See prices, rain and the full forecast →
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}