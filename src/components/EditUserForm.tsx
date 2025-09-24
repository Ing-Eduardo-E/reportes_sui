'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User } from '@/types';
import { getAuthCookie } from '@/lib/auth';

interface DatabaseUser extends User {
  createdAt: string;
}

interface EditUserFormProps {
  user: DatabaseUser;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditUserForm({ user, onSave, onCancel }: EditUserFormProps) {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email || '',
    password: '',
    confirmPassword: '',
    role: user.role,
    isActive: user.isActive
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Validar username sin espacios
    if (formData.username.includes(' ')) {
      setError('El nombre de usuario no puede contener espacios. Usa guiones bajos (_) o puntos (.)');
      return;
    }

    if (!formData.username.trim()) {
      setError('El nombre de usuario es requerido');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = getAuthCookie();
      
      const updatePayload: {
        id: string;
        username: string;
        email: string | null;
        role: 'USER' | 'SUPERUSER';
        isActive: boolean;
        password?: string;
      } = {
        id: user.id,
        username: formData.username,
        email: formData.email || null,
        role: formData.role,
        isActive: formData.isActive
      };

      // Solo incluir contraseña si se proporcionó
      if (formData.password) {
        updatePayload.password = formData.password;
      }

      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar usuario');
      }

      const result = await response.json();
      setSuccess(`Usuario "${result.user.username}" actualizado exitosamente`);
      setTimeout(() => {
        onSave();
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar usuario');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 text-green-700 bg-green-50">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Nombre de usuario *</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
            disabled={submitting}
            placeholder="Sin espacios, usa _ o ."
          />
          <p className="text-xs text-gray-500">
            No uses espacios. Ejemplo: diana_enriquez, diana.enriquez
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            disabled={submitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Nueva contraseña (opcional)</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            disabled={submitting}
            placeholder="Dejar vacío para mantener actual"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            disabled={submitting}
            placeholder="Solo si cambias la contraseña"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Rol</Label>
          <select
            id="role"
            title="Rol del usuario"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value as 'USER' | 'SUPERUSER'})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={submitting}
          >
            <option value="USER">Usuario</option>
            <option value="SUPERUSER">Superusuario</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="isActive">Estado</Label>
          <select
            id="isActive"
            title="Estado del usuario"
            value={formData.isActive ? 'true' : 'false'}
            onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={submitting}
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? 'Actualizando...' : 'Actualizar Usuario'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}