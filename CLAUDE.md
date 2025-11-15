# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Deal Detective V2 is a pirate-themed 8-bit real estate wholesaling training game. Players estimate property values (ARV, Repairs, MAO, LAO) and receive scores based on accuracy compared to real property data.

## Architecture

Full-stack application with separate client and server:

- **Frontend**: React + Vite SPA that fetches properties, displays Street View images, collects user estimates, and shows scoring feedback
- **Backend**: Express API that loads property data from CSV, geocodes addresses via Google Maps API, and calculates scores based on percentage difference from actual values

### Key Data Flow

1. Server loads `sample_properties.csv` on startup into memory
2. Client requests properties via `/api/properties` (without answer data)
3. Server geocodes addresses and returns public property info + coordinates
4. User submits estimates to `/api/submit`
5. Server calculates scores (1-10 scale) based on percentage difference and returns color-coded results
6. Client displays ScoreCard component with feedback

### Scoring Algorithm

Located in `server/index.js` (lines 94-121):
- 0-5% difference = 10 (green)
- 5-10% = 9 (green)
- 10-15% = 8 (green)
- 15-20% = 7 (orange)
- 20-25% = 6 (orange)
- 25-30% = 5 (orange)
- 30-40% = 4 (red)
- 40-50% = 3 (red)
- 50-75% = 2 (red)
- 75-100% = 1 (red)
- >100% = 0 (red)

## Development Commands

### Backend (Terminal 1)
```bash
cd server
npm install        # Install dependencies
npm run dev        # Start with nodemon (auto-reload)
npm start          # Production start
```
Server runs on `http://localhost:3001`

### Frontend (Terminal 2)
```bash
cd client
npm install        # Install dependencies
npm run dev        # Development server with hot reload
npm run build      # Production build to client/dist/
npm run lint       # ESLint check
```
Client runs on `http://localhost:5173`

## Configuration

### Google Maps API Key

Both server and client use environment variables for the Google Maps API key.

**Server**: Create `server/.env` (see `server/.env.example`):
```
GOOGLE_MAPS_API_KEY=your_api_key_here
PORT=3001
```

**Client**: Create `client/.env` (see `client/.env.example`):
```
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

Note: Vite requires the `VITE_` prefix for environment variables to be exposed to the client.

### Property Data

Edit `server/sample_properties.csv` to add/modify properties. Required columns:
- Address (used for geocoding and Street View)
- Notes, Pictures, ContractPrice (shown to player)
- ARV, Repairs, MAO, LAO (hidden answer values)

Server auto-loads CSV on startup; restart to pick up changes.

## Component Structure

Client components (in `client/src/components/`):
- `PropertyCard.jsx`: Displays property info, Street View, input fields, and submit button
- `ScoreCard.jsx`: Shows individual scores with color feedback after submission
- `FinalScore.jsx`: End-game summary with all property scores

## State Management

Single-level React state in `App.jsx`:
- `properties`: Full property list from backend
- `currentPropertyIndex`: Current property being evaluated
- `answers`: User's current estimates (arv, repairs, mao, lao)
- `scores`: Array of completed property scores
- `currentScore`: Score for current property (null until submitted)
- `gameComplete`: Boolean to show FinalScore component

## Dependencies

Frontend: React 19, Vite 7, ESLint 9
Backend: Express 5, csv-parser, cors, axios, nodemon (dev)

## Notes

- Backend uses CommonJS (`type: "commonjs"` in server/package.json)
- Frontend uses ES modules (Vite default)
- API endpoints are hardcoded to `http://localhost:3001` in client code
- Geocoding happens on every `/api/properties` request (consider caching for production)
