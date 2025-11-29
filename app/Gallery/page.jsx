"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPlantHistory, deletePlantResult } from '@/lib/plantStorage';
import { supabase } from '@/lib/SupabaseClient';
import { Trash2, Leaf } from 'lucide-react';
import Image from 'next/image';

export default function GalleryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      await loadHistory(user.id);
    } catch (err) {
      console.warn('Failed to get current user for gallery:', err);
      router.push('/login');
    }
  };

  const loadHistory = async (userId) => {
    setLoading(true);
    try {
      const data = await getPlantHistory(userId);

      // Normalize items so `common_names` is always an array (or empty array)
      const normalized = (Array.isArray(data) ? data : []).map((it) => {
        let common = [];
        try {
          if (Array.isArray(it.common_names)) {
            common = it.common_names;
          } else if (typeof it.common_names === 'string') {
            // handle stored JSON string like '["Name"]' or plain string
            try {
              const parsed = JSON.parse(it.common_names);
              common = Array.isArray(parsed) ? parsed : [String(parsed)];
            } catch (e) {
              // not JSON, treat as single common name
              common = it.common_names ? [it.common_names] : [];
            }
          }
        } catch (e) {
          common = [];
        }

        return { ...it, common_names: common };
      });

      setHistory(normalized);
    } catch (err) {
      console.error('Error loading history:', err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (confirm('Delete this plant from your gallery?')) {
      await deletePlantResult(id, user.id);
      loadHistory(user.id);
    }
  };

  const handleCardClick = (item) => {
    // For gallery items, pass the database ID so results page can fetch from DB
    // This is more reliable than sessionStorage which can fail during navigation
    router.push(`/results?id=${item.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-700/20 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-950/60 via-zinc-950 to-black"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative z-10 min-h-screen pt-20">
        {/* Header */}
        <div className="border-b border-white/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Plant Archive</h1>
              <p className="text-sm text-gray-400 font-mono">Your botanical collection</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
              <Leaf className="w-5 h-5 text-green-400" />
              <span className="text-sm font-mono text-gray-300">{history.length} specimen{history.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {history.length === 0 ? (
            <div className="text-center py-20">
              <Leaf className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No plants yet</h3>
              <p className="text-gray-500">Start identifying plants to build your collection</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {history.map((item) => (
                <div key={item.id} onClick={() => handleCardClick(item)} className="group relative cursor-pointer">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-green-700 via-emerald-600 to-green-800 rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
                  <div className="relative bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-green-600/50 transition-all duration-300">
                    <div className="aspect-square relative">
                      {item.uploaded_image ? (
                        <Image
                          src={item.uploaded_image}
                          alt={item.scientific_name || (item.common_names && item.common_names[0]) || 'Plant image'}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-white/5">
                          <Leaf className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div> */}
                      <button 
                        onClick={(e) => handleDelete(e, item.id)} 
                        className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-500 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white text-lg mb-1 truncate italic">{item.scientific_name || 'Unknown species'}</h3>
                      {item.common_names?.length > 0 && (
                        <p className="text-sm text-green-400 truncate">{item.common_names[0]}</p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" 
                            
                          ></div>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
