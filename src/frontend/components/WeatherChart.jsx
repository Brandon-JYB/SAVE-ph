const W = 420;
const H = 240;
const PAD = { top: 28, right: 12, bottom: 56, left: 12 };

export default function WeatherChart({ months }) {
    if (!months?.length) return null;

    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const maxRain = Math.max(...months.map((m) => m.rainfallMm), 1);
    const slot = innerW / months.length;
    const barW = Math.min(slot * 0.5, 64);
    const baseY = PAD.top + innerH;

    const summary = months
        .map((m) => `${m.label}: ${Math.round(m.rainfallMm)} millimetres of rain, ${Math.round(m.avgTempC)} degrees`)
        .join("; ");

    return (
        <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Expected weather. ${summary}`}>
            <line className="chart__grid" x1={PAD.left} x2={W - PAD.right} y1={baseY} y2={baseY} />

            {months.map((m, i) => {
                const h = (m.rainfallMm / maxRain) * innerH;
                const cx = PAD.left + slot * i + slot / 2;

                return (
                    <g key={m.label}>
                        <rect className="chart__bar" x={cx - barW / 2} y={baseY - h} width={barW} height={h} rx="6">
                            <title>{`${m.label}: ${Math.round(m.rainfallMm)} mm of rain, ${Math.round(m.avgTempC)}°C`}</title>
                        </rect>
                        <text className="chart__value" x={cx} y={baseY - h - 8} textAnchor="middle">
                            {Math.round(m.rainfallMm)} mm
                        </text>
                        <text className="chart__tick" x={cx} y={H - 30} textAnchor="middle">{m.label}</text>
                        <text className="chart__temp" x={cx} y={H - 10} textAnchor="middle">
                            {Math.round(m.avgTempC)}°C
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}