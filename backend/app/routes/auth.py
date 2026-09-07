# app/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.auth import hash_password, verify_password, create_access_token
from pydantic import BaseModel, EmailStr

# Схемы для валидации данных
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

# Создаем роутер с префиксом /api/v1
router = APIRouter(prefix="/api/v1", tags=["auth"])

# ЭНДПОИНТ РЕГИСТРАЦИИ
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Проверяем, занят ли логин
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Логин уже занят")
    
    # Хешируем пароль
    hashed = hash_password(user_data.password)
    
    # Создаем нового пользователя
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "Аккаунт создан!"}

# ЭНДПОИНТ ЛОГИНА
@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    # Ищем пользователя по логину
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    
    # Проверяем пароль
    if not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    
    # Создаем настоящий JWT-токен
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}