"use client"
import { useState } from 'react';
import { supabase } from '@/lib/SupabaseClient';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

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
    <div className="min-h-screen bg-[#F5F3F1] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8">
         

          <h1 className="text-3xl font-bold text-gray-800 mb-2">{isLogin ? 'Log in' : 'Create account'}</h1>
          <p className="text-sm text-gray-500 mb-8">
            or <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-orange-500 font-medium">{isLogin ? 'create an account' : 'back to login'}</button> if you don't have one yet
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-600">
                Username or email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div>
                <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-sm font-medium text-gray-600">
                        Password
                    </label>
                    <a href="#" className="text-xs text-orange-500 font-medium hidden">I can't remember</a>
                </div>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
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
                  className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-400"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-xs text-orange-500 font-medium hidden">I forgot the password</a>
            </div>

            {message && <p className="text-sm text-red-500">{message}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-[#F28C4A] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              {isLogin ? 'Log me in' : 'Create account'}
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-sm text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-3" />
            Log in with Google
          </button>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex w-1/2 items-center justify-center bg-[#F5F3F1]">
           <img src="https://res.cloudinary.com/dsjjdnife/image/upload/v1759952228/gardening-home-illustration-concept_23-2148539553_ii0zj7.jpg" alt="Illustration" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
