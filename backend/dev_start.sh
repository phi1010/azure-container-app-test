#!/bin/bash
# Start FastAPI app with Uvicorn in auto-reload mode for development
exec uv run uvicorn main:app --reload --log-level debug

