const W = 640;
const H = 280;
const PAD = { top: 22, right: 20, bottom: 34, left: 46 };

export default function PriceChart({ series, unit = "PHP/kg" }) {
    if (!series?.length) return null;

    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;

    const all = series.flatMap((d) => [d.price, d.low ?? d.price, d.high ?? d.price]);
    const spread = Math.max(...all) - Math.min(...all) || 1;
    const yMin = Math.floor(Math.min(...all) - spread * 0.15);
    const yMax = Math.ceil(Math.max(...all) + spread * 0.15);

    const x = (i) => PAD.left + (series.length > 1 ? (i / (series.length - 1)) * innerW : innerW / 2);
    const y = (v) => PAD.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

    const firstForecast = series.findIndex((d) => d.forecast);
    const lastPast = firstForecast === -1 ? series.length - 1 : Math.max(firstForecast - 1, 0);

    const line = (from, to) =>
        series
            .slice(from, to + 1)
            .map((d, n) => `${n ? "L" : "M"}${x(from + n)},${y(d.price)}`)
            .join(" ");

    const pastPath = line(0, lastPast);
    const forecastPath = firstForecast === -1 ? "" : line(lastPast, series.length - 1);

    // shaded "likely range" around the forecast
    let bandPath = "";
    if (firstForecast !== -1) {
        const idx = series.map((_, i) => i).filter((i) => i >= lastPast);
        const upper = idx.map((i, n) => `${n ? "L" : "M"}${x(i)},${y(series[i].high ?? series[i].price)}`);
        const lower = [...idx].reverse().map((i) => `L${x(i)},${y(series[i].low ?? series[i].price)}`);
        bandPath = `${upper.join(" ")} ${lower.join(" ")} Z`;
    }

    const ticks = Array.from({ length: 5 }, (_, k) => yMin + ((yMax - yMin) * k) / 4);
    const decimals = yMax - yMin < 8 ? 1 : 0;
    const last = series[series.length - 1];

    return (
        <svg
            className="chart"
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={`Price in ${unit} from ${series[0].label} to ${last.label}, ending near ${last.price}`}
        >
            {ticks.map((t) => (
                <g key={t}>
                    <line className="chart__grid" x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} />
                    <text className="chart__tick" x={PAD.left - 8} y={y(t)} textAnchor="end" dominantBaseline="middle">
                        {t.toFixed(decimals)}
                    </text>
                </g>
            ))}

            <text className="chart__tick" x={PAD.left} y={11}>{unit}</text>

            {bandPath && <path className="chart__band" d={bandPath} />}
            <path className="chart__line" d={pastPath} />
            {forecastPath && <path className="chart__line chart__line--forecast" d={forecastPath} />}

            {series.map((d, i) => (
                <g key={`${d.label}-${i}`}>
                    <circle
                        className={"chart__dot" + (d.forecast ? " chart__dot--forecast" : "")}
                        cx={x(i)}
                        cy={y(d.price)}
                        r="4.5"
                    >
                        <title>{`${d.label}: ${d.price} ${unit}${d.forecast ? " (forecast)" : ""}`}</title>
                    </circle>
                    <text className="chart__tick" x={x(i)} y={H - 10} textAnchor="middle">{d.label}</text>
                </g>
            ))}
        </svg>
    );
}