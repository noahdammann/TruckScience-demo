"use client"

import { updateCompanyMembers } from "@/lib/actions"
import { SessionInterface } from "@/types"
import { useRouter } from "next/navigation"
import { useState } from "react"
import ReactLoading from "react-loading"
import { toast } from "react-toastify"

type Props = {
    session: SessionInterface,
    secret: string,
}

const isProduction = process.env.NODE_ENV === "production"
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : "http://localhost:3000"

const LoadingComponent = ({ session, secret }: Props) => {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    const userEmail = session?.user?.email
    const company = session?.user?.company

    if (!userEmail) {
        toast.error("You must sign in first", {
            autoClose: 4000,
            position: "top-center"
        })
        router.push("/login")
        return
    }

    const handleJoinCompany = async () => {
        try {
            setIsLoading(true)
            const inviteUrl = `${serverUrl}/invite/${secret}`
            await updateCompanyMembers(inviteUrl, userEmail)
            setTimeout(() => {
                toast.success("You have been added to an organisation!")
            }, 4000);
            router.refresh()
            router.push("/")
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (!company) {
        handleJoinCompany()
    } else {
        toast.error("You are already in an organisation")
        router.push("/")
    }

    return (
        <>
            {
                isLoading ?
                    <div className='absolute top-0 bottom-0 left-0 right-0 bg-black/60 z-10'>
                        <ReactLoading type="spin" color='white' height={200} width={120} className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-30%]' />
                    </div >
                    : <></>
            }
        </>
    )
}

export default LoadingComponent