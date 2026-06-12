/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                log: {
                    error: '#ef4444',
                    success: '#22c55e',
                    info: '#06b6d4',
                    warning: '#f97316',
                    skip: '#64748b',
                },
                bg: {
                    base: '#121212',
                    surface: '#1e1e1e',
                    hover: '#2a2a2a',
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#a0a0a0',
                },
                accent: {
                    blue: '#1a71ff',
                    hover: '#0056e0',
                },
                status: {
                    online: '#2ecc71',
                    offline: '#e74c3c',
                },
                border: {
                    DEFAULT: '#333333',
                }
            }
        },
    },
    plugins: [],
}