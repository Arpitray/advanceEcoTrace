"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "./Components/Loader";
import HomeLoader from "./Components/HomeLoader";
import { supabase } from '@/lib/SupabaseClient'

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
    <main
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dsjjdnife/image/upload/v1760114395/DeWatermark.ai_1760114365009_apcwc0.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10"></div>

      {/* Main container */}
      <div className="relative z-10 min-h-screen flex items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left side - Hero section */}
            <div className="space-y-8">
              {/* Hero heading */}
              <div className="space-y-2 animate-fade-in">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-tight tracking-tight">
                  <span className="block text-gray-900 font-light">Where Nature</span>
                  <span className="block text-gray-900 font-serif italic mt-2">Meets Elegance</span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-xl sm:text-3xl text-gray-700 font-semibold italic max-w-xl leading-relaxed">
                Identify any plant instantly and learn its eco-benefits!
              </p>

              {/* Action buttons - Only show when no preview */}
              {!previewSrc && (
                <div className="bg-white/75 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/50 transform hover:scale-[1.02] transition-transform duration-300">
                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-800 px-4 py-3 rounded-xl">
                      <p className="text-sm">{error}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={openUpload}
                      className="flex-1 group px-6 py-4 bg-[#6B8E6B] hover:bg-[#5A7D5A] text-white rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span>Upload Image</span>
                    </button>

                    <button
                      onClick={openCamera}
                      className="flex-1 group px-6 py-4 bg-[#8B9DAF] hover:bg-[#7A8C9E] text-white rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Take Photo</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Preview section */}
              {previewSrc && (
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/50">
                  <div className="space-y-4">
                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-800 px-4 py-3 rounded-xl">
                        <p className="text-sm">{error}</p>
                      </div>
                    )}
                    
                    <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                      <img 
                        src={previewSrc} 
                        alt={fileName || "preview"} 
                        className="w-full h-auto max-h-[400px] object-cover"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm text-gray-700 font-medium truncate flex-1">
                        {fileName}
                      </p>
                      <button
                        onClick={() => {
                          setPreviewSrc(null);
                          setFileName("");
                          setError(null);
                        }}
                        className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full font-medium transition-all duration-200 text-sm hover:scale-105"
                      >
                        Clear
                      </button>
                    </div>
                    
                    <button 
                      onClick={handleAnalyze}
                      className="w-full bg-[#6B8E6B] hover:bg-[#5A7D5A] text-white rounded-2xl py-4 font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      Analyze Plant
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right side - Feature cards */}
            <div className="space-y-6">
              
              {/* Main description card */}
              <div className="bg-white/75 backdrop-blur-lg rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/50 transform hover:scale-[1.02] transition-transform duration-300">
                <div className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                    <span className="text-[#6B8E6B]">Ecotrace</span> - Your Personal Green Companion
                  </h2>
                  
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                    It helps both nature enthusiasts and those unaware of the value of surrounding plants discover the hidden importance of every leaf around them — from environmental impact to ecological and medicinal benefits.
                  </p>

                  {/* Image showcase grid */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <img 
                        src="https://res.cloudinary.com/dsjjdnife/image/upload/v1759865483/Gemini_Generated_Image_gtyxjogtyxjogtyx_khbeey.png"
                        alt="Plant collection" 
                        className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <img 
                        src="https://res.cloudinary.com/dsjjdnife/image/upload/v1759865719/Gemini_Generated_Image_vf8wpsvf8wpsvf8w_ldfj63.png"
                        alt="Nature beauty" 
                        className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to action card */}
              <div className="bg-[#6B8E6B]/90 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/30 transform hover:scale-[1.02] transition-transform duration-300">
                <p className="text-white text-base sm:text-lg leading-relaxed mb-6">
                  Discover the plants around you instantly. Snap a photo, learn their benefits, and become a nature pro in minutes!
                </p>
                <a
                  href="mailto:rayarpit72@gmail.com?subject=Ecotrace%20Contact"
                  className="inline-block px-8 py-3 bg-white hover:bg-gray-50 text-[#6B8E6B] rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>

          {/* Footer - Team credits */}
          <div className="mt-16 pt-8 border-t border-white/30 backdrop-blur-sm rounded-full">
            <div className="flex flex-wrap items-center justify-center pb-12  gap-6 sm:gap-8 lg:gap-12 rounded-full">
              <span className="text-gray-800 font-semibold text-sm tracking-wide hover:text-[#6B8E6B] transition-colors">Shwetha Kumari</span>
              <span className="text-gray-800 font-semibold text-sm tracking-wide hover:text-[#6B8E6B] transition-colors">Lipsa Sahu</span>
              <span className="text-gray-800 font-semibold text-sm tracking-wide hover:text-[#6B8E6B] transition-colors">Arpit Ray</span>
            </div>
          </div>
        </div>
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
