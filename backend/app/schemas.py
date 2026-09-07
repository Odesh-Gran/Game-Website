# app/schemas.py
from pydantic import BaseModel
from datetime import datetime

class AchievementCreate(BaseModel):
    name: str
    description: str | None = None

class AchievementResponse(BaseModel):
    id: int
    name: str
    description: str | None
    earned_at: datetime

    class Config:
        from_attributes = True