"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/SupabaseClient'
import { useRouter, usePathname } from 'next/navigation'
import { Leaf, User, LogOut, Image as ImageIcon } from 'lucide-react'
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
  const pathname = usePathname()
  const isHome = pathname === '/'

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
    <div className={`w-full p-4 transition-all duration-300 z-50 ${
      isHome 
        ? 'fixed top-0 left-0 bg-transparent backdrop-blur-sm border-b border-white/5' 
        : 'sticky top-0 bg-black/90 backdrop-blur-md border-b border-white/10 text-white'
    }`}>
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <button 
          onClick={() => router.push('/')} 
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center border border-green-600/50 group-hover:bg-green-600/30 transition-colors">
            <Leaf className="w-5 h-5 text-green-400" />
          </div>
          <span className={`font-bold text-xl tracking-wider ${isHome ? 'text-white' : 'text-white'}`}>
            ECOTRACE
          </span>
        </button>

        <div className="flex items-center gap-4">
          {isHome && (
             <div className="hidden sm:block text-xs font-mono text-green-500/70 border border-green-600/20 px-3 py-1 rounded-full">
               SYSTEM ONLINE
             </div>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 outline-none ${
              isHome 
                ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
            }`}>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-600 via-emerald-500 to-lime-500 flex items-center justify-center">
                <span className="text-[10px] font-bold text-black">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-sm font-medium hidden sm:block">Profile</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl w-56">
              <DropdownMenuLabel className="text-gray-400 text-xs uppercase tracking-wider">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={handleGalleryClick} className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white">
                <ImageIcon className="mr-2 h-4 w-4 text-emerald-400" />
                <span>Gallery</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs text-gray-500 cursor-default">
                {user?.email ?? 'Not signed in'}
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white">
                <a href="mailto:rayarpit72@gmail.com?subject=Plantify%20AI%20Contact" aria-label="Contact us via email">Contact Support</a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-red-500/20 focus:bg-red-500/20 text-red-400 focus:text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
