from fastapi import FastAPI

import summarize

app = FastAPI()
app.include_router(summarize.router)

@app.get("/api/")
async def root():
    return {"message": "Hello World"}