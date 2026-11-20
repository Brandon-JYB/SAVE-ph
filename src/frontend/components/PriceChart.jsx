const W = 640;
const H = 280;
const PAD = { top: 22, right: 20, bottom: 34, left: 46 };

// "2024 Q1" -> "Q1 ’24"
const shortLabel = (label) => label.replace(/^\d{2}(\d{2}) (Q\d)$/, "$2 ’$1");

export default function PriceChart({ history, crops, highlight }) {
    if (!history?.length || !crops?.length) return null;

    const values = history.flatMap((row) => crops.map((crop) => row[crop])).filter(Number.isFinite);
    if (!values.length) return null;

    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;

    const spread = Math.max(...values) - Math.min(...values) || 1;
    const yMin = Math.max(0, Math.floor(Math.min(...values) - spread * 0.15));
    const yMax = Math.ceil(Math.max(...values) + spread * 0.15);

    const x = (i) => PAD.left + (history.length > 1 ? (i / (history.length - 1)) * innerW : innerW / 2);
    const y = (v) => PAD.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

    const pathFor = (crop) =>
        history
            .map((row, i) => (Number.isFinite(row[crop]) ? `${x(i)},${y(row[crop])}` : null))
            .filter(Boolean)
            .map((point, n) => `${n ? "L" : "M"}${point}`)
            .join(" ");

    const ticks = Array.from({ length: 5 }, (_, k) => yMin + ((yMax - yMin) * k) / 4);
    const decimals = yMax - yMin < 8 ? 1 : 0;

    // draw the highlighted crop last so it sits on top
    const order = crops
        .map((crop, index) => ({ crop, index }))
        .sort((a, b) => Number(a.crop === highlight) - Number(b.crop === highlight));

    return (
        <svg
            className="chart"
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={`Past quarterly prices in pesos per kilogram for ${crops.join(", ")}`}
        >
            {ticks.map((t) => (
                <g key={t}>
                    <line className="chart__grid" x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} />
                    <text className="chart__tick" x={PAD.left - 8} y={y(t)} textAnchor="end" dominantBaseline="middle">
                        {t.toFixed(decimals)}
                    </text>
                </g>
            ))}

            <text className="chart__tick" x={PAD.left} y={11}>₱ / kg</text>

            {order.map(({ crop, index }) => (
                <g
                    key={crop}
                    className={
                        `chart__series chart__series--${index + 1}` +
                        (highlight && highlight !== crop ? " is-dim" : "")
                    }
                >
                    <path className="chart__line" d={pathFor(crop)} />
                    {history.map((row, n) =>
                        Number.isFinite(row[crop]) ? (
                            <circle key={row.label} className="chart__dot" cx={x(n)} cy={y(row[crop])} r="3.5">
                                <title>{`${crop} · ${row.label}: ₱${row[crop]} per kg`}</title>
                            </circle>
                        ) : null
                    )}
                </g>
            ))}

            {history.map((row, n) => (
                <text key={row.label} className="chart__tick" x={x(n)} y={H - 10} textAnchor="middle">
                    {shortLabel(row.label)}
                </text>
            ))}
        </svg>
    );
}