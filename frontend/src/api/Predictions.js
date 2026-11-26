import { getOptions, getPrediction } from "./Client";

/* Set VITE_DATA_IS_SAMPLE=false in .env once the model is trained on real data. */
export const DATA_IS_SAMPLE = import.meta.env.VITE_DATA_IS_SAMPLE !== "false";

export const QUARTERS = [
    { value: 1, label: "Q1", months: "Jan–Mar" },
    { value: 2, label: "Q2", months: "Apr–Jun" },
    { value: 3, label: "Q3", months: "Jul–Sep" },
    { value: 4, label: "Q4", months: "Oct–Dec" },
];

export const currentQuarter = () => Math.floor(new Date().getMonth() / 3) + 1;

export const formatPeso = (value, digits = 0) =>
    new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);

/* ---- small caches, so the landing teaser and the Predictions page share their requests ---- */

let optionsPromise = null;

export function loadOptions() {
    if (!optionsPromise) {
        optionsPromise = getOptions().catch((error) => {
            optionsPromise = null;
            throw error;
        });
    }
    return optionsPromise;
}

const forecasts = new Map();

/* All four quarters for one region: { 1: {...}, 2: {...}, 3: {...}, 4: {...} } */
export function loadRegionForecast(region) {
    if (!forecasts.has(region)) {
        const promise = Promise.all(QUARTERS.map((q) => getPrediction({ region, quarter: q.value })))
            .then((list) => Object.fromEntries(list.map((forecast) => [forecast.quarter, forecast])))
            .catch((error) => {
                forecasts.delete(region);
                throw error;
            });
        forecasts.set(region, promise);
    }
    return forecasts.get(region);
}