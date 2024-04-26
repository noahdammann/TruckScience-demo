import './globals.css'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import Head from "next/head"
import Script from "next/script"

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    style: ['italic', 'normal']
})

export const metadata: Metadata = {
    title: 'Truck Science Demo',
    description: 'Frontend design for distributor library manager',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`flex flex-col h-screen max-h-screen overflow-hidden bg-tsblue pb-[7px] px-3 ${roboto.className}`}>
                {children}
            </body>
        </html>
    )
}
