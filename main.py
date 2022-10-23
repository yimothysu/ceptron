from fastapi import FastAPI

import summarize
import image

app = FastAPI()
app.include_router(summarize.router)
app.include_router(image.router)

@app.get("/api/")
async def root():
    return {"message": "Hello World"}