from fastapi import FastAPI
from backend.routes.ai_routes import router as ai_router

app = FastAPI(title="AegisIQ AI Integration API")

# This plugs your AI routes into the main application under the "/ai" path
app.include_router(ai_router, prefix="/ai")

@app.get("/")
def health_check():
    return {"status": "success", "message": "AegisIQ Backend is running perfectly!"}