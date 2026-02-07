/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                nasa: {
                    blue: '#0B3D91',
                    red: '#FC3D21',
                    white: '#FFFFFF',
                },
                space: {
                    dark: '#020617', // Very deep blue/black
                    bg: '#0f172a',   // Slate 900
                    card: 'rgba(30, 41, 59, 0.7)', // Slate 800 with opacity for glassmorphism
                    void: '#050510',
                },
                nebula: {
                    purple: '#4c1d95', // Violet 900
                    pink: '#be185d',   // Pink 700
                    glow: '#8b5cf6',   // Violet 500
                },
                risk: {
                    low: '#10b981', // Emerald 500
                    medium: '#f59e0b', // Amber 500
                    high: '#ef4444', // Red 500
                    extreme: '#7f1d1d', // Red 900
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'galactic': "radial-gradient(circle at 50% 0%, #2e1065 0%, #1e1b4b 25%, #020617 60%, #000000 100%)",
            },
            keyframes: {
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' }
                }
            },
            animation: {
                'shimmer': 'shimmer 2.5s infinite linear',
            }
        },
    },
    plugins: [],
}
