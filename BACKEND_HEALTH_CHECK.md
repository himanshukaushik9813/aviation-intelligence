# Backend Health Check Implementation

This document explains how the backend health check feature works in your Aviation Intelligence platform.

## Overview

The health check system automatically monitors your FastAPI backend connection status and displays it in the dashboard UI.

## Components

### 1. Backend Health Endpoint
**File**: `backend/api/main.py` (lines 106-108)

```python
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "adip-backend"}
```

### 2. Custom React Hook
**File**: `frontend/src/hooks/useBackendHealth.ts`

- Automatically checks backend `/health` endpoint
- Configurable check interval (default: 30 seconds)
- 5-second timeout for each request
- Returns status: `checking`, `connected`, `disconnected`, or `error`

**Usage**:
```typescript
const { status, message, backendInfo, refetch } = useBackendHealth(30000);
```

### 3. UI Component
**File**: `frontend/src/components/dashboard/backend-status.tsx`

Visual indicator showing:
- **Green (Wifi icon)**: Backend is connected
- **Yellow (Spinning icon)**: Checking connection
- **Red (WifiOff icon)**: Backend is offline
- **Orange (Warning icon)**: Connection error

### 4. Environment Configuration
**File**: `frontend/.env.local`

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## How to Test

### Test 1: Backend Running (Should show Connected)
```bash
# Terminal 1: Start the backend
cd backend
python -m uvicorn api.main:app --reload --port 8000

# Terminal 2: Start the frontend
cd frontend
npm run dev
```

Visit http://localhost:3000 - You should see a **green "Backend Connected"** indicator in the top right.

### Test 2: Backend Not Running (Should show Offline)
```bash
# Stop the backend (Ctrl+C in Terminal 1)
# Keep frontend running

# Refresh the page at http://localhost:3000
```

You should see a **red "Backend Offline"** indicator with a RETRY button.

### Test 3: Manual Retry
1. Stop the backend
2. Wait for status to show "Backend Offline"
3. Restart the backend
4. Click the "RETRY" button in the UI
5. Status should change to "Backend Connected"

## Features

- **Automatic polling**: Checks backend every 30 seconds
- **Timeout protection**: 5-second timeout prevents hanging
- **Manual retry**: Click retry button when backend is offline
- **Real-time updates**: Status updates automatically
- **Visual feedback**: Clear color-coded status indicators
- **Backend info**: Shows backend service name when connected

## Customization

### Change Check Interval
Edit the interval in `frontend/src/app/page.tsx`:

```typescript
const { status } = useBackendHealth(60000); // Check every 60 seconds
```

### Change Backend URL
Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://your-backend-url:8000
```

### Change Timeout Duration
Edit `frontend/src/hooks/useBackendHealth.ts` (line 28):

```typescript
const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
```

## Troubleshooting

### Status shows "Backend Offline" even when backend is running

1. Check if backend is running on port 8000:
   ```bash
   curl http://localhost:8000/health
   ```

2. Check CORS settings in `backend/api/main.py`:
   ```python
   allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"]
   ```

3. Check browser console for errors

### Status stuck on "Checking..."

- Check if the backend URL in `.env.local` is correct
- Ensure the backend `/health` endpoint is accessible
- Check browser network tab for request status

## API Response Format

The `/health` endpoint returns:

```json
{
  "status": "healthy",
  "service": "adip-backend"
}
```

The UI displays this information when connected.
