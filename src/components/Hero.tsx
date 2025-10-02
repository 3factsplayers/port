import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db, Profile } from '../lib/firebase';

export default function Hero() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const q = query(collection(db, 'profiles'), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setProfile({ id: doc.id, ...doc.data() } as Profile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToWorks = () => {
    document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 min-h-screen flex items-center">
        <div className="grid md:grid-cols-2 gap-12 items-center w-full">
          <div className="flex justify-center md:justify-end order-2 md:order-1">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-slate-400 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                {profile?.profileImageUrl ? (
                  <img
                    src={profile.profileImageUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                    <span className="text-6xl text-white font-bold">
                      {profile?.name?.charAt(0) || 'G'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 order-1 md:order-2">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
              {profile?.name || 'Your Name'}
            </h1>
            <p className="text-2xl md:text-3xl text-slate-600 font-light">
              {profile?.subtitle || 'I am a Graphics Designer'}
            </p>
            <p className="text-lg text-slate-700 leading-relaxed max-w-xl">
              {profile?.description || 'A passionate graphics designer specializing in creating stunning visual experiences.'}
            </p>
            <button
              onClick={scrollToWorks}
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all duration-300 hover:gap-3 shadow-lg hover:shadow-xl"
            >
              Show More
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}