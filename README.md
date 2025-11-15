# Deal Detective V2

A pirate-themed 8-bit real estate wholesaling game built with React and Node.js.

## Features

- Real property data from CSV file
- Google Maps Street View integration
- 1-10 scoring system with color-coded feedback (green/orange/red)
- Pirate-themed 8-bit design
- Downloadable score reports
- Track ARV, Repairs, MAO, and LAO estimates

## Project Structure

```
DealDetectiveV2/
├── client/          # React frontend
├── server/          # Node.js backend
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies (already done):
```bash
npm install
```

3. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

### Frontend Setup

1. Open a new terminal and navigate to the client directory:
```bash
cd client
```

2. Install dependencies (already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will open in your browser at `http://localhost:5173`

## Adding Properties

Edit the `server/sample_properties.csv` file to add more properties. Format:

```csv
Address,Notes,Pictures,ContractPrice,ARV,Repairs,MAO,LAO
123 Main Street,No notes,https://google.com,95000,150000,15000,105000,73500
```

### CSV Columns:
- **Address**: Property address (used for Google Street View)
- **Notes**: Property notes/description
- **Pictures**: URL to property photos
- **ContractPrice**: What the wholesaler contracted the property for
- **ARV**: After Repair Value (true value - not shown to player)
- **Repairs**: Repair costs (true value - not shown to player)
- **MAO**: Max Allowable Offer (true value - not shown to player)
- **LAO**: Lowest Allowable Offer (true value - not shown to player)

## Google Maps API Key

To enable Street View images:

1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Street View Static API
3. Replace `YOUR_API_KEY` in `client/src/components/PropertyCard.jsx` (line 5) with your actual API key

Note: Without an API key, a placeholder image will be shown.

## Scoring System

Each estimate is scored 1-10 based on percentage difference from actual value:
- 0-5% difference = 10 (green)
- 5-10% difference = 9 (green)
- 10-15% difference = 8 (green)
- 15-20% difference = 7 (orange)
- 20-25% difference = 6 (orange)
- 25-30% difference = 5 (orange)
- 30-40% difference = 4 (red)
- 40-50% difference = 3 (red)
- 50-75% difference = 2 (red)
- 75-100% difference = 1 (red)
- >100% difference = 0 (red)

## Development

### Running Both Servers

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

### Production Build

To build the frontend for production:
```bash
cd client
npm run build
```

The optimized files will be in `client/dist/`

## Technologies Used

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Styling**: CSS with Press Start 2P font (8-bit style)
- **APIs**: Google Maps Street View
- **Data**: CSV parsing

## Customization

### Theme Colors

Edit the CSS files in `client/src/` and `client/src/components/` to customize colors:
- Primary: `#ffd700` (gold)
- Background: `#1a1a2e` (dark blue)
- Accent: `#8b4513` (saddle brown)

### Fonts

The 8-bit font is "Press Start 2P" from Google Fonts. Change it in `client/src/App.css`.

## License

MIT
