'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  LogOut, 
  Search, 
  Play, 
  Filter,
  Grid3X3,
  List,
  UserPlus,
  UserX,
  Upload,
  FileText,
  CheckCircle,
  Settings,
  Plus,
  Users,
  Edit,
  Trash2
} from 'lucide-react';
import { Tutorial, User } from '@/types';
import { useTutorials } from '@/hooks/use-tutorials';
import AddTutorialForm from './AddTutorialForm';
import EditTutorialForm from './EditTutorialForm';
import UserManagement from './UserManagement';
import Logo from './Logo';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const iconMap = {
  UserPlus,
  UserX,
  Upload,
  FileText,
  CheckCircle,
  Settings
};

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const { tutorials, categories, loading: tutorialsLoading, addTutorial, updateTutorial, deleteTutorial } = useTutorials();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [addingTutorial, setAddingTutorial] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState(false);
  const [deletingTutorial, setDeletingTutorial] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'tutorials' | 'users'>('tutorials');

  // Filtrar tutoriales
  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openVideo = (tutorial: Tutorial) => {
    // Abrir el video de OneDrive en una nueva ventana
    window.open(tutorial.oneDriveUrl, '_blank');
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleAddTutorial = async (tutorialData: {
    title: string;
    description: string;
    category: string;
    oneDriveUrl: string;
  }) => {
    setAddingTutorial(true);
    const success = await addTutorial(tutorialData);
    setAddingTutorial(false);
    
    if (success) {
      setShowAddForm(false);
    }
  };

  const handleEditTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setShowEditForm(true);
  };

  const handleUpdateTutorial = async (tutorialData: Tutorial) => {
    setEditingTutorial(true);
    const success = await updateTutorial(tutorialData);
    setEditingTutorial(false);
    
    if (success) {
      setShowEditForm(false);
      setSelectedTutorial(null);
    }
  };

  const handleDeleteTutorial = async (tutorialId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este tutorial? Esta acción no se puede deshacer.')) {
      setDeletingTutorial(tutorialId);
      const success = await deleteTutorial(tutorialId);
      setDeletingTutorial(null);
      
      if (!success) {
        // El error ya se maneja en el hook
        alert('Error al eliminar el tutorial');
      }
    }
  };

  if (tutorialsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tutoriales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full lg:h-screen bg-gray-50 lg:flex lg:flex-col">
      {/* Header - sticky en desktop */}
      <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:sticky lg:top-0 lg:z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 lg:space-x-4">
            <Logo size="md" showText={false} className="flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg lg:text-xl font-semibold text-gray-900 truncate">Portal de Tutoriales</h1>
              <p className="text-xs lg:text-sm text-gray-500 truncate">Bienvenido, {user.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Botón Agregar Tutorial - Solo SUPERUSER */}
            {user.role === 'SUPERUSER' && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{
                  backgroundColor: '#1d4ed8',
                  border: '1px solid #1d4ed8'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e40af';
                  e.currentTarget.style.borderColor = '#1e40af';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                  e.currentTarget.style.borderColor = '#1d4ed8';
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Agregar Tutorial</span>
                <span className="sm:hidden">Agregar</span>
              </button>
            )}
            {/* Botón Cerrar Sesión */}
            <button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              style={{
                backgroundColor: '#ffffff',
                color: '#1f2937',
                border: '3px solid #ef4444',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fef2f2';
                e.currentTarget.style.borderColor = '#dc2626';
                e.currentTarget.style.color = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#ef4444';
                e.currentTarget.style.color = '#1f2937';
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">🚪 Cerrar Sesión</span>
              <span className="sm:hidden">🚪 Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content area with proper height */}
      <div className="flex-1 lg:flex lg:min-h-0">
        <div className="flex flex-col lg:flex-row lg:w-full lg:h-full">
          {/* Sidebar */}
          <aside className="lg:w-64 w-full bg-white border-r border-gray-200 lg:overflow-y-auto">
            <div className="p-4 lg:p-6">
              <div className="space-y-4">
                {/* Navegación principal */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900">Navegación</h3>
                  <div className="space-y-1 flex flex-row lg:flex-col gap-2 lg:gap-0">
                    <Button
                      variant={currentView === 'tutorials' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setCurrentView('tutorials')}
                      className="flex-1 lg:w-full justify-start"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Tutoriales
                    </Button>
                    {user.role === 'SUPERUSER' && (
                      <Button
                        variant={currentView === 'users' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setCurrentView('users')}
                        className="flex-1 lg:w-full justify-start"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Usuarios
                      </Button>
                    )}
                  </div>
                </div>

                {/* Búsqueda y filtros - solo mostrar en vista de tutoriales */}
                {currentView === 'tutorials' && (
                  <>
                    {/* Búsqueda */}
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Buscar tutoriales..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Filtros de categoría */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-900 flex items-center">
                        <Filter className="w-4 h-4 mr-2" />
                        Categorías
                      </h3>
                      <div className="space-y-1">
                        <Button
                          variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setSelectedCategory('all')}
                          className="w-full justify-start"
                        >
                          Todas ({tutorials.length})
                        </Button>
                        {categories.map((category) => {
                          const Icon = iconMap[category.icon as keyof typeof iconMap] || Settings;
                          const count = tutorials.filter(t => t.category === category.id).length;
                          return (
                            <Button
                              key={category.id}
                              variant={selectedCategory === category.id ? 'default' : 'ghost'}
                              size="sm"
                              onClick={() => setSelectedCategory(category.id)}
                              className="w-full justify-start"
                            >
                              <Icon className="w-4 h-4 mr-2" />
                              {category.name} ({count})
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6 lg:overflow-y-auto lg:h-full">
            {currentView === 'tutorials' ? (
              <>
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                        {selectedCategory === 'all' ? 'Todos los Tutoriales' : 
                         categories.find(c => c.id === selectedCategory)?.name || 'Tutoriales'}
                      </h2>
                      <p className="text-gray-600 mt-1 text-sm lg:text-base">
                        {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 'es' : ''} 
                        {searchTerm && ` encontrado${filteredTutorials.length !== 1 ? 's' : ''} para "${searchTerm}"`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Botones de vista */}
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tutoriales Grid/List */}
                <div className="lg:flex-1 lg:min-h-0">
                  {filteredTutorials.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron tutoriales</h3>
                      <p className="text-gray-600">
                        {searchTerm ? 'Prueba con otros términos de búsqueda' : 'No hay tutoriales en esta categoría'}
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-full lg:h-[calc(100vh-280px)]">
                      <div className={
                        viewMode === 'grid' 
                          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6' 
                          : 'space-y-4'
                      }>
                        {filteredTutorials.map((tutorial) => {
                          const categoryInfo = getCategoryInfo(tutorial.category);
                          const isDeleting = deletingTutorial === tutorial.id;
                          
                          return (
                            <Card 
                              key={tutorial.id} 
                              className={`transition-all hover:shadow-lg ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                              {viewMode === 'grid' ? (
                                /* Vista Grid Compacta */
                                <>
                                  <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <CardTitle className="text-sm font-semibold line-clamp-2 flex-1">{tutorial.title}</CardTitle>
                                      {categoryInfo && (
                                        <Badge className={`${categoryInfo.color} text-white text-xs flex-shrink-0`}>
                                          {categoryInfo.name}
                                        </Badge>
                                      )}
                                    </div>
                                    <CardDescription className="text-xs text-gray-600 line-clamp-2 mb-2">
                                      {tutorial.description}
                                    </CardDescription>
                                    <div className="text-xs text-gray-500">
                                      <span>Creado: {formatDate(tutorial.createdAt)}</span>
                                    </div>
                                  </CardHeader>
                                  
                                  <CardContent className="pt-0 pb-4">
                                    <div className="space-y-2">
                                      <Button 
                                        size="sm"
                                        variant="default"
                                        className="w-full"
                                        onClick={() => openVideo(tutorial)}
                                        disabled={isDeleting}
                                      >
                                        <Play className="w-3 h-3 mr-1" />
                                        Ver Tutorial
                                      </Button>
                                      
                                      {/* Botones de edición solo para SUPERUSER */}
                                      {user.role === 'SUPERUSER' && (
                                        <div className="grid grid-cols-2 gap-1">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleEditTutorial(tutorial);
                                            }}
                                            disabled={isDeleting}
                                            className="text-xs"
                                          >
                                            <Edit className="w-3 h-3 mr-1" />
                                            Editar
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteTutorial(tutorial.id);
                                            }}
                                            disabled={isDeleting}
                                            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                          >
                                            <Trash2 className="w-3 h-3 mr-1" />
                                            {isDeleting ? 'Eliminando...' : 'Eliminar'}
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </>
                              ) : (
                                /* Vista Lista Horizontal */
                                <div className="flex items-center p-4">
                                  <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                      <CardTitle className="text-sm font-semibold truncate flex-1">{tutorial.title}</CardTitle>
                                      {categoryInfo && (
                                        <Badge className={`${categoryInfo.color} text-white text-xs flex-shrink-0`}>
                                          {categoryInfo.name}
                                        </Badge>
                                      )}
                                    </div>
                                    <CardDescription className="text-xs text-gray-600 line-clamp-1 mb-1">
                                      {tutorial.description}
                                    </CardDescription>
                                    <div className="text-xs text-gray-500">
                                      <span>Creado: {formatDate(tutorial.createdAt)}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2 flex-shrink-0">
                                    <Button 
                                      size="sm"
                                      variant="default"
                                      className="whitespace-nowrap"
                                      onClick={() => openVideo(tutorial)}
                                      disabled={isDeleting}
                                    >
                                      <Play className="w-3 h-3 mr-1" />
                                      Ver
                                    </Button>
                                    
                                    {/* Botones de edición solo para SUPERUSER */}
                                    {user.role === 'SUPERUSER' && (
                                      <>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditTutorial(tutorial);
                                          }}
                                          disabled={isDeleting}
                                          className="whitespace-nowrap"
                                        >
                                          <Edit className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTutorial(tutorial.id);
                                          }}
                                          disabled={isDeleting}
                                          className="text-red-600 hover:text-red-700 hover:bg-red-50 whitespace-nowrap"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Card>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </>
            ) : (
              /* Vista de gestión de usuarios */
              <UserManagement currentUser={user} />
            )}
          </main>
        </div>
      </div>

      {/* Modal para agregar tutorial - solo SUPERUSER */}
      {user.role === 'SUPERUSER' && (
        <>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Tutorial</DialogTitle>
              </DialogHeader>
              <AddTutorialForm
                categories={categories}
                onSubmit={handleAddTutorial}
                onCancel={() => setShowAddForm(false)}
                loading={addingTutorial}
              />
            </DialogContent>
          </Dialog>

          {/* Modal para editar tutorial */}
          <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Tutorial</DialogTitle>
              </DialogHeader>
              {selectedTutorial && (
                <EditTutorialForm
                  tutorial={selectedTutorial}
                  categories={categories}
                  onSubmit={handleUpdateTutorial}
                  onCancel={() => {
                    setShowEditForm(false);
                    setSelectedTutorial(null);
                  }}
                  loading={editingTutorial}
                />
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}