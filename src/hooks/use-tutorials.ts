'use client';

import { useState, useEffect } from 'react';
import { Tutorial, Category } from '@/types';
import { getAuthCookie } from '@/lib/auth';

interface TutorialData {
  tutorials: Tutorial[];
  categories: Category[];
}

interface NewTutorial {
  title: string;
  description: string;
  category: string;
  oneDriveUrl: string;
  tags?: string[]; // Opcional para compatibilidad hacia atrás
}

export const useTutorials = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTutorials = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tutorials');
      
      if (!response.ok) {
        throw new Error('Error al cargar tutoriales');
      }

      const data: TutorialData = await response.json();
      setTutorials(data.tutorials);
      setCategories(data.categories);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const addTutorial = async (newTutorial: NewTutorial): Promise<boolean> => {
    try {
      const token = getAuthCookie();
      if (!token) {
        throw new Error('No autorizado');
      }

      const response = await fetch('/api/tutorials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTutorial)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar tutorial');
      }

      const result = await response.json();
      
      // Agregar el nuevo tutorial al estado local
      setTutorials(prev => [...prev, result.tutorial]);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar tutorial');
      return false;
    }
  };

  const updateTutorial = async (tutorial: Tutorial): Promise<boolean> => {
    try {
      const token = getAuthCookie();
      if (!token) {
        throw new Error('No autorizado');
      }

      const response = await fetch('/api/tutorials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tutorial)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar tutorial');
      }

      const result = await response.json();
      
      // Actualizar el tutorial en el estado local
      setTutorials(prev => prev.map(t => t.id === tutorial.id ? result.tutorial : t));
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar tutorial');
      return false;
    }
  };

  const deleteTutorial = async (tutorialId: string): Promise<boolean> => {
    try {
      const token = getAuthCookie();
      if (!token) {
        throw new Error('No autorizado');
      }

      const response = await fetch(`/api/tutorials?id=${tutorialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar tutorial');
      }
      
      // Eliminar el tutorial del estado local
      setTutorials(prev => prev.filter(t => t.id !== tutorialId));
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar tutorial');
      return false;
    }
  };

  useEffect(() => {
    loadTutorials();
  }, []);

  return {
    tutorials,
    categories,
    loading,
    error,
    loadTutorials,
    addTutorial,
    updateTutorial,
    deleteTutorial
  };
};