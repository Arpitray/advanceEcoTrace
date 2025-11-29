"use client"
import { useState } from 'react';
import { supabase } from '@/lib/SupabaseClient';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Leaf, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else router.push('/');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else {
        setMessage('Signup successful! Please verify your email.');
        // Optionally switch back to login after signup
        setIsLogin(true);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : '',
      },
    });
    if (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-950/60 via-zinc-950 to-black"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] animate-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-green-700 via-emerald-600 to-green-800 rounded-2xl blur opacity-15 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10">
              {/* Logo/Brand */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center border border-green-600/50">
                  <Leaf className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-2xl font-bold tracking-wider">ECOTRACE</span>
              </div>

              <h1 className="text-3xl font-bold text-white mb-2 text-center">
                {isLogin ? 'Access System' : 'Join Network'}
              </h1>
              <p className="text-sm text-gray-400 mb-8 text-center">
                {isLogin ? 'Enter credentials to continue' : 'Create your account'} • <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors">{isLogin ? 'Sign up' : 'Sign in'}</button>
              </p>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-gray-300 mb-2 block">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-white/5 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="text-sm font-medium text-gray-300 mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 bg-white/5 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                      Remember me
                    </label>
                  </div>
                </div>

                {message && (
                  <div className={`text-sm p-3 rounded-lg border ${message.includes('successful') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(5,150,105,0.3)] hover:shadow-[0_0_30px_rgba(5,150,105,0.5)] flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  {isLogin ? 'Access System' : 'Create Account'}
                </button>
              </form>

              <div className="my-8 flex items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="mx-4 text-sm text-gray-500 font-mono">OR</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full py-3 border border-white/10 rounded-lg flex items-center justify-center text-sm font-medium text-gray-300 hover:bg-white/5 transition-all duration-300"
              >
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-3" />
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
