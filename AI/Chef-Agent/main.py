import os
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import HTTPException

# import the existing app
from lab import app

HERE = Path(__file__).parent
FRONTEND_DIR = HERE / "chef-chat" / "dist"
INDEX_FILE = HERE / "chef-chat" / "index.html"

# If a production build exists, mount it as the root static files handler.
if FRONTEND_DIR.exists() and FRONTEND_DIR.is_dir():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
else:
    # If no build, serve the raw index.html at root for convenience (dev or preview).
    if INDEX_FILE.exists():
        @app.get("/", include_in_schema=False)
        async def _index():
            return FileResponse(str(INDEX_FILE))

# SPA fallback for client-side routes. This should be added after API routes so those are matched first.
@app.get("/{full_path:path}", include_in_schema=False)
async def spa_fallback(full_path: str):
    # Let API routes return normally (they are defined in lab.py and registered earlier).
    # If the request looks like an API or common non-SPA path, return 404 so API routing can handle it.
    if full_path.startswith("api") or full_path.startswith("openapi") or full_path.startswith("docs"):
        raise HTTPException(status_code=404)

    if FRONTEND_DIR.exists() and (FRONTEND_DIR / "index.html").exists():
        return FileResponse(str(FRONTEND_DIR / "index.html"))
    if INDEX_FILE.exists():
        return FileResponse(str(INDEX_FILE))

    raise HTTPException(status_code=404)
