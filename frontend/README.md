# Cosmic Watch - Frontend 🛰️

The client-side application for **Cosmic Watch**, built with **React**, **Vite**, and **Three.js**.

## 🌟 Visual Features

-   **Hyper-Realistic Earth**: Uses 4K NASA textures for day/night, specular, and cloud layers.
-   **Textured Asteroids**: Procedurally scaled and instanced asteroid meshes with real moon-rock textures.
-   **Smart Camera Rig**:
    -   **Delta Tracking**: Follows moving asteroids in the 3D space while maintaining relative user-controlled angles.
    -   **Smooth Zoom**: Linear interpolation for cinematic framing.
-   **Flight Computer HUD**:
    -   Scientific controls for simulation playback.
    -   Time dilation selectors (0.5x to 8x).
    -   Mission Clock display.

## 📂 Project Structure

```
src/
├── components/
│   ├── AsteroidCard.jsx      # UI card for list view
│   ├── AsteroidVis.jsx       # Main 3D Scene (Canvas, Lights, OrbitControls)
│   ├── Navbar.jsx            # Glassmorphism Navigation
│   └── ...
├── context/
│   ├── AuthContext.jsx       # Firebase Auth State
│   └── LanguageContext.jsx   # i18n Logic
├── pages/
│   ├── Home.jsx              # Dashboard container
│   ├── Login.jsx             # Auth screens
│   └── ...
└── App.jsx                   # Router & Layout
```

## 🎨 Styling

The UI follows a **"Deep Space Glass"** aesthetic:
-   **Backdrop Blur**: `backdrop-blur-md` used extensively.
-   **Palette**: `slate-900` (Void), `cyan-500` (Holograms), `red-500` (Hazard).
-   **Fonts**: Inter (UI) and JetBrains Mono (Data/HUD).

## 🚀 Scripts

-   `npm run dev`: Start dev server (HMR enabled).
-   `npm run build`: Production build.
-   `npm run preview`: Preview production build locally.
