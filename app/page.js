"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "./Components/Loader";
import HomeLoader from "./Components/HomeLoader";
import { supabase } from '@/lib/SupabaseClient';
import { Upload, Camera, Scan, Leaf, Info, ArrowRight, X } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [showHomeLoader, setShowHomeLoader] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push('/')
      else router.push('/Login')
    })
  }, [router])

  // Show HomeLoader for 3 seconds on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHomeLoader(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  

  function openUpload() {
    fileInputRef.current?.click();
  }

  function openCamera() {
    cameraInputRef.current?.click();
  }

  function onFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    
    // Convert to base64 instead of blob URL to avoid ERR_FILE_NOT_FOUND
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewSrc(reader.result); // base64 data URL
    };
    reader.readAsDataURL(file);
    
    setError(null); // Clear any previous errors
  }

  async function handleAnalyze() {
    if (!fileInputRef.current?.files?.[0] && !cameraInputRef.current?.files?.[0]) {
      setError('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Get the file from whichever input was used
      const file = fileInputRef.current?.files?.[0] || cameraInputRef.current?.files?.[0];
      
      // Create FormData to send the image
      const formData = new FormData();
      formData.append('image', file);

      // Call the identify API
      const response = await fetch('/api/identify', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to identify plant');
      }

      // Navigate to results page with the plant data
      // Store data in sessionStorage instead of URL to avoid HTTP 431 error (URL too long)
      const payload = { ...data, uploadedImage: previewSrc || null };
      
      // Generate a unique key for this analysis session
      const sessionKey = `plantData_${Date.now()}`;
      sessionStorage.setItem(sessionKey, JSON.stringify(payload));
      
      // Pass only the key in the URL
      router.push(`/results?key=${sessionKey}`);

    } catch (error) {
      console.error('Error analyzing plant:', error);
      setError(error.message || 'Failed to analyze the image. Please try again.');
      setIsAnalyzing(false);
    }
  }

  // Show HomeLoader on initial page load
  if (showHomeLoader) {
    return <HomeLoader />;
  }

  // Show Loader when analyzing
  if (isAnalyzing) {
    return <Loader />;
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-black text-white selection:bg-green-700/30">
      {/* Futuristic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-800/10 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col pt-20">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Text & Scanner */}
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-green-400 text-xs font-mono tracking-widest uppercase">
                  <span className="w-2 h-2 rounded-full bg-green-600 animate-ping"></span>
                  Advanced Botanical Analysis
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                  Nature <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400">Decoded.</span>
                </h1>
                <p className="text-lg text-gray-400 max-w-xl leading-relaxed border-l-2 border-green-600/30 pl-6">
                  Identify flora instantly using our advanced neural network. 
                  Unlock ecological data, medicinal properties, and environmental impact metrics.
                </p>
              </div>

              {/* Scanner Interface */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-green-700 via-emerald-600 to-green-800 rounded-2xl blur opacity-15 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 lg:p-12 overflow-hidden">
                  {/* Decorative Scanner Lines */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-600/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-600/40 to-transparent"></div>

                  {!previewSrc ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                          <Scan className="w-5 h-5 text-green-400" />
                          Input Source
                        </h3>
                        {error && (
                          <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                            {error}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={openUpload}
                          className="group/btn relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-600/50 transition-all duration-300"
                        >
                          <div className="w-12 h-12 rounded-full bg-green-700/10 flex items-center justify-center group-hover/btn:scale-110 transition-transform duration-300">
                            <Upload className="w-6 h-6 text-green-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-300 group-hover/btn:text-white">Upload Image</span>
                        </button>

                        <button
                          onClick={openCamera}
                          className="group/btn relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 transition-all duration-300"
                        >
                          <div className="w-12 h-12 rounded-full bg-emerald-700/10 flex items-center justify-center group-hover/btn:scale-110 transition-transform duration-300">
                            <Camera className="w-6 h-6 text-emerald-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-300 group-hover/btn:text-white">Capture Subject</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-mono text-green-400 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                          IMAGE_LOADED
                        </h3>
                        <button
                          onClick={() => {
                            setPreviewSrc(null);
                            setFileName("");
                            setError(null);
                          }}
                          className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-400 hover:text-white" />
                        </button>
                      </div>

                      <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black/50 aspect-video group/preview">
                        <img 
                          src={previewSrc} 
                          alt="Preview" 
                          className="w-full h-full object-contain"
                        />
                        {/* Scanning Overlay Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-green-600/10 to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.5)] translate-y-[-100%] group-hover/preview:translate-y-[400%] transition-transform duration-[2s] ease-in-out pointer-events-none"></div>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="text-xs font-mono text-gray-500 truncate max-w-[200px]">
                          {fileName}
                        </div>
                        <button 
                          onClick={handleAnalyze}
                          className="flex-1 bg-green-700 hover:bg-green-600 text-white rounded-lg py-3 px-6 font-medium transition-all duration-300 shadow-[0_0_20px_rgba(22,101,52,0.3)] hover:shadow-[0_0_30px_rgba(22,101,52,0.5)] flex items-center justify-center gap-2"
                        >
                          <Scan className="w-4 h-4" />
                          <span>Initiate Analysis</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Data Visualization / Features */}
            <div className="lg:col-span-5 space-y-6">
              {/* Info Card */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl">
                    <Info className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Eco-Intelligence</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Our database processes thousands of botanical markers to provide accurate identification and ecological significance data in milliseconds.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Showcase */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                  <img 
                    src="https://res.cloudinary.com/dsjjdnife/image/upload/v1759865483/Gemini_Generated_Image_gtyxjogtyxjogtyx_khbeey.png"
                    alt="Sample 1" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <span className="text-xs font-mono text-green-400">SAMPLE_01</span>
                  </div>
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                  <img 
                    src="https://res.cloudinary.com/dsjjdnife/image/upload/v1759865719/Gemini_Generated_Image_vf8wpsvf8wpsvf8w_ldfj63.png"
                    alt="Sample 2" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <span className="text-xs font-mono text-emerald-400">SAMPLE_02</span>
                  </div>
                </div>
              </div>

              {/* Contact / Action */}
              <div className="bg-gradient-to-r from-green-950/50 to-emerald-950/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all">
                <div>
                  <h4 className="text-white font-medium">Join the Network</h4>
                  <p className="text-xs text-gray-400 mt-1">Contribute to the global database</p>
                </div>
                <a href="mailto:rayarpit72@gmail.com" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <ArrowRight className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-gray-500 font-mono">
              © 2025 ECOTRACE SYSTEMS. ALL RIGHTS RESERVED.
            </div>
            <div className="flex gap-6 text-xs font-mono text-gray-400">
              <span className="hover:text-green-400 cursor-pointer transition-colors">SHWETHA</span>
              <span className="hover:text-green-400 cursor-pointer transition-colors">LIPSA</span>
              <span className="hover:text-green-400 cursor-pointer transition-colors">ARPIT</span>
            </div>
          </div>
        </footer>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFileChange}
        className="hidden"
      />
    </main>
  );
}

