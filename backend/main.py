import json
import os

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import sys
import logging
log = logging.getLogger(__name__)
formatter = logging.Formatter("%(asctime)s [%(processName)s: %(process)d] [%(threadName)s: %(thread)d] [%(levelname)s] %(name)s: %(message)s")
stream_handler = logging.StreamHandler(sys.stdout)
stream_handler.setFormatter(formatter)
log.setLevel(logging.DEBUG)
log.addHandler(stream_handler)

app = FastAPI()

app.mount("/static", StaticFiles(directory="dist"), name="static")



class DummyResponse(BaseModel):
    message: str
    status: str


class DummyPostResponse(BaseModel):
    message: str
    received: dict


@app.get("/api/dummy-get", response_model=DummyResponse)
async def dummy_get(request: Request):
    log.error(f"Headers received: {request.headers!r}")
    log.error(f"Environment: {os.environ!r}")
    return {
        "message": "This is a dummy GET reply",
        "status": "success"
    }


@app.post("/api/dummy-post", response_model=DummyPostResponse, responses={
    200: {
        "description": "A dummy POST response",
        "content": {
            "application/json": {
                "example": {
                    "message": "This is a dummy POST response",
                    "received": {"sample": "data"}
                }
            }
        }
    }
})
async def dummy_post(request: Request):
    try:
        data = await request.json()
    except Exception:
        data = {}
    return {"message": "This is a dummy POST response", "received": data}


@app.get("/")
def root():
    return RedirectResponse(url="/api/dummy-get")
