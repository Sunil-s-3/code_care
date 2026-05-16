from fastapi import APIRouter, Depends, UploadFile, File
from fastapi.responses import StreamingResponse
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.dashboard import DashboardDataResponse
from app.services import analytics_service

router = APIRouter()


@router.get("/dashboard-data", response_model=DashboardDataResponse)
def dashboard_data(current_user: User = Depends(get_current_user)):
    return analytics_service.get_dashboard_data()


@router.post("/upload-csv")
async def upload_csv(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    count = await analytics_service.upload_csv(file)
    return {"message": "Dataset updated", "rows": count}


@router.get("/report")
def download_report(current_user: User = Depends(get_current_user)):
    content = analytics_service.generate_report_csv()
    return StreamingResponse(
        iter([content]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=costcare_report.csv"},
    )
