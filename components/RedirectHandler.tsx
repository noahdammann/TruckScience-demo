"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import ReactLoading from "react-loading"

const RedirectHandler = () => {

    const router = useRouter();
    router.push("/")

    return (
        <div className='absolute top-0 bottom-0 left-0 right-0 bg-black/60 z-10'>
            <ReactLoading type="spin" color='white' height={200} width={120} className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-30%]' />
        </div>
    )
}

export default RedirectHandler