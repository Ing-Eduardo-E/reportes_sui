'use client';

import { useAuth } from '@/hooks/use-auth';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import Footer from '@/components/Footer';

export default function HomePage() {
  const { user, isAuthenticated, login, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
        <div className="lg:sticky lg:bottom-0 lg:z-10 flex-shrink-0">
          <Footer />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="h-screen flex flex-col lg:h-screen">
        <div className="flex-1 lg:overflow-y-auto">
          <LoginForm onLogin={login} loading={loading} />
        </div>
        <div className="lg:sticky lg:bottom-0 lg:z-10 flex-shrink-0">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col lg:h-screen">
      {/* Dashboard que incluye su propio header */}
      <div className="flex-1 lg:flex lg:flex-col lg:h-full overflow-hidden">
        <Dashboard user={user} onLogout={logout} />
      </div>
      {/* Footer sticky en desktop, normal en móvil */}
      <div className="lg:sticky lg:bottom-0 lg:z-10">
        <Footer />
      </div>
    </div>
  );
}