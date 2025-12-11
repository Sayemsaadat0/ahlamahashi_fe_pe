'use client'
import { useAuthStore } from '@/store/AuthStore'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Logo from '@/components/core/Logo'

const Template = ({ children }: { children: React.ReactNode }) => {
    const { token, user } = useAuthStore()
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const checkAuth = () => {
            if (!token || !user) {
                router.push('/login')
                return
            }
            setIsChecking(false)
        }

        checkAuth()
    }, [token, user, router])

if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center flex flex-col items-center">
                    <Logo />
                    <p className="mt-4 text-gray-600 text-2xl font-bold">Loading...</p>
                </div>
            </div>
        )
    }

    if (!token || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center flex flex-col items-center">
                    <Logo />
                    <p className="mt-4 text-gray-600 text-2xl font-bold">Redirecting...</p>
                </div>
            </div>
        )
    }

    return (
        <div>{children}</div>
    )
}

export default Template