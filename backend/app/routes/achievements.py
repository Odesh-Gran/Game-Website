# app/routes/achievements.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Achievement
from app.auth import get_current_user
from pydantic import BaseModel
from datetime import datetime

# ============================================
# СХЕМЫ (Pydantic)
# ============================================
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

# ============================================
# СОЗДАЁМ РОУТЕР (ЭТО ГЛАВНОЕ!)
# ============================================
router = APIRouter(prefix="/api/v1", tags=["achievements"])  # <-- ЭТУ СТРОЧКУ ДОБАВЬ!

# ============================================
# 1. ПОЛУЧИТЬ ВСЕ ДОСТИЖЕНИЯ ИГРОКА
# ============================================
@router.get("/achievements", response_model=list[AchievementResponse])
def get_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Возвращает список достижений текущего игрока."""
    achievements = db.query(Achievement).filter(
        Achievement.user_id == current_user.id
    ).order_by(Achievement.earned_at.desc()).all()
    return achievements

# ============================================
# 2. СОХРАНИТЬ НОВОЕ ДОСТИЖЕНИЕ
# ============================================
@router.post("/achievements", status_code=status.HTTP_201_CREATED)
def create_achievement(
    achievement: AchievementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Сохраняет новое достижение для текущего игрока."""
    # Проверяем, нет ли уже такого достижения у игрока
    existing = db.query(Achievement).filter(
        Achievement.user_id == current_user.id,
        Achievement.name == achievement.name
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Это достижение уже получено"
        )
    
    new_achievement = Achievement(
        user_id=current_user.id,
        name=achievement.name,
        description=achievement.description
    )
    
    db.add(new_achievement)
    db.commit()
    db.refresh(new_achievement)
    
    return new_achievement