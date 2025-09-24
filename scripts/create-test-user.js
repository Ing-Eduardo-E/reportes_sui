const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('\n🚀 Creando usuario de prueba...\n');
    
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { username: 'usuario_prueba' }
    });
    
    if (existingUser) {
      console.log('❌ Error: El usuario usuario_prueba ya existe');
      return;
    }
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash('user123', 10);
    
    // Crear el usuario regular
    const user = await prisma.user.create({
      data: {
        username: 'usuario_prueba',
        email: 'test@email.com',
        password: hashedPassword,
        role: 'USER'  // Usuario regular
      }
    });
    
    console.log('✅ Usuario de prueba creado exitosamente!');
    console.log(`👤 Usuario: ${user.username}`);
    console.log(`🔑 Rol: ${user.role}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`📅 Creado: ${user.createdAt.toLocaleString('es-ES')}`);
    
    console.log('\n🎯 Credenciales para pruebas:');
    console.log('   Usuario: usuario_prueba');
    console.log('   Contraseña: user123');
    
  } catch (error) {
    console.error('\n❌ Error creando usuario:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();