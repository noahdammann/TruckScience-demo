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
                'darkgreen': "#6B8F00",
                'lightgreen': "hsla(75, 100%, 28%, 0.45)",
            },
            boxShadow: {
                "modern": "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 6px 2px",
                'outline': "0px 0px 2px 2px rgba(204,204,204,0.6)",
                'outline-sm': "0px 0px 1px 1px rgba(204,204,204,0.6)",
            }
        },
    },
    plugins: [require("@tailwindcss/forms")],
}
export default config
