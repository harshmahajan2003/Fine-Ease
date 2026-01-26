import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";
import { checkUser } from "@/lib/check-user";

const Header = async () => {
  await checkUser();
  return (
    <div className='flex top-0 bg-white/80 backdrop-blur-md z-50'>
      <nav className="container mx-auto px-4 flex items-center justify-between  ">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={200} height={60}
            className='h-40 w-auto object-contain '
          />

        </Link>

        <div className='flex items-center space-x-4'>
          <SignedIn>
            <Link href={"/dashboard"} className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <LayoutDashboard size={18} />
                <span className="hidden md:block">Dashboard</span>
              </Button>
            </Link>
          </SignedIn>



          <SignedIn>
            <Link href={"/transactions/create"}>
              <Button className="flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:block">Add Transactions</span>
              </Button>
            </Link>

          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }} />
          </SignedIn>
        </div>
      </nav>
    </div>
  )
}

export default Header
