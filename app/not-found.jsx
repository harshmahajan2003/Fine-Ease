import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const dynamic = "force-dynamic";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[100vh] px-4 text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
            <p className="text-gray-500 mb-6">The page you are looking for does not exist.</p>
            <Link href="/">
                <Button>Back to Home</Button>
            </Link>
        </div>
    )
}

export default NotFound