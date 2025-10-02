import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Save, X } from 'lucide-react';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, SocialLink } from '../../lib/firebase';

type SocialLinkForm = Omit<SocialLink, 'id' | 'createdAt'>;

export default function SocialLinksManager() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<SocialLinkForm>({
    platform: '',
    url: '',
    iconName: '',
    orderIndex: 0,
  });

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const q = query(collection(db, 'social_links'), orderBy('orderIndex', 'asc'));
      const querySnapshot = await getDocs(q);

      const linksData = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as SocialLink));

      setLinks(linksData);
    } catch (error) {
      console.error('Error loading social links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      await addDoc(collection(db, 'social_links'), {
        ...formData,
        createdAt: new Date().toISOString(),
      });
      await loadLinks();
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error('Error adding social link:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const link = links.find((l) => l.id === id);
      if (!link) return;

      const linkRef = doc(db, 'social_links', id);
      await updateDoc(linkRef, {
        platform: link.platform,
        url: link.url,
        iconName: link.iconName,
        orderIndex: link.orderIndex,
      });

      setEditingId(null);
    } catch (error) {
      console.error('Error updating social link:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social link?')) return;

    try {
      await deleteDoc(doc(db, 'social_links', id));
      await loadLinks();
    } catch (error) {
      console.error('Error deleting social link:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      platform: '',
      url: '',
      iconName: '',
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
        <h2 className="text-2xl font-bold text-slate-900">Social Links Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Link
        </button>
      </div>

      {showAddForm && (
        <div className="bg-slate-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Social Link</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Platform (e.g., Facebook)"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Icon Name (e.g., Facebook)"
              value={formData.iconName}
              onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
            <input
              type="url"
              placeholder="URL"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Order Index"
              value={formData.orderIndex}
              onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>
          <p className="text-sm text-slate-600 mt-2">
            Icon names should match Lucide React icons (e.g., Facebook, Instagram, Twitter, Linkedin, Github)
          </p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
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
        {links.map((link) => (
          <div key={link.id} className="bg-white border border-slate-200 rounded-lg p-4">
            {editingId === link.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) =>
                      setLinks(links.map((l) => (l.id === link.id ? { ...l, platform: e.target.value } : l)))
                    }
                    className="px-4 py-2 border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={link.iconName}
                    onChange={(e) =>
                      setLinks(links.map((l) => (l.id === link.id ? { ...l, iconName: e.target.value } : l)))
                    }
                    className="px-4 py-2 border border-slate-300 rounded-lg"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) =>
                      setLinks(links.map((l) => (l.id === link.id ? { ...l, url: e.target.value } : l)))
                    }
                    className="px-4 py-2 border border-slate-300 rounded-lg"
                  />
                  <input
                    type="number"
                    value={link.orderIndex}
                    onChange={(e) =>
                      setLinks(links.map((l) => (l.id === link.id ? { ...l, orderIndex: parseInt(e.target.value) || 0 } : l)))
                    }
                    className="px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(link.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
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
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{link.platform}</h3>
                  <p className="text-sm text-slate-600 break-all">{link.url}</p>
                  <p className="text-xs text-slate-500 mt-1">Icon: {link.iconName}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(link.id)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
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