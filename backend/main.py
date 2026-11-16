from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

BASE = Path(__file__).parent
model = joblib.load(BASE / "model.pkl")
data = pd.read_csv(BASE / "data" / "crops.csv")

CROPS = sorted(data["crop"].unique())
REGIONS = sorted(data["region"].unique())

stats = data.groupby(["crop", "region", "quarter"])[
    ["avg_price_php_kg", "rainfall_mm"]
].mean()

_grid = pd.DataFrame(
    [(c, r, q) for c in CROPS for r in REGIONS for q in (1, 2, 3, 4)],
    columns=["crop", "region", "quarter"],
)
MAX_INCOME = float(model.predict(_grid).max())

SEASONS = {
    1: "January to March, dry season",
    2: "April to June, start of the rainy season",
    3: "July to September, rainy season",
    4: "October to December, end of the rainy season",
}

DISCLAIMER = (
    "Predictions are estimates based on historical data and are not guaranteed. "
    "Actual results depend on weather, prices, and farm conditions."
)

app = FastAPI(title="SAVE PH Crop Predictor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "message": "SAVE PH crop predictor is running"}


@app.get("/options")
def options():
    """Values for the region and quarter dropdowns."""
    return {"regions": REGIONS, "quarters": [1, 2, 3, 4]}


@app.get("/predict")
def predict(region: str, quarter: int = Query(..., ge=1, le=4)):
    if region not in REGIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown region. Choose one of: {', '.join(REGIONS)}",
        )

    rows = pd.DataFrame({"crop": CROPS, "region": region, "quarter": quarter})
    rows["income"] = model.predict(rows)
    top = rows.sort_values("income", ascending=False).head(3)
    top_names = list(top["crop"])

    hist = data[(data["region"] == region) & (data["crop"].isin(top_names))]
    periods = sorted(set(zip(hist["year"], hist["quarter"])))[-8:]
    price_history = []
    for y, q in periods:
        row = {"label": f"{int(y)} Q{int(q)}"}
        for name in top_names:
            m = hist[
                (hist["year"] == y) & (hist["quarter"] == q) & (hist["crop"] == name)
            ]
            row[name] = round(float(m["avg_price_php_kg"].mean()), 2)
        price_history.append(row)

    results = []
    for rank, (_, r) in enumerate(top.iterrows(), start=1):
        name = r["crop"]
        s = stats.loc[(name, region, quarter)]
        latest = price_history[-1][name] if price_history else None
        year_ago = price_history[-5][name] if len(price_history) >= 5 else None
        change = (
            round(100 * (latest - year_ago) / year_ago, 1)
            if latest and year_ago
            else None
        )
        results.append(
            {
                "rank": rank,
                "name": name,
                "score": min(100, round(100 * r["income"] / MAX_INCOME)),
                "est_income_php_ha": round(float(r["income"])),
                "avg_price_php_kg": round(float(s["avg_price_php_kg"]), 2),
                "avg_rainfall_mm": round(float(s["rainfall_mm"])),
                "latest_price_php_kg": latest,
                "price_change_pct": change,
            }
        )

    return {
        "region": region,
        "quarter": quarter,
        "season": SEASONS[quarter],
        "latest_period": price_history[-1]["label"] if price_history else None,
        "crops": results,
        "price_history": price_history,
        "disclaimer": DISCLAIMER,
    }