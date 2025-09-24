const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('\n🚀 Creando administrador...\n');
    
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { username: 'admin' }
    });
    
    if (existingUser) {
      console.log('❌ Error: El usuario admin ya existe');
      return;
    }
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    
    // Crear el superusuario
    const user = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@3easesorias.com',
        password: hashedPassword,
        role: 'SUPERUSER'
      }
    });
    
    console.log('✅ Administrador creado exitosamente!');
    console.log(`👤 Usuario: ${user.username}`);
    console.log(`🔑 Rol: ${user.role}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`📅 Creado: ${user.createdAt.toLocaleString('es-ES')}`);
    
    console.log('\n🎯 Credenciales para acceso:');
    console.log('   Usuario: admin');
    console.log('   Contraseña: Admin123!');
    
  } catch (error) {
    console.error('\n❌ Error creando administrador:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();