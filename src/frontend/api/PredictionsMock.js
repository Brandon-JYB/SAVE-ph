/* Demo data so the page works before the real model is connected.
    Turn it on with VITE_USE_MOCK_PREDICTIONS=true in .env (restart the dev server).
    These numbers are made up. */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const RAIN = [90, 60, 60, 70, 160, 260, 350, 370, 330, 290, 200, 130];
const TEMP = [26, 26, 27, 29, 29, 28, 27, 27, 27, 27, 27, 26];

const CROPS = [
    { id: "rice", name: "Rice (palay)", base: 21 },
    { id: "corn", name: "Corn", base: 15 },
    { id: "tomato", name: "Tomato", base: 48 },
    { id: "eggplant", name: "Eggplant", base: 40 },
    { id: "cabbage", name: "Cabbage", base: 42 },
    { id: "sweet-potato", name: "Sweet potato", base: 30 },
    { id: "mung-bean", name: "Mung bean", base: 88 },
];

const REASONS = [
    "Expected rainfall suits this crop in this quarter.",
    "Temperatures stay inside the range this crop prefers.",
    "Prices have held up in past quarters for this region.",
];

const round1 = (n) => Math.round(n * 10) / 10;

// small seeded random: the same inputs always give the same demo numbers
function seeded(text) {
    let h = 1779033703 ^ text.length;
    for (let i = 0; i < text.length; i += 1) {
        h = Math.imul(h ^ text.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    return () => {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        h ^= h >>> 16;
        return (h >>> 0) / 4294967296;
    };
}

export async function getMockPrediction({ region, quarter }) {
    await new Promise((resolve) => setTimeout(resolve, 700));   // pretend the model is thinking

    const rand = seeded(`${region}-${quarter}`);
    const firstMonth = (Number(quarter) - 1) * 3;

    const crops = [...CROPS]
        .sort(() => rand() - 0.5)
        .slice(0, 5)
        .map((crop, index) => {
            const drift = (rand() - 0.4) * 0.5;
            let price = crop.base * (0.9 + rand() * 0.2);
            const priceSeries = [];

            for (let step = -3; step < 3; step += 1) {
                const month = MONTHS[(firstMonth + step + 12) % 12];
                price *= 1 + drift * 0.1 + (rand() - 0.5) * 0.06;
                const point = { label: month, price: round1(price) };
                if (step >= 0) {
                    point.forecast = true;
                    point.low = round1(price * 0.93);
                    point.high = round1(price * 1.07);
                }
                priceSeries.push(point);
            }

            const lastPast = priceSeries[2].price;
            const lastForecast = priceSeries[5].price;
            const change = (lastForecast - lastPast) / lastPast;

            return {
                id: crop.id,
                name: crop.name,
                confidence: Math.max(0.5, 0.92 - index * 0.08 - rand() * 0.04),
                trend: change > 0.02 ? "up" : change < -0.02 ? "down" : "flat",
                priceUnit: "PHP/kg",
                reasons: REASONS,
                priceSeries,
            };
        });

    const months = [0, 1, 2].map((offset) => {
        const index = (firstMonth + offset) % 12;
        return {
            label: MONTHS[index],
            rainfallMm: Math.round(RAIN[index] * (0.85 + rand() * 0.3)),
            avgTempC: round1(TEMP[index] + (rand() - 0.5) * 1.5),
        };
    });

    return { isSample: true, region, quarter: Number(quarter), crops, weather: { months } };
}