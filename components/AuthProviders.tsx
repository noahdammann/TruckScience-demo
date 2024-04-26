"use client"

import { SessionInterface } from '@/types';
import { getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import ReactLoading from "react-loading"
import { toast } from 'react-toastify';

type Provider = {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
    callbackUrl: string;
    signinUrlParams?: Record<string, string> | undefined;
};

type Providers = Record<string, Provider>;

const AuthProviders = () => {
    const [providers, setProviders] = useState<Providers | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();

            setProviders(res);
        }

        fetchProviders();
    }, []);

    const handleSignIn = async (id: string) => {
        setIsSubmitting(true)
        try {
            await signIn(id)
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
            router.refresh()
        }
    }

    if (providers) {
        return (
            <div>
                {isSubmitting ?
                    <div className='absolute top-0 bottom-0 left-0 right-0 bg-black/60 z-10'>
                        <ReactLoading type="spin" color='white' height={200} width={120} className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-30%]' />
                    </div>
                    : <></>
                }

                {Object.values(providers).map((provider: Provider, i) => (
                    <button
                        key={i}
                        onClick={() => handleSignIn(provider?.id)}
                        className='mr-2 bg-tsgreen py-2 px-5 rounded-full text-white text-lg'
                    >
                        Sign In
                    </button >
                ))}
            </div>
        )
    }
}

export default AuthProviders