from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

BASE = Path(__file__).parent
df = pd.read_csv(BASE / "data" / "crops.csv")

FEATURES = ["crop", "region", "quarter"]
TARGET = "income_php_ha"


def build_model():
    prep = ColumnTransformer(
        [("cat", OneHotEncoder(handle_unknown="ignore"), FEATURES)]
    )
    return Pipeline(
        [
            ("prep", prep),
            ("rf", RandomForestRegressor(n_estimators=200, random_state=42)),
        ]
    )


X_train, X_test, y_train, y_test = train_test_split(
    df[FEATURES], df[TARGET], test_size=0.2, random_state=42
)
check = build_model().fit(X_train, y_train)
pred = check.predict(X_test)
print(f"Test R2 score: {r2_score(y_test, pred):.3f}  (1.0 is perfect)")
print(f"Average error: {mean_absolute_error(y_test, pred):,.0f} PHP per hectare")

final = build_model().fit(df[FEATURES], df[TARGET])
joblib.dump(final, BASE / "model.pkl")
print("Saved model.pkl")