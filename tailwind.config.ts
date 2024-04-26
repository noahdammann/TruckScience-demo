import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'tsblue': '#F6F7FB',
                'tsgreen': '#85b200',
                'darktsgreen': "#6B8F00",
            },
            boxShadow: {
                'dropdown': '1px 2px 10px 1px rgba(0, 0, 0, 0.3)',
                "modern": "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 6px 2px",
                "menu": "0px 0px 2px 1.5px rgba(0, 0, 0, 0.2);"
            },
            gridTemplateColumns: {
                '2/3': '2fr 1fr'
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
export default config
