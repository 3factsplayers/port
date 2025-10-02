import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db, Skill } from '../lib/firebase';

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  useEffect(() => {
    loadSkills();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSkills();
          }
        });
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('skills');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [skills]);

  const loadSkills = async () => {
    try {
      const q = query(collection(db, 'skills'), orderBy('orderIndex', 'asc'));
      const querySnapshot = await getDocs(q);

      const skillsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Skill));

      setSkills(skillsData);

      const initialValues: Record<string, number> = {};
      skillsData.forEach(skill => {
        initialValues[skill.id] = 0;
      });
      setAnimatedValues(initialValues);
    } catch (error) {
      console.error('Error loading skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateSkills = () => {
    skills.forEach((skill) => {
      let currentValue = 0;
      const increment = skill.percentage / 50;
      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= skill.percentage) {
          currentValue = skill.percentage;
          clearInterval(timer);
        }
        setAnimatedValues((prev) => ({
          ...prev,
          [skill.id]: Math.round(currentValue),
        }));
      }, 20);
    });
  };

  return (
    <section id="skills" className="min-h-screen py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-4">
          My Skills
        </h2>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          Expertise in industry-leading design tools and technologies
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {skills.map((skill) => (
              <div key={skill.id} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-slate-800">{skill.name}</h3>
                  <span className="text-2xl font-bold text-slate-900">
                    {animatedValues[skill.id] || 0}%
                  </span>
                </div>
                <div className="h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-slate-600 to-slate-800 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${animatedValues[skill.id] || 0}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
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