'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Plus, UserCheck, UserX, Shield, User as UserIcon, Edit } from 'lucide-react';
import { getAuthCookie } from '@/lib/auth';
import { User } from '@/types';
import EditUserForm from './EditUserForm';

interface DatabaseUser extends User {
  createdAt: string;
}

interface UserManagementProps {
  currentUser: User;
}

export default function UserManagement({ currentUser }: UserManagementProps) {
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DatabaseUser | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER' as 'USER' | 'SUPERUSER'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = getAuthCookie();
      
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }

      const usersData = await response.json();
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = getAuthCookie();
      
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email || undefined,
          password: formData.password,
          role: formData.role
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear usuario');
      }

      const result = await response.json();
      setSuccess(`Usuario "${result.user.username}" creado exitosamente`);
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'USER'
      });
      setShowAddForm(false);
      loadUsers(); // Recargar la lista

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user: DatabaseUser) => {
    setSelectedUser(user);
    setShowEditForm(true);
  };

  const handleEditSave = () => {
    setShowEditForm(false);
    setSelectedUser(null);
    loadUsers(); // Recargar la lista
    setSuccess('Usuario actualizado exitosamente');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role: string) => {
    if (role === 'SUPERUSER') {
      return (
        <Badge className="bg-red-500 text-white">
          <Shield className="w-3 h-3 mr-1" />
          Superusuario
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <UserIcon className="w-3 h-3 mr-1" />
        Usuario
      </Badge>
    );
  };

  if (currentUser.role !== 'SUPERUSER') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">
            Acceso Denegado
          </CardTitle>
          <CardDescription>
            Solo los superusuarios pueden gestionar usuarios.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-2" />
            Gestión de Usuarios
          </h2>
          <p className="text-gray-600 mt-1">
            Administra los usuarios del sistema
          </p>
        </div>
        <div
          onClick={() => setShowAddForm(true)}
          style={{
            backgroundColor: '#1d4ed8',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            border: '2px solid #1d4ed8',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease-in-out',
            textDecoration: 'none',
            userSelect: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1e40af';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
          }}
        >
          <Plus style={{ width: '16px', height: '16px', color: '#ffffff' }} />
          <span style={{ color: '#ffffff', fontWeight: 'bold' }}>AGREGAR USUARIO</span>
        </div>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            {users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Cargando usuarios...</span>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {user.role === 'SUPERUSER' ? (
                            <Shield className="w-5 h-5 text-blue-600" />
                          ) : (
                            <UserIcon className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.username}</h3>
                          <p className="text-sm text-gray-500">{user.email || 'Sin email'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getRoleBadge(user.role)}
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-500">
                          {user.isActive ? (
                            <UserCheck className="w-4 h-4 mr-1 text-green-500" />
                          ) : (
                            <UserX className="w-4 h-4 mr-1 text-red-500" />
                          )}
                          {user.isActive ? 'Activo' : 'Inactivo'}
                        </div>
                        <p className="text-xs text-gray-400">
                          Creado: {formatDate(user.createdAt)}
                        </p>
                        {user.lastLogin && (
                          <p className="text-xs text-gray-400">
                            Último acceso: {formatDate(user.lastLogin)}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => handleEdit(user)}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Editar</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Modal para agregar usuario */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (opcional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
                disabled={submitting}
              />
            </div>

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

            <div className="flex space-x-4 pt-6">
              <div
                onClick={!submitting ? (e) => { 
                  e.preventDefault(); 
                  const form = e.currentTarget.closest('form');
                  if (form) {
                    const formEvent = new Event('submit', { bubbles: true, cancelable: true });
                    form.dispatchEvent(formEvent);
                  }
                } : undefined}
                style={{
                  backgroundColor: submitting ? '#9ca3af' : '#1d4ed8',
                  color: '#ffffff',
                  padding: '14px 24px',
                  borderRadius: '8px',
                  border: '2px solid ' + (submitting ? '#9ca3af' : '#1d4ed8'),
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  flex: '1',
                  textAlign: 'center',
                  opacity: submitting ? 0.7 : 1,
                  transition: 'all 0.2s ease-in-out',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.backgroundColor = '#1e40af';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                    e.currentTarget.style.transform = 'translateY(0px)';
                  }
                }}
              >
                <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
                  {submitting ? '⏳ CREANDO USUARIO...' : '✅ CREAR USUARIO'}
                </span>
              </div>
              <div
                onClick={() => setShowAddForm(false)}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#dc2626',
                  padding: '14px 24px',
                  borderRadius: '8px',
                  border: '2px solid #dc2626',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  flex: '1',
                  textAlign: 'center',
                  transition: 'all 0.2s ease-in-out',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                  e.currentTarget.style.color = '#b91c1c';
                  e.currentTarget.style.borderColor = '#b91c1c';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#dc2626';
                  e.currentTarget.style.borderColor = '#dc2626';
                  e.currentTarget.style.transform = 'translateY(0px)';
                }}
              >
                <span style={{ color: 'inherit', fontWeight: 'bold' }}>❌ CANCELAR</span>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para editar usuario */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Usuario: {selectedUser?.username}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <EditUserForm
              user={selectedUser}
              onSave={handleEditSave}
              onCancel={() => {
                setShowEditForm(false);
                setSelectedUser(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}