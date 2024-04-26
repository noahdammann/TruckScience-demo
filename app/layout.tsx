import Navbar from '@/components/Navbar'
import './globals.css'
import type { Metadata } from 'next'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
    title: 'Truck Science Demo'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className='flex flex-col h-screen bg-tsblue pt-[2px] pb-[7px] px-[12px]'>
                <Navbar />
                <ToastContainer
                    position="top-left"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                {children}
            </body>
        </html>
    )
}
