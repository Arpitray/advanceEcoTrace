"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BrowsePage() {
  const router = useRouter();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPlants();
  }, [page, searchTerm]);

  async function fetchPlants() {
    setLoading(true);
    setError(null);
    
    try {
      const url = searchTerm
        ? `/api/browse?q=${encodeURIComponent(searchTerm)}&page=${page}&limit=15`
        : `/api/browse?page=${page}&limit=15`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch plants');
      }

      setPlants(data.plants || []);
    } catch (err) {
      console.error('Error fetching plants:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchPlants();
  }

  function handlePlantClick(plant) {
    const plantDetail = {
      scientificName: plant.scientificName,
      commonNames: plant.commonName ? [plant.commonName] : [],
      family: plant.family || 'Unknown',
      genus: plant.genus || 'Unknown',
      score: 95,
      images: plant.imageUrl ? [{ url: plant.imageUrl, organ: 'whole plant' }] : [],
      ecoFact: "Plants are essential for life on Earth, providing oxygen, food, and habitat for countless species.",
      alternativeMatches: []
    };
    // Store plant detail in sessionStorage and navigate with a small key
    try {
      const sessionKey = `plantData_${Date.now()}`;
      sessionStorage.setItem(sessionKey, JSON.stringify(plantDetail));
      router.push(`/results?key=${sessionKey}`);
    } catch (e) {
      console.error('Failed to open plant detail via sessionStorage', e);
    }
  }

  return (
    <main className="min-h-screen bg-[#EBE8DC] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-light">Back to Home</span>
          </button>
          <h1 className="text-5xl font-serif italic text-gray-900 mb-4">Browse Plants</h1>
          <p className="text-xl text-gray-700 font-light">Explore our collection of plant species from around the world</p>
        </div>
        <form onSubmit={handleSearch} className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex gap-4">
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for plants..." className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500" />
            <button type="submit" className="px-8 py-3 bg-[#6B8E6B] hover:bg-[#5A7D5A] text-white rounded-xl font-light transition-all duration-300 shadow-md hover:shadow-lg">Search</button>
          </div>
        </form>
        {loading && (<div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#6B8E6B]"></div><p className="mt-4 text-gray-600">Loading plants...</p></div>)}
        {error && (<div className="bg-red-100 border border-red-300 text-red-800 px-6 py-4 rounded-xl mb-8"><p className="font-light">{error}</p></div>)}
        {!loading && !error && (<>
        {plants.length === 0 ? (<div className="text-center py-12 bg-white/60 rounded-2xl"><span className="text-6xl mb-4 block"></span><p className="text-xl text-gray-600">No plants found</p></div>) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plants.map((plant) => (<button key={plant.id} onClick={() => handlePlantClick(plant)} className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-left cursor-pointer">
              <div className="aspect-square bg-[#C8DDD0] relative overflow-hidden">{plant.imageUrl ? (<img src={plant.imageUrl} alt={plant.commonName || plant.scientificName} className="w-full h-full object-cover" onError={(e) => {e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23C8DDD0' width='400' height='400'/%3E%3Ctext x='200' y='200' font-size='100' text-anchor='middle' fill='%23fff'%3E%3C/text%3E%3C/svg%3E";}} />) : (<div className="w-full h-full flex items-center justify-center text-6xl"></div>)}</div>
              <div className="p-4">{plant.commonName && (<h3 className="text-lg font-semibold text-gray-900 mb-1">{plant.commonName}</h3>)}<p className="text-sm font-light italic text-gray-600 mb-2">{plant.scientificName}</p>{plant.family && (<p className="text-xs text-gray-500">Family: {plant.family}</p>)}</div>
            </button>))}
          </div>
        )}
        {plants.length > 0 && (<div className="mt-8 flex justify-center gap-4">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-6 py-3 bg-white/80 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 rounded-xl font-light transition-all duration-300 shadow-md">Previous</button>
          <span className="px-6 py-3 bg-[#6B8E6B] text-white rounded-xl font-light shadow-md">Page {page}</span>
          <button onClick={() => setPage((p) => p + 1)} className="px-6 py-3 bg-white/80 hover:bg-white text-gray-900 rounded-xl font-light transition-all duration-300 shadow-md">Next</button>
        </div>)}
        </>)}
      </div>
    </main>
  );
}
