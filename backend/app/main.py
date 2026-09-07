# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, achievements  # <-- Импортируем модуль с эндпоинтами

# Создаём таблицы в БД
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Game API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500", "http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ПОДКЛЮЧАЕМ РОУТЕР (ЭТО ГЛАВНОЕ!)
app.include_router(auth.router)  # <-- БЕЗ ЭТОЙ СТРОКИ ЭНДПОИНТЫ НЕ РАБОТАЮТ
app.include_router(achievements.router)

@app.get("/")
def root():
    return {"message": "Game API is running!"}

@app.get("/api/v1/health")
def health():
    return {"status": "OK", "message": "Бэкенд работает!"}