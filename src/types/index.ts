export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  oneDriveUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  role: 'SUPERUSER' | 'USER';
  isActive: boolean;
  lastLogin?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface DashboardView {
  currentView: 'home' | 'add-tutorial' | 'edit-tutorial' | 'categories' | 'settings' | 'users';
  selectedTutorial?: Tutorial;
  selectedCategory?: string;
}