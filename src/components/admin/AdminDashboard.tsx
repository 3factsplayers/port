import { useState } from 'react';
import { LogOut, User, Briefcase, Award, Share2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ProfileManager from './ProfileManager';
import WorksManager from './WorksManager';
import SkillsManager from './SkillsManager';
import SocialLinksManager from './SocialLinksManager';

type TabType = 'profile' | 'works' | 'skills' | 'social';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const { signOut } = useAuth();

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'works' as TabType, label: 'Works', icon: Briefcase },
    { id: 'skills' as TabType, label: 'Skills', icon: Award },
    { id: 'social' as TabType, label: 'Social Links', icon: Share2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-slate-900 border-b-2 border-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'profile' && <ProfileManager />}
            {activeTab === 'works' && <WorksManager />}
            {activeTab === 'skills' && <SkillsManager />}
            {activeTab === 'social' && <SocialLinksManager />}
          </div>
        </div>
      </div>
    </div>
  );
}