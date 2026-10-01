#!/usr/bin/env bash
# dev.sh — Start both the FastAPI server and Next.js frontend for local development
# Run from the repo ROOT: bash dev.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$SCRIPT_DIR/server"

# ── Check Python ──────────────────────────────────────────────────────────────
if ! command -v python3.11 &>/dev/null && ! command -v python3 &>/dev/null; then
  echo "❌ Python 3 not found. Install Python 3.11+"
  exit 1
fi
PYTHON=$(command -v python3.11 || command -v python3)

# ── Server setup ──────────────────────────────────────────────────────────────
echo "▶ Setting up FastAPI server..."
cd "$SERVER_DIR"

if [ ! -d "venv" ]; then
  echo "  Creating virtual environment..."
  $PYTHON -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt -q

if [ ! -f ".env.local" ]; then
  echo ""
  echo "⚠️  server/.env.local not found!"
  echo "   Copy server/.env.example to server/.env.local and fill in your values:"
  echo "   cp server/.env.example server/.env.local"
  echo ""
  deactivate
  exit 1
fi

echo "▶ Starting FastAPI server on http://localhost:8000 ..."
APP_ENV=local uvicorn app.main:app --reload --port 8000 &
SERVER_PID=$!
deactivate

# ── Frontend setup ────────────────────────────────────────────────────────────
cd "$SCRIPT_DIR"

if [ ! -f ".env.local" ]; then
  echo ""
  echo "⚠️  .env.local not found!"
  echo "   Copy .env.example to .env.local:"
  echo "   cp .env.example .env.local"
  echo ""
  kill $SERVER_PID 2>/dev/null
  exit 1
fi

echo "▶ Starting Next.js on http://localhost:3000 ..."
npm run dev &
FRONTEND_PID=$!

# ── Cleanup on exit ───────────────────────────────────────────────────────────
cleanup() {
  echo ""
  echo "Shutting down..."
  kill $SERVER_PID $FRONTEND_PID 2>/dev/null
  exit 0
}
trap cleanup SIGINT SIGTERM

echo ""
echo "✅ Both services running!"
echo "   Frontend → http://localhost:3000"
echo "   Backend  → http://localhost:8000"
echo "   API docs → http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both."
wait
