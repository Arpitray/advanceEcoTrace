"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/SupabaseClient'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"

export default function Header() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Fetch current user session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    // Listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/Login')
  }

  const handleGalleryClick = () => {
    router.push('/Gallery')
  }

  return (
    <div className="w-full p-4 bg-[#ffd29d]">
      <div className="w-full flex justify-between items-center">
        <button onClick={() => router.push('/')} className="font-bold cursor-pointer text-lg text-green-800 hover:scale-110">
          EcoTrace
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex cursor-pointer font-semibold items-center mr-6 px-6 py-1 rounded-md bg-white/80 hover:bg-white">
            Profile
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Profile</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleGalleryClick}>Gallery</DropdownMenuItem>
            <DropdownMenuItem>{user?.email ?? 'Not signed in'}</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="mailto:rayarpit72@gmail.com?subject=Plantify%20AI%20Contact" aria-label="Contact us via email">Contact</a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
