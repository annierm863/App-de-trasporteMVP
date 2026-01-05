import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./screens/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#f4c025",
                "primary-dark": "#dcb010",
                "background-light": "#f8f8f5",
                "background-dark": "#181611",
                "background-darker": "#12100d",
                "surface-dark": "#27241b",
                "surface-light": "#ffffff",
                "text-subtle": "#bab29c",
                "text-secondary": "#bab29c",
                "border-dark": "#544e3b",
                "input-bg": "#2A271F",
            },
            fontFamily: {
                "display": ["Plus Jakarta Sans", "Public Sans", "sans-serif"],
                "body": ["Noto Sans", "sans-serif"],
            },
        },
    },
    plugins: [
        forms,
        containerQueries,
    ],
}
