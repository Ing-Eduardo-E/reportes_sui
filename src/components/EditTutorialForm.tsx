'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'lucide-react';
import { Category, Tutorial } from '@/types';

const tutorialSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  category: z.string().min(1, 'La categoría es requerida'),
  oneDriveUrl: z.string().url('Debe ser una URL válida')
});

type TutorialFormData = z.infer<typeof tutorialSchema>;

interface EditTutorialFormProps {
  tutorial: Tutorial;
  categories: Category[];
  onSubmit: (data: Tutorial) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function EditTutorialForm({ 
  tutorial,
  categories, 
  onSubmit, 
  onCancel, 
  loading = false 
}: EditTutorialFormProps) {
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<TutorialFormData>({
    resolver: zodResolver(tutorialSchema),
    defaultValues: {
      title: tutorial.title,
      description: tutorial.description,
      category: tutorial.category,
      oneDriveUrl: tutorial.oneDriveUrl
    }
  });

  // Establecer valores iniciales
  useEffect(() => {
    setValue('title', tutorial.title);
    setValue('description', tutorial.description);
    setValue('category', tutorial.category);
    setValue('oneDriveUrl', tutorial.oneDriveUrl);
  }, [tutorial, setValue]);

  const onFormSubmit = async (data: TutorialFormData) => {
    try {
      setError('');
      const updatedTutorial = {
        ...tutorial,
        ...data
      };
      await onSubmit(updatedTutorial);
    } catch {
      setError('Error al actualizar el tutorial');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Editar Tutorial
        </CardTitle>
        <CardDescription className="text-gray-600">
          Modifica la información del tutorial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título del Tutorial *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Ej: Introducción al Sistema"
              disabled={loading}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Describe brevemente el contenido del tutorial..."
              className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoría *</Label>
            <select
              id="category"
              {...register('category')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Seleccionar categoría...</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* URL de OneDrive */}
          <div className="space-y-2">
            <Label htmlFor="oneDriveUrl">URL de OneDrive *</Label>
            <div className="relative">
              <Link className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="oneDriveUrl"
                {...register('oneDriveUrl')}
                placeholder="https://1drv.ms/v/..."
                className="pl-10"
                disabled={loading}
              />
            </div>
            {errors.oneDriveUrl && (
              <p className="text-sm text-red-600">{errors.oneDriveUrl.message}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex space-x-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 text-white font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              style={{
                backgroundColor: loading ? '#9ca3af' : '#1d4ed8',
                border: '1px solid ' + (loading ? '#9ca3af' : '#1d4ed8')
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#1e40af';
                  e.currentTarget.style.borderColor = '#1e40af';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                  e.currentTarget.style.borderColor = '#1d4ed8';
                }
              }}
            >
              {loading ? 'Actualizando...' : '✅ Actualizar Tutorial'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-6 py-3 font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              style={{
                backgroundColor: loading ? '#f3f4f6' : '#ffffff',
                color: loading ? '#9ca3af' : '#dc2626',
                border: '2px solid ' + (loading ? '#d1d5db' : '#dc2626')
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                  e.currentTarget.style.color = '#b91c1c';
                  e.currentTarget.style.borderColor = '#b91c1c';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#dc2626';
                  e.currentTarget.style.borderColor = '#dc2626';
                }
              }}
            >
              ❌ Cancelar
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}