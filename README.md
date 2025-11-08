# World Map Travel Tracker

An interactive world map application built with Next.js that allows you to visualize and track your travel progress across the globe. Features include zoom, pan, color customization, and a sleek progress bar.

## Features

### 🗺️ Interactive Map

- **Full-screen world map** with SVG-based rendering
- **Zoom controls** - Zoom in/out with smooth transitions (1x to 3x)
- **Pan/Drag functionality** - Navigate the map when zoomed in
- **Reset zoom** - Quickly return to the default view
- **Map preview** - Mini-map in the top-right corner showing current viewport (visible when zoomed)

### 🎨 Visual Customization

- **Color-coded countries** - Each visited country has a unique color
- **Randomize colors** - Shuffle country colors with one click
- **51 unique colors** - Ensures no duplicate colors across visited countries
- **Persistent colors** - Colors are saved to localStorage

### 📊 Travel Progress

- **Progress bar** - Sleek, minimal progress indicator at the bottom
- **Real-time statistics** - Shows visited/total countries count
- **Animated progress** - Smooth animation when progress changes
- **195 countries** - Tracks progress against all UN member states

### 🧭 Navigation Tools

- **Compass icon** - Visual navigation indicator (bottom-left)
- **Preview box** - Interactive minimap showing current viewport
- **Click to navigate** - Click on the preview to jump to different areas

### 📱 Mobile Support

- **Responsive design** - Optimized for mobile devices
- **Auto-rotation** - Automatically rotates to landscape on mobile portrait mode
- **Touch gestures** - Full support for touch-based panning and zooming
- **Compact UI** - Smaller controls and progress bar on mobile

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: LocalStorage (browser)

## Project Structure

```
explore/
├── app/
│   ├── components/
│   │   └── map/
│   │       ├── MapContainer.tsx      # Main container component
│   │       ├── MapDisplay.tsx        # SVG map rendering
│   │       ├── MapPreview.tsx        # Minimap preview
│   │       ├── TravelProgressBar.tsx # Progress indicator
│   │       ├── Compass.tsx           # Compass icon
│   │       ├── RandomizeButton.tsx   # Color randomizer
│   │       ├── ResetZoomButton.tsx   # Zoom reset
│   │       └── ZoomControls.tsx       # Zoom in/out controls
│   ├── hooks/
│   │   ├── useMapLoader.ts           # Loads SVG map
│   │   ├── useMapZoom.ts             # Zoom functionality
│   │   ├── useMapPan.ts              # Pan/drag functionality
│   │   └── useVisitedCountries.ts   # Country data management
│   ├── constants/
│   │   └── colors.ts                 # Color palette
│   ├── data/
│   │   └── visitedCountries.ts       # Initial country data
│   ├── utils/
│   │   └── utils.tsx                 # Map coloring utilities
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main page
└── public/
    ├── world.svg                     # World map SVG
    └── compass.svg                   # Compass icon
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository or navigate to the project directory:

```bash
cd explore
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Basic Navigation

- **Zoom In/Out**: Use the zoom buttons in the bottom-right corner
- **Pan Map**: When zoomed in, click and drag to move around
- **Reset Zoom**: Click the reset button to return to default view
- **Preview Navigation**: Click on the minimap preview to jump to different areas

### Customization

- **Randomize Colors**: Click the refresh icon button to shuffle country colors
- **Progress Tracking**: View your travel progress in the bottom progress bar

### Mobile Usage

- The map automatically rotates to landscape orientation on mobile devices
- Use touch gestures to zoom and pan
- All controls are optimized for touch interaction

## Configuration

### Adding/Removing Visited Countries

Edit `app/data/visitedCountries.ts`:

```typescript
const visitedCountries = [
  { code: "ID", name: "Indonesia" },
  { code: "IN", name: "India" },
  // Add more countries...
];
```

Country codes follow ISO 3166-1 alpha-2 standard.

### Customizing Colors

Edit `app/constants/colors.ts` to modify the color palette:

```typescript
export const UNIQUE_COLOR_PALETTE = [
  "#ef4444", // red
  "#f97316", // orange
  // Add more colors...
];
```

### Adjusting Zoom Levels

Modify zoom constants in `app/hooks/useMapZoom.ts`:

```typescript
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;
```

## Data Persistence

- Visited countries and their colors are automatically saved to browser localStorage
- Data persists across page refreshes
- Storage key: `travelled-countries`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Lint Code

```bash
npm run lint
```

## License

This project is open source and available for personal and commercial use.

## Credits

- World map SVG: Custom SVG map
- Built with [Next.js](https://nextjs.org/)
- Icons by [Lucide](https://lucide.dev/)
