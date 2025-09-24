'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Link, Tag, Clock } from 'lucide-react';
import { Category } from '@/types';

const tutorialSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  category: z.string().min(1, 'La categoría es requerida'),
  oneDriveUrl: z.string().url('Debe ser una URL válida'),
  duration: z.string().optional(),
  tags: z.string().optional()
});

type TutorialFormData = z.infer<typeof tutorialSchema>;

interface AddTutorialFormProps {
  categories: Category[];
  onSubmit: (data: Omit<TutorialFormData, 'tags'> & { tags: string[] }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function AddTutorialForm({ 
  categories, 
  onSubmit, 
  onCancel, 
  loading = false 
}: AddTutorialFormProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TutorialFormData>({
    resolver: zodResolver(tutorialSchema)
  });

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const onFormSubmit = async (data: TutorialFormData) => {
    try {
      setError('');
      const formData = { ...data, tags };
      await onSubmit(formData);
      reset();
      setTags([]);
    } catch {
      setError('Error al crear el tutorial');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Agregar Nuevo Tutorial
        </CardTitle>
        <CardDescription className="text-gray-600">
          Completa la información del tutorial para agregarlo al sistema
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

          {/* Duración */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duración (opcional)</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="duration"
                {...register('duration')}
                placeholder="Ej: 10:30"
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Etiquetas (opcional)</Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe una etiqueta y presiona Enter"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              <Button
                type="button"
                onClick={addTag}
                disabled={!currentTag.trim() || loading}
                variant="outline"
                size="icon"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Mostrar tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      type="button"
                      onClick={() => removeTag(tag)}
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      disabled={loading}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Creando...' : 'Crear Tutorial'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}