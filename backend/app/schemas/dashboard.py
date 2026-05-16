from pydantic import BaseModel
from typing import Any


class StatCards(BaseModel):
    total_spending: float
    average_insurance_cost: float
    high_risk_patients: int
    bmi_average: float
    smoking_impact_score: float


class DashboardDataResponse(BaseModel):
    stats: StatCards
    age_vs_charges: list[dict[str, Any]]
    bmi_vs_charges: list[dict[str, Any]]
    smoker_comparison: list[dict[str, Any]]
    region_costs: list[dict[str, Any]]
    gender_analysis: list[dict[str, Any]]
    monthly_trends: list[dict[str, Any]]
    total_records: int
