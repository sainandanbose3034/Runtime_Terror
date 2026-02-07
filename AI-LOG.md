# AI Assistance Log (AI-LOG.md)

This document details the usage of Large Language Models (LLMs) and AI tools in the development of **Cosmic Watch**. The goal is to transparently reporting how AI assisted the development process while ensuring the core logic and problem-solving remain the team's effort.

## Overview

AI acted as a **Architectural Consultant**, helping to structure the application, generate boilerplate code, and suggest best practices for security and scalability.

## Specific Contributions

### 1. Project Architecture & Setup
- **Contribution**: Proposed a modular MVC (Model-View-Controller) structure for backend and Component-based architecture for frontend.
- **Details**: Suggested separating concerns into `routes`, `controllers`, `services`, and `models`. Defined React context for global state.


### 2. Boilerplate Generation
- **Contribution**: Generated initial configuration files to speed up development setup.
- **Details**:
    - Backend: `Dockerfile`, `docker-compose.yml`, `index.js`, Mongoose schemas.
    - Frontend: `vite.config.js`, `tailwind.config.js`, `firebase.js`.

### 3. Core Logic Implementation
- **Contribution**: Assisted in writing complex logic for data processing and scheduling.
- **Details**:
    - **Risk Analysis**: Co-developed the risk scoring algorithm using NASA data parameters.
    - **Scheduler**: Implemented the `node-cron` job for alerts.
    - **NASA Integration**: Wrote the `axios` service wrapper.
    - **Frontend State**: Implemented `AuthContext` managing Google Login and backend synchronization.

### 4. UI/UX Design
- **Contribution**: Designed a "Professional Scientific" aesthetic with "Galactic Hints" Boilerplate.
- **Details**:
    - Configured Tailwind CSS with custom colors (`space-blue`, `nasa-red`) and glassmorphism utilities.
    - Integrated `lucide-react` for consistent iconography.

### 4. Authentication & Security
- **Contribution**: Integrated Firebase Admin SDK for secure authentication.
- **Details**:
    - Implemented the `verifyToken` middleware to protect API routes.
    - Structured the user synchronization logic between Firebase and MongoDB.

### 5. Testing & Verification
- **Contribution**: Created testing artifacts.
- **Details**:
    - Generated a **Postman Collection** (`postman_collection.json`) to facilitate API testing.
    - Wrote the **Implementation Plan** and **Walkthrough** guides.

### 6. Advanced Visualization & Simulation
- **Contribution**: Engineered the 3D physics simulation and HUD interface.
- **Details**:
    - **Orbital Mechanics**: Implemented Keplerian approximations for elliptical orbits (calculating radius from semi-major axis and eccentricity).
    - **Camera Logic**: Solved the "Frame Dragging" issue by implementing a delta-tracking camera rig that preserves user orbit controls while following a moving target.
    - **Visual Fidelity**: Applied high-resolution textures to celestial bodies and implemented dynamic lighting/shading.
    - **Scientific UI**: Designed a "Flight Computer" HUD for time travel controls, replacing standard media player inputs.

## Conclusion

The use of AI allowed the team to focus on high-level design, feature definition, and user experience, while the AI handled repetitive coding tasks and provided architectural guidance. All generated code was reviewed, tested, and integrated by the human developers.
