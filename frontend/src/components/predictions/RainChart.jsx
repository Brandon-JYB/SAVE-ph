const W = 420;
const H = 240;
const PAD = { top: 28, right: 12, bottom: 52, left: 12 };

export default function RainChart({ data, selected }) {
    if (!data?.length) return null;

    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const maxRain = Math.max(...data.map((d) => d.mm), 1);
    const slot = innerW / data.length;
    const barW = Math.min(slot * 0.55, 64);
    const baseY = PAD.top + innerH;

    const summary = data.map((d) => `${d.label} ${d.months}: ${d.mm} millimetres`).join("; ");

    return (
        <svg
            className="chart chart--rain"
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={`Average rainfall per quarter. ${summary}`}
        >
            <line className="chart__grid" x1={PAD.left} x2={W - PAD.right} y1={baseY} y2={baseY} />

            {data.map((d, i) => {
                const h = (d.mm / maxRain) * innerH;
                const cx = PAD.left + slot * i + slot / 2;

                return (
                    <g key={d.value}>
                        <rect
                            className={"chart__bar" + (d.value === selected ? " is-selected" : "")}
                            x={cx - barW / 2}
                            y={baseY - h}
                            width={barW}
                            height={h}
                            rx="6"
                        >
                            <title>{`${d.label} (${d.months}): about ${d.mm} mm of rain`}</title>
                        </rect>
                        <text className="chart__value" x={cx} y={baseY - h - 8} textAnchor="middle">
                            {d.mm} mm
                        </text>
                        <text className="chart__tick" x={cx} y={H - 28} textAnchor="middle">{d.label}</text>
                        <text className="chart__temp" x={cx} y={H - 10} textAnchor="middle">{d.months}</text>
                    </g>
                );
            })}
        </svg>
    );
}