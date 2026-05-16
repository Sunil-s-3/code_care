import io
import os
from pathlib import Path
import pandas as pd
from fastapi import HTTPException, UploadFile
from app.config import get_settings

settings = get_settings()
REQUIRED_COLUMNS = ["age", "sex", "bmi", "children", "smoker", "region", "charges"]

_df: pd.DataFrame | None = None


def _resolve_dataset_path() -> Path:
    path = Path(settings.DATASET_PATH)
    if not path.is_absolute():
        path = Path(__file__).resolve().parent.parent.parent / path
    return path


def load_dataset() -> pd.DataFrame:
    global _df
    if _df is not None:
        return _df
    path = _resolve_dataset_path()
    if not path.exists():
        raise FileNotFoundError(f"Dataset not found at {path}")
    _df = pd.read_csv(path)
    _normalize_df(_df)
    return _df


def _normalize_df(df: pd.DataFrame) -> None:
    df.columns = [c.strip().lower() for c in df.columns]
    missing = set(REQUIRED_COLUMNS) - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns: {missing}")
    df["smoker"] = df["smoker"].astype(str).str.lower().str.strip()
    df["sex"] = df["sex"].astype(str).str.lower().str.strip()
    df["region"] = df["region"].astype(str).str.lower().str.strip()


def reload_dataset(df: pd.DataFrame) -> int:
    global _df
    _normalize_df(df)
    _df = df.copy()
    return len(_df)


async def upload_csv(file: UploadFile) -> int:
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid CSV file")
    try:
        return reload_dataset(df)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


def get_dashboard_data() -> dict:
    df = load_dataset()

    smoker_yes = df[df["smoker"] == "yes"]["charges"].mean()
    smoker_no = df[df["smoker"] != "yes"]["charges"].mean()
    smoking_impact = ((smoker_yes / smoker_no) - 1) * 100 if smoker_no else 0

    high_risk = int(((df["bmi"] >= 30) | (df["smoker"] == "yes")).sum())

    stats = {
        "total_spending": round(float(df["charges"].sum()), 2),
        "average_insurance_cost": round(float(df["charges"].mean()), 2),
        "high_risk_patients": high_risk,
        "bmi_average": round(float(df["bmi"].mean()), 2),
        "smoking_impact_score": round(float(smoking_impact), 2),
    }

    # Sample scatter points for performance (max 500)
    sample = df.sample(n=min(500, len(df)), random_state=42) if len(df) > 500 else df

    age_vs_charges = [
        {"age": int(r["age"]), "charges": round(float(r["charges"]), 2)}
        for _, r in sample.iterrows()
    ]
    bmi_vs_charges = [
        {"bmi": round(float(r["bmi"]), 2), "charges": round(float(r["charges"]), 2)}
        for _, r in sample.iterrows()
    ]

    smoker_comparison = []
    for label, mask in [("Smoker", df["smoker"] == "yes"), ("Non-smoker", df["smoker"] != "yes")]:
        smoker_comparison.append({
            "category": label,
            "avgCharges": round(float(df[mask]["charges"].mean()), 2),
            "count": int(mask.sum()),
        })

    region_costs = []
    for region, group in df.groupby("region"):
        region_costs.append({
            "region": region.title(),
            "avgCharges": round(float(group["charges"].mean()), 2),
            "totalCharges": round(float(group["charges"].sum()), 2),
        })

    gender_analysis = []
    for sex, group in df.groupby("sex"):
        gender_analysis.append({
            "gender": "Female" if sex == "female" else "Male",
            "avgCharges": round(float(group["charges"].mean()), 2),
            "minCharges": round(float(group["charges"].min()), 2),
            "maxCharges": round(float(group["charges"].max()), 2),
        })

    # Simulated monthly trends from row buckets
    n = len(df)
    bucket_size = max(1, n // 12)
    monthly_trends = []
    for i in range(12):
        start = i * bucket_size
        end = start + bucket_size if i < 11 else n
        chunk = df.iloc[start:end]
        monthly_trends.append({
            "month": ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
            "avgCharges": round(float(chunk["charges"].mean()), 2),
            "totalCharges": round(float(chunk["charges"].sum()), 2),
            "patients": len(chunk),
        })

    return {
        "stats": stats,
        "age_vs_charges": age_vs_charges,
        "bmi_vs_charges": bmi_vs_charges,
        "smoker_comparison": smoker_comparison,
        "region_costs": region_costs,
        "gender_analysis": gender_analysis,
        "monthly_trends": monthly_trends,
        "total_records": len(df),
    }


def generate_report_csv() -> str:
    data = get_dashboard_data()
    lines = [
        "Cost Care Analytics Report",
        "",
        "Summary Statistics",
        f"Total Healthcare Spending,{data['stats']['total_spending']}",
        f"Average Insurance Cost,{data['stats']['average_insurance_cost']}",
        f"High Risk Patients,{data['stats']['high_risk_patients']}",
        f"BMI Average,{data['stats']['bmi_average']}",
        f"Smoking Impact Score (%),{data['stats']['smoking_impact_score']}",
        f"Total Records,{data['total_records']}",
        "",
        "Smoker Comparison",
        "Category,Avg Charges,Count",
    ]
    for row in data["smoker_comparison"]:
        lines.append(f"{row['category']},{row['avgCharges']},{row['count']}")
    lines += ["", "Region Costs", "Region,Avg Charges,Total Charges"]
    for row in data["region_costs"]:
        lines.append(f"{row['region']},{row['avgCharges']},{row['totalCharges']}")
    lines += ["", "Gender Analysis", "Gender,Avg,Min,Max"]
    for row in data["gender_analysis"]:
        lines.append(f"{row['gender']},{row['avgCharges']},{row['minCharges']},{row['maxCharges']}")
    lines += ["", "Monthly Trends", "Month,Avg Charges,Total,Patients"]
    for row in data["monthly_trends"]:
        lines.append(f"{row['month']},{row['avgCharges']},{row['totalCharges']},{row['patients']}")
    return "\n".join(lines)
