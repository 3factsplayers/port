import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Works from './components/Works';
import Skills from './components/Skills';
import Footer from './components/Footer';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

function AppContent() {
  const [showAdmin, setShowAdmin] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (showAdmin) {
    if (user) {
      return <AdminDashboard />;
    }
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen">
      <Navigation onAdminClick={() => setShowAdmin(true)} />
      <Hero />
      <Works />
      <Skills />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
