#!/bin/bash
# Start FastAPI app with gunicorn using the config file
exec uv run gunicorn -c gunicorn.conf.py main:app

