# Cosmic Watch 🌌🔭

**Cosmic Watch** is a real-time Near-Earth Object (NEO) tracker and visualization dashboard. It combines data from the **NASA NeoWs API** with an interactive 3D simulation to monitor asteroids, assess their risk levels, and visualize their orbits relative to Earth.

## 🚀 Key Features

-   **3D Solar System Simulation**: Interactive view of Earth and surrounding asteroids using **Three.js** and **React Three Fiber**.
-   **Real-time Risk Analysis**: Dynamic risk scoring algorithm based on asteroid size, velocity, and proximity (perihelion).
-   **Time Travel Mode**: "Flight Computer" HUD allows users to simulate future orbital positions and assess upcoming close approaches.
-   **Elliptical Orbits**: Accurate orbital mechanics visualization with eccentricities and inclinations.
-   **Global Chat**: Real-time discussion room for amateur astronomers (Socket.io).
-   **PWA Support**: Installable on mobile devices with offline capabilities.
-   **Multilingual Support**: Available in English, Hindi, and Odia.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: React (Vite)
-   **3D Engine**: @react-three/fiber, @react-three/drei
-   **Styling**: Tailwind CSS (Glassmorphism design)
-   **Icons**: Lucide React

### Backend
-   **Runtime**: Node.js & Express
-   **Database**: MongoDB (User profiles, Watchlists)
-   **Auth**: Firebase Admin SDK
-   **Real-time**: Socket.io

## 📦 Installation & Setup

### Prerequisites
-   Node.js (v18+)
-   MongoDB Instance (Local or Atlas)
-   NASA API Key
-   Firebase Service Account

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/cosmic-watch.git
cd Cosmic-Watch/Runtime_Terrors
```

### 2. Backend Setup
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# (Fill in your MONGODB_URI, NASA_API_KEY, and FIREBASE credentials)

# Start Server
npm run dev
# Server runs on http://localhost:3000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Development Server
npm run dev
# Client runs on http://localhost:5173
```

## 🧪 Documentation

-   **API Collection**: Import `postman_collection.json` into Postman to test backend endpoints.
-   **AI Development Log**: See `AI-LOG.md` for a record of AI-assisted development sessions.
