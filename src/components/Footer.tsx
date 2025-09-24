import { Mail, User } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-4 lg:py-6 mt-auto flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Logo y información de la empresa */}
          <div className="flex items-center space-x-4">
            <Logo size="md" showText={true} className="text-white" />
            <div className="border-l border-gray-600 pl-4">
              <div className="flex items-center space-x-2 text-sm">
                <User className="w-4 h-4 text-blue-400" />
                <span className="font-medium">Ing. Eduardo E. Enríquez R.</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300 mt-1">
                <Mail className="w-4 h-4 text-blue-400" />
                <a 
                  href="mailto:3e.asesorias.consultorias@gmail.com"
                  className="hover:text-blue-400 transition-colors"
                >
                  3e.asesorias.consultorias@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Copyright y año */}
          <div className="flex flex-col items-center md:items-end text-sm text-gray-400 space-y-1">
            <div>© {currentYear} 3E Asesorías y Consultorías</div>
            <div className="text-xs">Portal de Tutoriales - Todos los derechos reservados</div>
          </div>
        </div>
        
        {/* Línea divisoria y información adicional */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
            <div>
              Sistema privado de gestión de tutoriales en video
            </div>
            <div className="mt-2 sm:mt-0">
              Desarrollado con Next.js y React
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}