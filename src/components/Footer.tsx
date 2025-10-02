import { useEffect, useState } from 'react';
import { Mail, Phone, Facebook, Instagram, Twitter, Linkedin, Github } from 'lucide-react';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db, Profile, SocialLink } from '../lib/firebase';

const iconMap: Record<string, any> = {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
};

export default function Footer() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const profileQuery = query(collection(db, 'profiles'), limit(1));
      const profileSnapshot = await getDocs(profileQuery);

      if (!profileSnapshot.empty) {
        const doc = profileSnapshot.docs[0];
        setProfile({ id: doc.id, ...doc.data() } as Profile);
      }

      const socialQuery = query(collection(db, 'social_links'), orderBy('orderIndex', 'asc'));
      const socialSnapshot = await getDocs(socialQuery);

      const socialData = socialSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SocialLink));

      setSocialLinks(socialData);
    } catch (error) {
      console.error('Error loading footer data:', error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <div className="space-y-3">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>{profile.email}</span>
                </a>
              )}
              {profile?.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>{profile.phone}</span>
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <button
                onClick={() => scrollToSection('home')}
                className="block text-slate-300 hover:text-white transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('works')}
                className="block text-slate-300 hover:text-white transition-colors"
              >
                Works
              </button>
              <button
                onClick={() => scrollToSection('skills')}
                className="block text-slate-300 hover:text-white transition-colors"
              >
                Skills
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Follow Me</h3>
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = iconMap[link.iconName] || Facebook;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} {profile?.name || 'Graphics Designer'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}