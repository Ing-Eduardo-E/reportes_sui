'use client';

import { useAuth } from '@/hooks/use-auth';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import Footer from '@/components/Footer';

export default function HomePage() {
  const { user, isAuthenticated, login, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center px-4">
            <div className="animate-spin rounded-full h-20 w-20 sm:h-32 sm:w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-sm sm:text-base text-gray-600">Cargando...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <LoginForm onLogin={login} loading={loading} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dashboard que incluye su propio header */}
      <div className="flex-1 overflow-hidden">
        <Dashboard user={user} onLogout={logout} />
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}