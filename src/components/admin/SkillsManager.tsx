import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Save, X } from 'lucide-react';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, Skill } from '../../lib/firebase';

type SkillForm = Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>;

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<SkillForm>({
    name: '',
    percentage: 0,
    orderIndex: 0,
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const q = query(collection(db, 'skills'), orderBy('orderIndex', 'asc'));
      const querySnapshot = await getDocs(q);

      const skillsData = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as Skill));

      setSkills(skillsData);
    } catch (error) {
      console.error('Error loading skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      await addDoc(collection(db, 'skills'), {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await loadSkills();
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const skill = skills.find((s) => s.id === id);
      if (!skill) return;

      const skillRef = doc(db, 'skills', id);
      await updateDoc(skillRef, {
        name: skill.name,
        percentage: skill.percentage,
        orderIndex: skill.orderIndex,
        updatedAt: new Date().toISOString(),
      });

      setEditingId(null);
    } catch (error) {
      console.error('Error updating skill:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      await deleteDoc(doc(db, 'skills', id));
      await loadSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      percentage: 0,
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
        <h2 className="text-2xl font-bold text-slate-900">Skills Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Skill
        </button>
      </div>

      {showAddForm && (
        <div className="bg-slate-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Skill</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Skill Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Percentage (0-100)"
              min="0"
              max="100"
              value={formData.percentage}
              onChange={(e) => setFormData({ ...formData, percentage: parseInt(e.target.value) || 0 })}
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
        {skills.map((skill) => (
          <div key={skill.id} className="bg-white border border-slate-200 rounded-lg p-4">
            {editingId === skill.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) =>
                      setSkills(skills.map((s) => (s.id === skill.id ? { ...s, name: e.target.value } : s)))
                    }
                    className="px-4 py-2 border border-slate-300 rounded-lg"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={skill.percentage}
                    onChange={(e) =>
                      setSkills(skills.map((s) => (s.id === skill.id ? { ...s, percentage: parseInt(e.target.value) || 0 } : s)))
                    }
                    className="px-4 py-2 border border-slate-300 rounded-lg"
                  />
                  <input
                    type="number"
                    value={skill.orderIndex}
                    onChange={(e) =>
                      setSkills(skills.map((s) => (s.id === skill.id ? { ...s, orderIndex: parseInt(e.target.value) || 0 } : s)))
                    }
                    className="px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(skill.id)}
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
                  <h3 className="font-semibold text-slate-900">{skill.name}</h3>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-900 rounded-full"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{skill.percentage}%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(skill.id)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
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