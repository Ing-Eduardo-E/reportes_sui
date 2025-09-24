const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function listUsers() {
  try {
    console.log('\n📋 Lista de usuarios en la base de datos:\n');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLogin: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      return;
    }

    users.forEach((user, index) => {
      console.log(`${index + 1}. 👤 ${user.username}`);
      console.log(`   📧 Email: ${user.email || 'No especificado'}`);
      console.log(`   🔐 Rol: ${user.role}`);
      console.log(`   ✅ Activo: ${user.isActive ? 'Sí' : 'No'}`);
      console.log(`   📅 Creado: ${user.createdAt.toLocaleString('es-ES')}`);
      console.log(`   🕒 Último acceso: ${user.lastLogin ? user.lastLogin.toLocaleString('es-ES') : 'Nunca'}`);
      console.log(`   🆔 ID: ${user.id}`);
      console.log('   ---');
    });

    console.log(`\n📊 Total: ${users.length} usuario${users.length !== 1 ? 's' : ''}`);

  } catch (error) {
    console.error('❌ Error listando usuarios:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();