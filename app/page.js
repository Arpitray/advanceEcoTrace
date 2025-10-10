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

  // Show HomeLoader for 4 seconds on initial load
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
      className="min-h-screen bg-[#EBE8DC] relative overflow-hidden"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dsjjdnife/image/upload/v1760114395/DeWatermark.ai_1760114365009_apcwc0.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Main container */}
      <div className="w-[85%] mx-auto px-6 py-6 lg:py-0 flex flex-col">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 ">
          
          {/* Left side - Hero text */}
          <div className="space-y-8 flex justify-center flex-col items-center">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-7xl xl:text-8xl leading-tight">
                <span className="font-light block text-gray-900">Where Nature</span>
                <span className="font-serif italic block text-gray-900">Meets Elegance</span>
              </h1>
            </div>

            
             {!previewSrc && (
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200">
                <h2 className="text-2xl font-serif italic text-gray-900 mb-4">
                  Identify any plant instantly and learn its eco-benefits!
                </h2>
                
                {/* Error Message */}
                {error && (
                  <div className="mb-4 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl">
                    <p className="text-sm font-light">{error}</p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={openUpload}
                    className="flex-1 px-6 py-4 bg-[#6B8E6B] hover:bg-[#5A7D5A] text-white rounded-2xl font-light transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Image
                  </button>

                  <button
                    onClick={openCamera}
                    className="flex-1 px-6 py-4 bg-[#8B9DAF] hover:bg-[#7A8C9E] text-white rounded-2xl font-light transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Take Photo
                  </button>
                </div>
              </div>
            )}

            {/* Preview section */}
            {previewSrc && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200">
                <div className="space-y-4">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl mb-4">
                      <p className="text-sm font-light">{error}</p>
                    </div>
                  )}
                  
                  <div className="relative rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src={previewSrc} 
                      alt={fileName || "preview"} 
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 font-light truncate flex-1">
                      {fileName}
                    </p>
                    <button
                      onClick={() => {
                        setPreviewSrc(null);
                        setFileName("");
                        setError(null);
                      }}
                      className="ml-4 px-5 py-2 bg-[#E8CAD0] hover:bg-[#DDB5BE] text-gray-900 rounded-full font-light transition-all duration-200 text-sm"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <button 
                      onClick={handleAnalyze}
                      className="w-full bg-[#6B8E6B] hover:bg-[#5A7D5A] text-white rounded-2xl py-3 font-light transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Analyze Plant
                    </button>
                  </div>
                </div>
              </div>
            )}
        
          </div>

          {/* Right side - Feature cards */}
          <div className="space-y-6 lg:pt-60">
            
            {/* Main description card */}
            <div className="bg-[#C8DDD0] rounded-3xl p-8 lg:p-10">
              <p className="text-gray-800 text-sm lg:text-xl  font-semibold t mb-8">
               <span className="font-bold">Ecotrace</span>  is your personal green companion. It helps both nature enthusiasts and those unaware of the value of surrounding plants discover the hidden importance of every leaf around them — from environmental impact to ecological and medicinal benefits.
              </p>

     

              {/* Image showcase grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#8B9DAF] rounded-2xl overflow-hidden">
                  <img 
                    src="https://res.cloudinary.com/dsjjdnife/image/upload/v1759865483/Gemini_Generated_Image_gtyxjogtyxjogtyx_khbeey.png"
                    alt="Interior design" 
                    className="w-full h-32 object-cover"
                  />
                </div>
                <div className="bg-[#C8DDD0] rounded-2xl overflow-hidden">
                  <img 
                    src="https://res.cloudinary.com/dsjjdnife/image/upload/v1759865719/Gemini_Generated_Image_vf8wpsvf8wpsvf8w_ldfj63.png"
                    alt="Plant life" 
                    className="w-full h-32 object-cover"
                  />
                </div>
              </div>

              {/* Browse button */}
           
            </div>

            {/* Upload/Camera section */}
                {/* Description card */}
            <div className="bg-[#C8DDD0] rounded-3xl p-6 lg:p-8 w-[100%] max-sm:w-[100%]">
              <p className="text-gray-800 leading-relaxed font-light">
               Discover the plants around you instantly. Snap a photo, learn their benefits, and become a nature pro in minutes!
              </p>
              <a
                href="mailto:rayarpit72@gmail.com?subject=Plantify%20AI%20Contact"
                aria-label="Contact us via email"
                className="mt-6 px-8 py-3 bg-white/80 hover:bg-white border border-gray-300 rounded-full text-gray-900 font-light transition-all duration-300 shadow-sm hover:shadow-md inline-block text-center"
              >
                Contact us
              </a>
            </div>
           
          </div>
        </div>

        {/* Bottom brand logos section */}
        <div className="mt-16 pt-8 border-t border-gray-500">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 opacity-40">
            <span className="text-black font-bold text-sm tracking-wider">Shwetha Kumari</span>
            <span className="text-black font-bold text-sm tracking-wider">Lipsa Sahu</span>
            <span className="text-black font-bold text-sm tracking-wider">Arpit Ray</span>

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
