from pathlib import Path

import numpy as np
import pandas as pd

rng = np.random.default_rng(42)

CROPS = {
    "Rice":    (22, 4000, [0.90, 0.95, 1.15, 1.05]),
    "Corn":    (14, 3500, [1.10, 1.15, 0.90, 0.85]),
    "Coconut": (30, 1800, [1.00, 1.00, 1.00, 1.00]),
    "Banana":  (18, 2800, [1.00, 0.95, 0.95, 1.05]),
    "Lettuce": (60, 1500, [1.15, 0.85, 0.75, 1.20]),
    "Tomato":  (45, 2200, [1.15, 0.80, 0.75, 1.20]),
}

REGION_YIELD = {
    "CALABARZON":    {"Coconut": 1.15, "Banana": 1.10, "Lettuce": 1.10, "Tomato": 0.95},
    "Central Luzon": {"Rice": 1.15, "Corn": 1.10},
}
REGION_RAIN_OFFSET = {"CALABARZON": 40, "Central Luzon": 0}
QUARTER_RAIN_MM = [120, 250, 600, 350]  

rows = []
for region in REGION_YIELD:
    for crop, (base_price, base_yield, q_mult) in CROPS.items():
        for year in range(2021, 2026):
            for quarter in range(1, 5):
                m = q_mult[quarter - 1]
                region_factor = REGION_YIELD[region].get(crop, 1.0)
                yield_kg = base_yield * m * region_factor * rng.normal(1, 0.07)

                price = (
                    base_price
                    * (1 + 0.5 * (1 - m))
                    * (1 + 0.03 * (year - 2021))
                    * rng.normal(1, 0.05)
                )
                rain = (
                    QUARTER_RAIN_MM[quarter - 1]
                    + REGION_RAIN_OFFSET[region]
                    + rng.normal(0, 30)
                )
                rows.append(
                    {
                        "crop": crop,
                        "region": region,
                        "year": year,
                        "quarter": quarter,
                        "avg_price_php_kg": round(price, 2),
                        "rainfall_mm": round(rain, 1),
                        "yield_kg_ha": round(yield_kg, 1),
                        "income_php_ha": round(price * yield_kg, 2),
                    }
                )

out = Path(__file__).parent / "data"
out.mkdir(exist_ok=True)
pd.DataFrame(rows).to_csv(out / "crops.csv", index=False)
print(f"Wrote {len(rows)} rows to {out / 'crops.csv'}")