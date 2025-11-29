"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/SupabaseClient'
import { useRouter } from 'next/navigation'
import { User, LogOut, Leaf } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/Login')
      } else {
        setUser(data.session.user)
      }
    })

    // Listen for logout/login changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/Login')
      else setUser(session.user)
    })

    return () => listener.subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/Login')
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-950/60 via-zinc-950 to-black"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-800/10 rounded-full blur-[128px] animate-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen pt-20 flex flex-col items-center justify-center p-6">
        {user ? (
          <div className="w-full max-w-2xl">
            {/* User Card */}
            <div className="relative group mb-8">
              <div className="absolute -inset-1 bg-gradient-to-br from-green-700 via-emerald-600 to-green-800 rounded-2xl blur opacity-15 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-600 via-emerald-500 to-lime-500 flex items-center justify-center">
                    <User className="w-10 h-10 text-black" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">System Access Granted</h2>
                    <p className="text-gray-400 font-mono text-sm">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1 font-mono uppercase">User ID</p>
                    <p className="text-sm text-gray-300 font-mono truncate">{user.id}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1 font-mono uppercase">Account Status</p>
                    <p className="text-sm text-emerald-400 font-semibold">Active</p>
                  </div>
                </div>

                <button 
                  onClick={handleLogout} 
                  className="w-full py-3 bg-red-600/80 hover:bg-red-500 backdrop-blur-sm text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 border border-red-500/20 hover:border-red-500/50"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => router.push('/')}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-600/50 rounded-xl p-6 transition-all duration-300 text-left group"
              >
                <Leaf className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-lg font-semibold mb-1 group-hover:text-green-400 transition-colors">Identify Plant</h3>
                <p className="text-sm text-gray-400">Scan a new specimen</p>
              </button>
              <button 
                onClick={() => router.push('/Gallery')}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-600/50 rounded-xl p-6 transition-all duration-300 text-left group"
              >
                <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center mb-3">
                  <span className="text-emerald-400 text-xl">📁</span>
                </div>
                <h3 className="text-lg font-semibold mb-1 group-hover:text-emerald-400 transition-colors">View Gallery</h3>
                <p className="text-sm text-gray-400">Browse your collection</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-mono">Authenticating...</p>
          </div>
        )}
      </div>
    </div>
  )
}
