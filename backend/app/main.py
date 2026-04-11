import uvicorn
import sys
import os

# Add the parent directory of 'app' to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user_routes, score_routes, scheme_routes, application_routes, partner_routes, intelligence_routes, chat_routes
from app.routes import voice_routes
from app.config.db import ping_db

app = FastAPI(title="Invisible India API", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://0.0.0.0:5173",
        "https://localhost:5173",
        "https://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(user_routes.router, prefix="/api", tags=["Users"])
app.include_router(score_routes.router, prefix="/api", tags=["Intelligence"])
app.include_router(scheme_routes.router, prefix="/api", tags=["Schemes"])
app.include_router(application_routes.router, prefix="/api", tags=["Applications"])
app.include_router(intelligence_routes.router, prefix="/api", tags=["Model AI"])
app.include_router(partner_routes.router, prefix="/api/partner", tags=["Partner Portal"])
app.include_router(chat_routes.router,   prefix="/api",          tags=["Assistant"])
app.include_router(voice_routes.router,  prefix="/api",          tags=["Voice Assistant"])

@app.on_event("startup")
async def startup_db_client():
    await ping_db()

@app.get("/")
async def root():
    return {"message": "Welcome to Invisible India API"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)