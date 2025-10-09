"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { savePlantResult } from "@/lib/plantStorage";
import { supabase } from '@/lib/SupabaseClient';
import { uploadPlantImage, dataURLtoFile } from '@/lib/imageStorage';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plantData, setPlantData] = useState(null);
  const [perenualData, setPerenualData] = useState(null);
  const [loadingPerenual, setLoadingPerenual] = useState(false);

  useEffect(() => {
    // Get the session key from URL query params (to retrieve data from sessionStorage)
    const sessionKey = searchParams.get('key');
    
    if (sessionKey) {
      // Retrieve data from sessionStorage instead of URL to avoid HTTP 431 error
      const storedData = sessionStorage.getItem(sessionKey);
      
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          
          if (parsed) {
            setPlantData(parsed);
            // Save to DB only for authenticated users
            (async () => {
              try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                  // Upload image to Supabase Storage if it's a data URL
                  let imageUrl = parsed.uploadedImage;
                  if (imageUrl && imageUrl.startsWith('data:')) {
                    try {
                      const file = dataURLtoFile(imageUrl, `plant-${Date.now()}.jpg`);
                      const uploadResult = await uploadPlantImage(file, user.id);
                      if (uploadResult) {
                        imageUrl = uploadResult; // uploadPlantImage returns URL string directly
                        console.log('Image uploaded to Storage:', imageUrl);
                      }
                    } catch (uploadErr) {
                      console.error('Failed to upload image to Storage:', uploadErr);
                      // Continue with data URL as fallback
                    }
                  }
                  
                  // Save plant result with image URL
                  const plantDataToSave = { ...parsed, uploadedImage: imageUrl };
                  await savePlantResult(plantDataToSave, user.id);
                  
                  // Clean up sessionStorage after successful save
                  sessionStorage.removeItem(sessionKey);
                }
              } catch (err) {
                console.warn('Failed to save plant result for user:', err);
              }
            })();
          } else {
            console.error('Failed to parse plant data from sessionStorage');
            router.push('/');
          }
        } catch (parseErr) {
          console.error('Error parsing sessionStorage data:', parseErr);
          router.push('/');
        }
      } else {
        console.error('No data found in sessionStorage for key:', sessionKey);
        router.push('/');
      }
    } else {
      // If no session key, redirect to home
      console.error('No session key found in URL');
      router.push('/');
    }
  }, [searchParams, router]);

  // Fetch Perenual details once we have the identified plant's scientific name
  useEffect(() => {
    if (!plantData || !plantData.scientificName) return;

    let mounted = true;
    async function fetchPerenual() {
      setLoadingPerenual(true);
      try {
        const altName = plantData.genus ? `${plantData.genus} ${plantData.scientificName.split(' ').slice(1).join(' ')}` : '';
        const commonName = (plantData.commonNames && plantData.commonNames.length > 0) ? plantData.commonNames[0] : '';
        const url = `/api/perenual?q=${encodeURIComponent(plantData.scientificName)}${altName ? `&alt=${encodeURIComponent(altName)}` : ''}${commonName ? `&common=${encodeURIComponent(commonName)}` : ''}`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('Failed to fetch perenual data');
        const json = await resp.json();
        if (!mounted) return;
        setPerenualData(json);
      } catch (err) {
        console.error('Error fetching Perenual data:', err);
        if (mounted) setPerenualData({ source: 'error', note: 'Failed to load external details' });
      } finally {
        if (mounted) setLoadingPerenual(false);
      }
    }

    fetchPerenual();

    return () => { mounted = false; };
  }, [plantData]);

  if (!plantData) {
    return (
      <div className="min-h-screen bg-[#EBE8DC] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#6B8E6B] mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const primaryCommonName = plantData.commonNames && plantData.commonNames.length > 0
    ? plantData.commonNames[0]
    : null;

  return (
    <main className="min-h-screen bg-[#EBE8DC] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-light">Back to Home</span>
        </button>

  {/* Header Card */}
  <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl mb-8">
          {/* Success Badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Identified with {plantData.score}% confidence
            </div>
          </div>

          {/* Plant Name + Uploaded Image to the right */}
          <div className="mb-6">
            <div className="pr-6">
              {primaryCommonName && (
                <h1 className="text-5xl lg:text-6xl font-serif italic text-gray-900 mb-3">
                  {primaryCommonName}
                </h1>
              )}
              <h2 className="text-2xl lg:text-3xl font-light text-gray-700 mb-2">
                {plantData.scientificName}
              </h2>
              <div className="flex flex-wrap gap-2 mt-4">
                {plantData.family && (
                  <span className="bg-[#C8DDD0] px-4 py-2 rounded-full text-sm text-gray-800">
                    Family: {plantData.family}
                  </span>
                )}
                {plantData.genus && (
                  <span className="bg-[#E8DDD0] px-4 py-2 rounded-full text-sm text-gray-800">
                    Genus: {plantData.genus}
                  </span>
                )}
              </div>
            </div>

            {/* Uploaded image: show inline on small screens, absolute-right and vertically centered on md+ */}
            {plantData.uploadedImage && (
              <>
                {/* Mobile / small screens: inline below name */}
                <div className="block md:hidden mt-4">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 flex items-center justify-center mx-auto">
                    <img src={plantData.uploadedImage} alt="Uploaded for identification" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                </div>

                {/* Desktop: absolute positioned at the right extreme of the header card, vertically centered */}
                <div className="hidden md:block absolute right-6 top-1/2 transform -translate-y-1/2">
                  <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                    <img src={plantData.uploadedImage} alt="Uploaded for identification" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Common Names */}
          {(() => {
            const commonNamesRaw = plantData.commonNames || [];
            const commonNames = Array.isArray(commonNamesRaw)
              ? commonNamesRaw
              : (typeof commonNamesRaw === 'string' ? commonNamesRaw.split(',').map(s => s.trim()).filter(Boolean) : []);

            if (commonNames.length > 1) {
              return (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Also known as:</h3>
                  <div className="flex flex-wrap gap-2">
                    {commonNames.slice(1).map((name, idx) => (
                      <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>

        {/* Images Grid */}
        {plantData.images && plantData.images.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8">
            <h3 className="text-2xl font-serif italic text-gray-900 mb-6">Reference Images</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plantData.images.slice(0, 6).map((image, idx) => (
                <div key={idx} className="relative group">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-[#C8DDD0]">
                    <img
                      src={image.url}
                      alt={`${plantData.scientificName} - ${image.organ || 'plant'}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23C8DDD0' width='400' height='400'/%3E%3Ctext x='200' y='200' font-size='100' text-anchor='middle' fill='%23fff'%3E🌿%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  {image.organ && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-lg text-xs">
                      {image.organ}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Eco Fact Card */}
        <div className="bg-gradient-to-br from-[#6B8E6B] to-[#5A7D5A] rounded-3xl p-8 shadow-xl mb-8 text-white">
          <div className="flex items-start gap-4">
            <div className="text-5xl">🌍</div>
            <div className="flex-1">
              <h3 className="text-2xl font-serif italic mb-3">Environmental Fact</h3>
              <p className="text-lg font-light leading-relaxed">
                {plantData.ecoFact}
              </p>
            </div>
          </div>
        </div>

        {/* Care & Details (Perenual/local) */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8">
          <h3 className="text-2xl font-serif italic text-gray-900 mb-4">Care & Details</h3>
          {loadingPerenual ? (
            <p className="text-gray-600">Loading care details...</p>
          ) : perenualData ? (
            <div className="space-y-4 text-gray-800">
              {/* Basic Info Section */}
              {(perenualData.data?.cycle || perenualData.data?.type || perenualData.data?.origin) && (
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-semibold text-lg mb-2">Basic Information</h4>
                  {perenualData.data?.cycle && <p><strong>Life Cycle:</strong> {perenualData.data.cycle}</p>}
                  {perenualData.data?.type && <p><strong>Type:</strong> {perenualData.data.type}</p>}
                  {perenualData.data?.origin && <p><strong>Origin:</strong> {perenualData.data.origin}</p>}
                  {perenualData.data?.dimension && <p><strong>Size:</strong> {perenualData.data.dimension}</p>}
                  {perenualData.data?.family && <p><strong>Family:</strong> {perenualData.data.family}</p>}
                </div>
              )}

              {/* Care Requirements Section */}
              {(perenualData.data?.watering || perenualData.data?.sunlight || perenualData.data?.care_level || perenualData.data?.maintenance) && (
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-semibold text-lg mb-2">Care Requirements</h4>
                  {perenualData.data?.care_level && <p><strong>Care Level:</strong> {perenualData.data.care_level}</p>}
                  {perenualData.data?.watering && <p><strong>Watering:</strong> {perenualData.data.watering}</p>}
                  {perenualData.data?.sunlight && <p><strong>Sunlight:</strong> {perenualData.data.sunlight}</p>}
                  {perenualData.data?.maintenance && <p><strong>Maintenance:</strong> {perenualData.data.maintenance}</p>}
                  {perenualData.data?.growthRate && <p><strong>Growth Rate:</strong> {perenualData.data.growthRate}</p>}
                </div>
              )}

              {/* Growing Conditions */}
              {(perenualData.data?.indoor || perenualData.data?.hardiness || perenualData.data?.propagation) && (
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-semibold text-lg mb-2">Growing Conditions</h4>
                  {perenualData.data?.indoor && <p><strong>Indoor/Outdoor:</strong> {perenualData.data.indoor}</p>}
                  {perenualData.data?.hardiness && <p><strong>Hardiness Zones:</strong> {perenualData.data.hardiness}</p>}
                  {perenualData.data?.propagation && <p><strong>Propagation:</strong> {perenualData.data.propagation}</p>}
                  {perenualData.data?.drought_tolerant && <p><strong>Drought Tolerant:</strong> {perenualData.data.drought_tolerant}</p>}
                  {perenualData.data?.salt_tolerant && <p><strong>Salt Tolerant:</strong> {perenualData.data.salt_tolerant}</p>}
                </div>
              )}

              {/* Flowering & Fruiting */}
              {(perenualData.data?.flowers || perenualData.data?.fruits || perenualData.data?.flowering_season) && (
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-semibold text-lg mb-2">Flowering & Fruiting</h4>
                  {perenualData.data?.flowers && <p><strong>Produces Flowers:</strong> {perenualData.data.flowers}</p>}
                  {perenualData.data?.flowering_season && <p><strong>Flowering Season:</strong> {perenualData.data.flowering_season}</p>}
                  {perenualData.data?.fruits && <p><strong>Produces Fruits:</strong> {perenualData.data.fruits}</p>}
                  {perenualData.data?.fruit_color && <p><strong>Fruit Color:</strong> {perenualData.data.fruit_color}</p>}
                </div>
              )}

              {/* Safety & Characteristics */}
              {(perenualData.data?.poisonous_to_humans || perenualData.data?.poisonous_to_pets || perenualData.data?.toxicity || perenualData.data?.thorny || perenualData.data?.invasive) && (
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-semibold text-lg mb-2">Safety & Characteristics</h4>
                  {perenualData.data?.toxicity && <p><strong>Toxicity:</strong> {perenualData.data.toxicity}</p>}
                  {perenualData.data?.poisonous_to_humans && <p><strong>Poisonous to Humans:</strong> {perenualData.data.poisonous_to_humans}</p>}
                  {perenualData.data?.poisonous_to_pets && <p><strong>Poisonous to Pets:</strong> {perenualData.data.poisonous_to_pets}</p>}
                  {perenualData.data?.thorny && <p><strong>Thorny:</strong> {perenualData.data.thorny}</p>}
                  {perenualData.data?.invasive && <p><strong>Invasive:</strong> {perenualData.data.invasive}</p>}
                  {perenualData.data?.tropical && <p><strong>Tropical:</strong> {perenualData.data.tropical}</p>}
                </div>
              )}

              {/* Uses & Benefits */}
              {(perenualData.data?.edibility || perenualData.data?.medicinal || perenualData.data?.cuisine || perenualData.data?.usage || perenualData.data?.airPurifying) && (
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-semibold text-lg mb-2">Uses & Benefits</h4>
                  {perenualData.data?.usage && <p><strong>Usage:</strong> {perenualData.data.usage}</p>}
                  {perenualData.data?.edibility && <p><strong>Edibility:</strong> {perenualData.data.edibility}</p>}
                  {perenualData.data?.medicinal && <p><strong>Medicinal Use:</strong> {perenualData.data.medicinal}</p>}
                  {perenualData.data?.cuisine && <p><strong>Culinary Use:</strong> {perenualData.data.cuisine}</p>}
                  {perenualData.data?.airPurifying && (
                    <p><strong>Air Purification:</strong> {perenualData.data.airPurifying === null ? 'Unknown' : (typeof perenualData.data.airPurifying === 'boolean' ? (perenualData.data.airPurifying ? 'Yes' : 'No') : perenualData.data.airPurifying)}</p>
                  )}
                </div>
              )}

              {/* Fallback/local-specific fields */}
              {perenualData.data?.foundIn && (
                <div className="border-b border-gray-200 pb-3">
                  <p><strong>Found in:</strong> {perenualData.data.foundIn}</p>
                </div>
              )}

              {/* Description */}
              {perenualData.data?.description && (
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-semibold text-lg mb-2">Description</h4>
                  <p className="text-sm leading-relaxed">{perenualData.data.description}</p>
                </div>
              )}

              {/* Images handling */}
              {perenualData.data?.thumbnail && (
                <div className="mb-3">
                  <img src={perenualData.data.thumbnail} alt={`${plantData.scientificName} thumbnail`} className="w-32 h-32 object-cover rounded-lg shadow-md" />
                </div>
              )}
              {/* Local DB single image */}
              {perenualData.data?.image && !perenualData.data?.thumbnail && (
                <div className="mb-3">
                  <img src={perenualData.data.image} alt={`${plantData.scientificName}`} className="w-32 h-32 object-cover rounded-lg shadow-md" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
              {perenualData.data?.images && perenualData.data.images.length > 0 && perenualData.data.images[0]?.url && (
                <div>
                  <strong>Additional Images:</strong>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {perenualData.data.images.slice(0,4).map((img, idx) => (
                      <img key={idx} src={img.url} alt={`${plantData.scientificName}-extra-${idx}`} className="w-full h-24 object-cover rounded-lg" onError={(e) => { e.target.style.display = 'none'; }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Source and note */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                {perenualData.source && (
                  <p className="text-sm text-gray-500">
                    <strong>Source:</strong> {perenualData.source}
                  </p>
                )}
                {perenualData.note && (
                  <p className="text-sm text-gray-500 mt-1">{perenualData.note}</p>
                )}
              </div>

              {/* Debug: if no useful fields present, show the raw data object to assist debugging */}
              {(!perenualData.data || Object.keys(perenualData.data).filter(k => perenualData.data[k] !== null && perenualData.data[k] !== undefined).length === 0) && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">No mapped fields available. Raw response:</p>
                  <pre className="p-3 bg-gray-100 rounded text-xs text-gray-700 overflow-auto max-h-64">{JSON.stringify(perenualData, null, 2)}</pre>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">No additional care details available.</p>
          )}
        </div>

        {/* Alternative Matches */}
        {plantData.alternativeMatches && plantData.alternativeMatches.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-serif italic text-gray-900 mb-6">
              Other Possible Matches
            </h3>
            <div className="space-y-4">
              {plantData.alternativeMatches.map((match, idx) => (
                  <div
                    key={idx}
                    role="button"
                    onClick={() => {
                      try {
                        const payload = {
                          scientificName: match.scientificName,
                          commonNames: match.commonNames || [],
                          family: plantData.family || null,
                          genus: plantData.genus || null,
                          score: match.score || 0,
                          images: [],
                          ecoFact: plantData.ecoFact || null,
                          alternativeMatches: plantData.alternativeMatches || [],
                          // preserve uploaded image so header shows the same photo
                          uploadedImage: plantData.uploadedImage || null,
                        };

                        // encode similar to the main page: base64 then encodeURIComponent
                        let encoded;
                        try {
                          const b64 = (typeof window !== 'undefined' && window.btoa) ? window.btoa(JSON.stringify(payload)) : Buffer.from(JSON.stringify(payload)).toString('base64');
                          encoded = encodeURIComponent(b64);
                        } catch (e) {
                          encoded = encodeURIComponent(JSON.stringify(payload));
                        }

                        router.push(`/results?data=${encoded}`);
                      } catch (e) {
                        console.error('Failed to open alternative match', e);
                      }
                    }}
                    className="cursor-pointer flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{match.scientificName}</p>
                      {match.commonNames && match.commonNames.length > 0 && (
                        <p className="text-sm text-gray-600">{match.commonNames[0]}</p>
                      )}
                    </div>
                    <div className="bg-[#6B8E6B] text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {match.score}% match
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex-1 px-8 py-4 bg-[#6B8E6B] hover:bg-[#5A7D5A] text-white rounded-2xl font-light transition-all duration-300 shadow-md hover:shadow-lg text-center"
          >
            Identify Another Plant
          </button>
          <button
            onClick={() => router.push('/browse')}
            className="flex-1 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 rounded-2xl font-light transition-all duration-300 shadow-md hover:shadow-lg text-center"
          >
            Browse More Plants
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#EBE8DC] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#6B8E6B] mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
