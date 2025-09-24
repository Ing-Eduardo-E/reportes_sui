// Hook para detectar navegador y aplicar estilos específicos
'use client';

import { useEffect } from 'react';

export const useBrowserCompatibility = () => {
  useEffect(() => {
    const isEdge = /Edg/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);
    
    if (isEdge) {
      // Aplicar clases específicas para Edge
      document.body.classList.add('browser-edge');
      
      // Polyfill para oklch si no está soportado
      if (!CSS.supports('color', 'oklch(0.5 0.1 180)')) {
        document.body.classList.add('no-oklch');
      }
    }
    
    if (isChrome) {
      document.body.classList.add('browser-chrome');
    }
    
    // Detectar soporte para backdrop-filter
    if (!CSS.supports('backdrop-filter', 'blur(10px)')) {
      document.body.classList.add('no-backdrop-filter');
    }
    
  }, []);
};

// CSS-in-JS para compatibilidad crítica
export const getBrowserSpecificStyles = () => {
  const isEdge = typeof window !== 'undefined' && /Edg/.test(navigator.userAgent);
  
  if (isEdge) {
    return {
      // Estilos inline para Edge si es necesario
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility'
    };
  }
  
  return {};
};
