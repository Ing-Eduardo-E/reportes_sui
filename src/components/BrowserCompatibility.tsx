'use client';

import { useEffect } from 'react';

export default function BrowserCompatibility() {
  useEffect(() => {
    // Detectar navegador
    const isEdge = /Edg/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);
    
    if (isEdge) {
      document.body.classList.add('browser-edge');
      
      // Polyfill para oklch si no está soportado
      if (!CSS.supports('color', 'oklch(0.5 0.1 180)')) {
        document.body.classList.add('no-oklch');
      }
      
      // Mejorar renderizado de texto en Edge con setProperty
      document.body.style.setProperty('-webkit-font-smoothing', 'antialiased');
      document.body.style.setProperty('text-rendering', 'optimizeLegibility');
    }
    
    if (isChrome) {
      document.body.classList.add('browser-chrome');
    }
    
    // Verificar soporte para backdrop-filter
    if (!CSS.supports('backdrop-filter', 'blur(10px)')) {
      document.body.classList.add('no-backdrop-filter');
    }
    
    // Mejorar performance de scroll
    if ('scrollBehavior' in document.documentElement.style) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
    
  }, []);

  return null; // Este componente no renderiza nada
}
