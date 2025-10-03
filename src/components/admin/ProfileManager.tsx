import { useEffect, useState } from 'react';
import { Save, Upload } from 'lucide-react';
import { collection, query, limit, getDocs, doc, updateDoc, addDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, Profile } from '../../lib/firebase';

export default function ProfileManager() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const q = query(collection(db, 'profiles'), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setProfile({ id: docSnap.id, ...docSnap.data() } as Profile);
      } else {
        setProfile({
          id: '',
          name: '',
          subtitle: '',
          description: '',
          profileImageUrl: '',
          email: '',
          phone: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `profiles/${profile.id}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      setProfile({ ...profile, profileImageUrl: url });
      setMessage('Image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error uploading image');
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage('');

    try {
      if (profile.id) {
        const profileRef = doc(db, 'profiles', profile.id);
        await updateDoc(profileRef, {
          name: profile.name,
          subtitle: profile.subtitle,
          description: profile.description,
          profileImageUrl: profile.profileImageUrl,
          email: profile.email,
          phone: profile.phone,
          updatedAt: new Date().toISOString(),
        });
        setMessage('Profile updated successfully!');
      } else {
        const docRef = await addDoc(collection(db, 'profiles'), {
          name: profile.name,
          subtitle: profile.subtitle,
          description: profile.description,
          profileImageUrl: profile.profileImageUrl,
          email: profile.email,
          phone: profile.phone,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setProfile({ ...profile, id: docRef.id });
        setMessage('Profile created successfully!');
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving profile');
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Profile Information</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={profile?.name || ''}
            onChange={(e) => profile && setProfile({ ...profile, name: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Subtitle
          </label>
          <input
            type="text"
            value={profile?.subtitle || ''}
            onChange={(e) => profile && setProfile({ ...profile, subtitle: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            value={profile?.description || ''}
            onChange={(e) => profile && setProfile({ ...profile, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Profile Image
          </label>
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
            <input
              type="url"
              value={profile?.profileImageUrl || ''}
              onChange={(e) => profile && setProfile({ ...profile, profileImageUrl: e.target.value })}
              placeholder="Or enter image URL"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
            {uploading && <p className="text-sm text-slate-500">Uploading image...</p>}
          </div>
          <p className="text-sm text-slate-500 mt-1">Upload an image or enter a URL</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={profile?.email || ''}
            onChange={(e) => profile && setProfile({ ...profile, email: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={profile?.phone || ''}
            onChange={(e) => profile && setProfile({ ...profile, phone: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />
        </div>

        {message && (
          <div className={`px-4 py-3 rounded-lg ${
            message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}