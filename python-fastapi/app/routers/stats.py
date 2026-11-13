from fastapi import APIRouter, Depends

from app.crud import stats_summary
from app.database import get_db
from app.schemas import StatsOut

router = APIRouter()


@router.get("/stats/summary", response_model=StatsOut)
def summary(db=Depends(get_db)):
    return StatsOut(**stats_summary(db))