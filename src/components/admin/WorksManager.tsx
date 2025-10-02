import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Save, X } from 'lucide-react';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, Work } from '../../lib/firebase';

type WorkForm = Omit<Work, 'id' | 'createdAt' | 'updatedAt'>;

export default function WorksManager() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<WorkForm>({
    title: '',
    category: 'poster_design',
    imageUrl: '',
    description: '',
    orderIndex: 0,
  });

  useEffect(() => {
    loadWorks();
  }, []);

  const loadWorks = async () => {
    try {
      const q = query(collection(db, 'works'), orderBy('orderIndex', 'asc'));
      const querySnapshot = await getDocs(q);

      const worksData = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as Work));

      setWorks(worksData);
    } catch (error) {
      console.error('Error loading works:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, workId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `works/${workId || 'new'}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      if (workId) {
        setWorks(works.map(w => w.id === workId ? { ...w, imageUrl: url } : w));
      } else {
        setFormData({ ...formData, imageUrl: url });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    try {
      await addDoc(collection(db, 'works'), {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await loadWorks();
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error('Error adding work:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const work = works.find((w) => w.id === id);
      if (!work) return;

      const workRef = doc(db, 'works', id);
      await updateDoc(workRef, {
        title: work.title,
        category: work.category,
        imageUrl: work.imageUrl,
        description: work.description,
        orderIndex: work.orderIndex,
        updatedAt: new Date().toISOString(),
      });

      setEditingId(null);
    } catch (error) {
      console.error('Error updating work:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work?')) return;

    try {
      await deleteDoc(doc(db, 'works', id));
      await loadWorks();
    } catch (error) {
      console.error('Error deleting work:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'poster_design',
      imageUrl: '',
      description: '',
      orderIndex: 0,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Works Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Work
        </button>
      </div>

      {showAddForm && (
        <div className="bg-slate-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            >
              <option value="poster_design">Poster Design</option>
              <option value="thumbnail_design">Thumbnail Design</option>
              <option value="logo_design">Logo Design</option>
              <option value="business_card">Business Card</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e)}
              disabled={uploading}
              className="px-4 py-2 border border-slate-300 rounded-lg md:col-span-2"
            />
            <input
              type="url"
              placeholder="Or enter Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent md:col-span-2"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent md:col-span-2"
              rows={3}
            />
            <input
              type="number"
              placeholder="Order Index"
              value={formData.orderIndex}
              onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>
          {uploading && <p className="text-sm text-slate-500 mt-2">Uploading image...</p>}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                resetForm();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {works.map((work) => (
          <div key={work.id} className="bg-white border border-slate-200 rounded-lg p-4">
            {editingId === work.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={work.title}
                    onChange={(e) =>
                      setWorks(works.map((w) => (w.id === work.id ? { ...w, title: e.target.value } : w)))
                    }
                    className="px-4 py-2 border border-slate-300 rounded-lg"
                  />
                  <select
                    value={work.category}
                    onChange={(e) =>
                      setWorks(works.map((w) => (w.id === work.id ? { ...w, category: e.target.value as any } : w)))
                    }
                    className="px-4 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="poster_design">Poster Design</option>
                    <option value="thumbnail_design">Thumbnail Design</option>
                    <option value="logo_design">Logo Design</option>
                    <option value="business_card">Business Card</option>
                  </select>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, work.id)}
                    disabled={uploading}
                    className="px-4 py-2 border border-slate-300 rounded-lg md:col-span-2"
                  />
                  <input
                    type="url"
                    value={work.imageUrl}
                    onChange={(e) =>
                      setWorks(works.map((w) => (w.id === work.id ? { ...w, imageUrl: e.target.value } : w)))
                    }
                    className="px-4 py-2 border border-slate-300 rounded-lg md:col-span-2"
                  />
                  <textarea
                    value={work.description}
                    onChange={(e) =>
                      setWorks(works.map((w) => (w.id === work.id ? { ...w, description: e.target.value } : w)))
                    }
                    className="px-4 py-2 border border-slate-300 rounded-lg md:col-span-2"
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(work.id)}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <img
                  src={work.imageUrl}
                  alt={work.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{work.title}</h3>
                  <p className="text-sm text-slate-600">{work.category.replace('_', ' ')}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(work.id)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(work.id)}
                    className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
