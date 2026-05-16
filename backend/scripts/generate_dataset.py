"""Generate sample insurance dataset matching classic Kaggle structure."""
import numpy as np
import pandas as pd
from pathlib import Path

np.random.seed(42)
n = 1338
regions = ["northeast", "northwest", "southeast", "southwest"]
sexes = ["male", "female"]

rows = []
for _ in range(n):
    age = int(np.random.randint(18, 65))
    sex = np.random.choice(sexes)
    bmi = round(np.random.normal(28, 6), 1)
    children = int(np.random.randint(0, 6))
    smoker = np.random.choice(["yes", "no"], p=[0.2, 0.8])
    region = np.random.choice(regions)
    base = 3000 + age * 120 + bmi * 80 + children * 200
    if smoker == "yes":
        base *= 2.2
    if sex == "male":
        base *= 1.05
    region_mult = {"northeast": 1.1, "northwest": 0.95, "southeast": 1.05, "southwest": 0.9}
    base *= region_mult[region]
    charges = round(base + np.random.normal(0, 1500), 2)
    rows.append({
        "age": age, "sex": sex, "bmi": bmi, "children": children,
        "smoker": smoker, "region": region, "charges": max(charges, 1000),
    })

df = pd.DataFrame(rows)
out = Path(__file__).resolve().parent.parent / "data" / "insurance.csv"
out.parent.mkdir(parents=True, exist_ok=True)
df.to_csv(out, index=False)
print(f"Wrote {len(df)} rows to {out}")
