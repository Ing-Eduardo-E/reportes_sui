import { Mail, User } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-3 sm:py-4 lg:py-6 mt-auto flex-shrink-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
          {/* Logo y información de la empresa */}
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0 text-center sm:text-left">
            <Logo size="sm" showText={true} className="text-white" />
            <div className="sm:border-l border-gray-600 sm:pl-4">
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs sm:text-sm">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span className="font-medium">Ing. Eduardo E. Enríquez R.</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs sm:text-sm text-gray-300 mt-1">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <a 
                  href="mailto:3e.asesorias.consultorias@gmail.com"
                  className="hover:text-blue-400 transition-colors break-all"
                >
                  3e.asesorias.consultorias@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Copyright y año */}
          <div className="flex flex-col items-center md:items-end text-xs sm:text-sm text-gray-400 space-y-1">
            <div>© {currentYear} 3E Asesorías y Consultorías</div>
            <div className="text-xs hidden sm:block">Portal de Tutoriales - Todos los derechos reservados</div>
          </div>
        </div>
        
        {/* Línea divisoria y información adicional */}
        <div className="mt-3 pt-3 border-t border-gray-700 hidden sm:block">
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