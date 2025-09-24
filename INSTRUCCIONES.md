# 📋 Instrucciones de Uso - Portal de Tutoriales

## 🚀 Cómo usar el sistema

### Agregar Nueva Categoría
En `src/data/tutorials.json`, sección "categories":

```json
{
  "id": "nueva-categoria",
  "name": "Mi Nueva Categoría",
  "description": "Descripción de la categoría",
  "color": "bg-indigo-500",
  "icon": "Settings"
}
```

### Categorías Actuales
- **Formularios en Línea**: Tutoriales para formularios en línea
- **Formulario No Aplican**: Formularios que no aplican según criterios
- **Cargue Masivo**: Procedimientos para carga masiva de datos
- **Reportes**: Generación y manejo de reportes
- **Validaciones**: Procesos de validación y verificacióntema de Usuarios:**
- **SUPERUSUARIO**: Control total (crear usuarios, agregar tutoriales, ver todo)
- **USUARIO**: Solo visualización de tutoriales

### 1. **Acceso al Sistema**
- Abrir en navegador: `http://localhost:3004` (desarrollo) o tu dominio (producción)
- **Credenciales iniciales**: 
  - Usuario: `rekineke`
  - Contraseña: `rekineke123`
- Hacer clic en "Iniciar Sesión"

### 2. **Panel de Navegación**
- **Tutoriales**: Ver y gestionar tutoriales (todos los usuarios)
- **Usuarios**: Gestionar usuarios del sistema (solo SUPERUSUARIO)

### 3. **Para SUPERUSUARIOS:**
#### Gestionar Usuarios:
1. Hacer clic en "Usuarios" en el panel lateral
2. Hacer clic en "Agregar Usuario"
3. Completar formulario (username, email, contraseña, rol)
4. El nuevo usuario puede acceder inmediatamente

#### Agregar Tutoriales:
1. Ir a sección "Tutoriales"
2. Hacer clic en "Agregar Tutorial" (solo visible para superusuarios)
3. Completar formulario con información del video
4. El tutorial aparece inmediatamente para todos los usuarios

### 4. **Para USUARIOS NORMALES:**
- Solo pueden ver tutoriales existentes
- Pueden buscar y filtrar por categorías
- Pueden reproducir videos desde OneDrive
- No pueden agregar tutoriales ni gestionar usuarios

## 📝 Cómo Agregar Nuevos Tutoriales

### ✨ **Método Fácil - Desde la Interfaz Web (NUEVO)**
1. **Iniciar sesión** en el portal
2. **Hacer clic** en el botón "Agregar Tutorial" (arriba a la derecha)
3. **Completar el formulario**:
   - Título del tutorial
   - Descripción detallada
   - Seleccionar categoría
   - URL de OneDrive (enlace compartido)
   - Duración (opcional, ej: "5:30")
   - Etiquetas (escribir y presionar Enter para cada una)
4. **Hacer clic** en "Crear Tutorial"
5. **¡Listo!** El tutorial aparece inmediatamente

### 📄 Método Manual (para desarrolladores)
1. Abrir archivo: `src/data/tutorials.json`
2. Agregar nuevo objeto al array "tutorials":

```json
{
  "id": "tutorial-nuevo",
  "title": "Título del Tutorial",
  "description": "Descripción detallada del contenido",
  "category": "technical",
  "oneDriveUrl": "https://1drv.ms/v/tu-enlace-aqui",
  "duration": "8:45",
  "createdAt": "2024-01-20T10:00:00Z",
  "updatedAt": "2024-01-20T10:00:00Z",
  "tags": ["etiqueta1", "etiqueta2", "etiqueta3"]
}
```

3. Guardar archivo y recargar la aplicación

### Obtener Enlaces de OneDrive
1. Subir video a OneDrive
2. Hacer clic derecho → "Compartir"
3. Configurar como "Cualquiera con el enlace puede ver"
4. Copiar enlace compartido
5. Usar este enlace en el campo "oneDriveUrl"

## 🎨 Personalizar Categorías

### Agregar Nueva Categoría
En `src/data/tutorials.json`, sección "categories":

```json
{
  "id": "nueva-categoria",
  "name": "Mi Nueva Categoría",
  "description": "Descripción de la categoría",
  "color": "bg-purple-500",
  "icon": "Settings"
}
```

### Colores Disponibles
- `bg-blue-500` (Azul)
- `bg-green-500` (Verde)
- `bg-purple-500` (Morado)
- `bg-orange-500` (Naranja)
- `bg-red-500` (Rojo)
- `bg-yellow-500` (Amarillo)
- `bg-indigo-500` (Índigo)
- `bg-pink-500` (Rosa)

### Iconos Disponibles
- `UserPlus` (Para formularios en línea)
- `UserX` (Para formularios que no aplican)
- `Upload` (Para cargue masivo)
- `FileText` (Para reportes)
- `CheckCircle` (Para validaciones)
- `Settings` (Para configuraciones generales)

## 🔒 Cambiar Credenciales

### Método 1: Variables de Entorno (.env.local)
```env
ADMIN_USERNAME=nuevo-usuario
ADMIN_PASSWORD=nueva-contraseña-segura
JWT_SECRET=clave-jwt-super-secreta-nueva
```

### Método 2: Código (src/lib/auth.ts)
Cambiar las constantes por defecto (solo si no usas .env.local)

## 📱 Consejos de Uso

### Para el Equipo
- **Navegar intuitivamente**: Todo está diseñado para ser autoexplicativo
- **Usar búsqueda**: Más rápido que navegar por categorías
- **Vista lista**: Mejor para ver muchos tutoriales rápidamente
- **Etiquetas**: Ayudan a encontrar contenido específico

### Para Administradores
- **Nombres descriptivos**: Títulos claros y descriptivos
- **Descripciones útiles**: Explica qué aprenderá el usuario
- **Etiquetas relevantes**: Facilita búsquedas posteriores
- **Duraciones**: Ayuda a planificar tiempo de visualización
- **Categorías consistentes**: Mantén organización lógica

## 🚨 Troubleshooting

### El video no se abre
- Verificar que el enlace de OneDrive sea público
- Revisar que la URL esté completa y correcta
- Intentar abrir el enlace directamente en el navegador

### No puedo iniciar sesión
- Revisar variables de entorno en `.env.local`
- Verificar que usuario/contraseña coincidan
- Limpiar caché del navegador

### Los cambios no aparecen
- Reiniciar servidor de desarrollo (`Ctrl+C` y `npm run dev`)
- Verificar sintaxis JSON en `tutorials.json`
- Limpiar caché del navegador

### Error de build
- Ejecutar `npm run lint` para verificar errores
- Verificar sintaxis de JSON
- Ejecutar `npm install` por si faltan dependencias

## 📊 Estadísticas de Uso

### Información Visible
- Total de tutoriales por categoría
- Resultados de búsqueda en tiempo real
- Fecha de creación de cada tutorial
- Duración de videos (si disponible)

## 🔄 Actualización del Sistema

### Agregar Nuevos Tutoriales
1. Seguir formato JSON exacto
2. IDs únicos para cada tutorial
3. URLs válidas de OneDrive
4. Fechas en formato ISO (YYYY-MM-DDTHH:mm:ssZ)

### Backup Regular
- Copiar `src/data/tutorials.json` regularmente
- Versionar cambios con git si es posible
- Mantener respaldo de videos en OneDrive

---

## 📞 Soporte

**¿Necesitas ayuda?**
- Revisa este archivo de instrucciones
- Consulta el README.md para información técnica
- Contacta al administrador del sistema para soporte técnico