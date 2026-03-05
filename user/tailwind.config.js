/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                kindred: ['kindred', 'sans-serif'],
            },
            colors: {
                brand: {
                    orange: '#FF7B00',
                    gold: '#FFD700',
                    dark: '#111111',
                    darker: '#0a0a0a',
                    light: '#F9FAFB',
                    white: '#FFFFFF'
                },
                glass: {
                    light: 'rgba(255, 255, 255, 0.7)',
                    dark: 'rgba(0, 0, 0, 0.05)',
                    border: 'rgba(0, 0, 0, 0.05)'
                }
            },
            backgroundImage: {
                'brand-gradient': 'linear-gradient(135deg, #FF7B00 0%, #FFD700 100%)',
            }
        },
    },
    plugins: [],
}
