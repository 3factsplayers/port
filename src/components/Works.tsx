import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db, Work } from '../lib/firebase';

const categories = [
  { id: 'all', label: 'All Works' },
  { id: 'poster_design', label: 'Poster Design' },
  { id: 'thumbnail_design', label: 'Thumbnail Design' },
  { id: 'logo_design', label: 'Logo Design' },
  { id: 'business_card', label: 'Business Card' },
];

export default function Works() {
  const [works, setWorks] = useState<Work[]>([]);
  const [filteredWorks, setFilteredWorks] = useState<Work[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorks();
  }, []);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredWorks(works);
    } else {
      setFilteredWorks(works.filter(work => work.category === activeCategory));
    }
  }, [activeCategory, works]);

  const loadWorks = async () => {
    try {
      const q = query(collection(db, 'works'), orderBy('orderIndex', 'asc'));
      const querySnapshot = await getDocs(q);

      const worksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Work));

      setWorks(worksData);
      setFilteredWorks(worksData);
    } catch (error) {
      console.error('Error loading works:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="works" className="min-h-screen py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-4">
          My Works
        </h2>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          Explore my portfolio of creative designs across various categories
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-slate-900 text-white shadow-lg scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
          </div>
        ) : filteredWorks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No works found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorks.map((work) => (
              <div
                key={work.id}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-slate-50"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={work.imageUrl}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold mb-2">{work.title}</h3>
                    {work.description && (
                      <p className="text-sm text-slate-200">{work.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}