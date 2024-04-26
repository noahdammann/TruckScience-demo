import AuthProviders from '@/components/AuthProviders'
import RedirectHandler from '@/components/RedirectHandler'
import { getUser } from '@/lib/actions'
import { getCurrentUser } from '@/lib/session'
import { redirect } from 'next/dist/server/api-utils'
import React from 'react'

const Login = async () => {

    // Hi there
    const session = await getCurrentUser()

    if (session) {
        return (
            <RedirectHandler />
        )
    }

    return (
        <div className='flex flex-col gap-3 justify-center items-center w-full h-full'>
            <h3 className='text-3xl font-bold'>Please sign in first</h3>
            <AuthProviders />
        </div>
    )
}

export default Login