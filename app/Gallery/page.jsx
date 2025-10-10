"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPlantHistory, deletePlantResult } from '@/lib/plantStorage';
import { supabase } from '@/lib/SupabaseClient';
import { Trash2, Leaf } from 'lucide-react';

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

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#EBE8DC]">
      {/* Header */}
      <div className="bg-white shadow-sm p-6 flex justify-between items-center">
        <h1 className="text-2xl font-serif italic">My Plant Gallery</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <Leaf className="w-5 h-5" />
          <span>{history.length} plants identified</span>
        </div>
      </div>

      {/* Grid */}
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <div key={item.id} onClick={() => handleCardClick(item)} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
            <div className="aspect-square relative">
              {item.uploaded_image ? (
                <img src={item.uploaded_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <Leaf className="w-10 h-10 text-gray-400" />
                </div>
              )}
              <button onClick={(e) => handleDelete(e, item.id)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-serif italic text-lg">{item.scientific_name}</h3>
              {item.common_names?.length > 0 && (
                <p className="text-sm text-gray-600">{item.common_names[0]}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
