# Portal de Tutoriales

Sistema privado de gestión de tutoriales en video almacenados en OneDrive, diseñado para equipos de trabajo internos.

## ✨ Características

- 🔒 **Autenticación segura** - Sistema de login con credenciales configurables
- 📱 **Responsive Design** - Funciona perfectamente en desktop y móviles  
- 🎯 **Dashboard integrado** - Todo embebido en una sola página
- 🔍 **Búsqueda avanzada** - Busca por título, descripción o etiquetas
- 📂 **Categorización** - Organiza tutoriales por categorías personalizables
- 🌙 **Interfaz moderna** - Diseño limpio con shadcn/ui y Tailwind CSS
- 🔗 **Integración OneDrive** - Enlaces directos a videos en la nube
- ⚡ **Sin base de datos** - Configuración simple con archivos JSON
- 🆓 **Deploy gratuito** - Compatible con Vercel, Netlify, etc.

## 🚀 Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd tutoriales_sui
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
copy .env.example .env.local

# Editar .env.local con tus credenciales
JWT_SECRET=tu-clave-secreta-super-segura
ADMIN_USERNAME=tu-usuario
ADMIN_PASSWORD=tu-contraseña
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página principal con enruteo condicional
├── components/
│   ├── ui/                 # Componentes de shadcn/ui
│   ├── LoginForm.tsx       # Formulario de autenticación
│   └── Dashboard.tsx       # Dashboard principal (embebido)
├── data/
│   └── tutorials.json      # Datos de tutoriales y categorías
├── hooks/
│   └── use-auth.ts        # Hook personalizado de autenticación
├── lib/
│   ├── auth.ts            # Utilidades de autenticación
│   └── utils.ts           # Utilidades generales
└── types/
    └── index.ts           # Tipos TypeScript
```

## 🔧 Personalización

### Agregar nuevos tutoriales
Edita `src/data/tutorials.json`:

```json
{
  "tutorials": [
    {
      "id": "tutorial-nuevo",
      "title": "Mi Nuevo Tutorial",
      "description": "Descripción del tutorial",
      "category": "technical",
      "oneDriveUrl": "https://1drv.ms/v/tu-enlace",
      "duration": "5:30",
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z",
      "tags": ["etiqueta1", "etiqueta2"]
    }
  ]
}
```

### Agregar nuevas categorías
En el mismo archivo, sección `categories`:

```json
{
  "categories": [
    {
      "id": "nueva-categoria",
      "name": "Nueva Categoría", 
      "description": "Descripción de la categoría",
      "color": "bg-red-500",
      "icon": "Settings"
    }
  ]
}
```

### Cambiar credenciales
Modifica el archivo `.env.local`:

```env
ADMIN_USERNAME=nuevo-usuario
ADMIN_PASSWORD=nueva-contraseña-super-segura
JWT_SECRET=nueva-clave-secreta-jwt
```

## 🎨 Tecnologías Utilizadas

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Autenticación**: JWT, js-cookie
- **Iconos**: Lucide React
- **Validación**: Zod, React Hook Form
- **Deploy**: Compatible con Vercel, Netlify

## 🌐 Deploy en Producción

### Deploy en Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el panel de Vercel
3. Deploy automático ✅

### Deploy en Netlify
1. Conecta tu repositorio a Netlify
2. Configura build command: `npm run build`
3. Configura variables de entorno
4. Deploy automático ✅

## 🔒 Seguridad

- ✅ Autenticación con JWT
- ✅ Variables de entorno para credenciales
- ✅ Validación de entrada con Zod
- ✅ Cookies seguras (HTTPOnly en producción)
- ✅ Sin base de datos = menos superficie de ataque

## 🛠️ Comandos Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción  
npm run start        # Servidor de producción
npm run lint         # Linter de código
```

## 📱 Capturas de Pantalla

### Página de Login
- Formulario elegante y responsive
- Validación en tiempo real
- Indicadores de carga

### Dashboard Principal  
- Vista de grid y lista
- Búsqueda en tiempo real
- Filtros por categoría
- Información detallada de cada tutorial

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y de uso interno.

## ✅ Todo List

- [x] ✅ Sistema de autenticación
- [x] ✅ Dashboard responsive 
- [x] ✅ Búsqueda y filtrado
- [x] ✅ Integración con OneDrive
- [x] ✅ Configuración sin base de datos
- [x] ✅ Deploy preparation
- [x] ✅ **Panel para agregar tutoriales desde la web**
- [x] ✅ **API para persistir datos automáticamente**
- [x] ✅ **Formulario completo con validación**
- [ ] 🔄 Estadísticas de visualización
- [ ] 🔄 Modo oscuro/claro
- [ ] 🔄 Exportar/importar datos

## 📞 Soporte

Para soporte interno, contacta al administrador del sistema.
