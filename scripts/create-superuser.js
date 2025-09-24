const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

async function createSuperuser() {
  try {
    console.log('\n🚀 Creación de Superusuario - Portal de Tutoriales\n');
    
    const username = await question('Nombre de usuario: ');
    const email = await question('Email (opcional): ');
    
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });
    
    if (existingUser) {
      console.log('\n❌ Error: El usuario ya existe');
      process.exit(1);
    }
    
    let password;
    let confirmPassword;
    
    do {
      password = await question('Contraseña: ');
      confirmPassword = await question('Confirmar contraseña: ');
      
      if (password !== confirmPassword) {
        console.log('❌ Las contraseñas no coinciden. Intenta de nuevo.\n');
      }
    } while (password !== confirmPassword);
    
    if (password.length < 6) {
      console.log('❌ La contraseña debe tener al menos 6 caracteres');
      process.exit(1);
    }
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear el superusuario
    const superuser = await prisma.user.create({
      data: {
        username,
        email: email || null,
        password: hashedPassword,
        role: 'SUPERUSER'
      }
    });
    
    console.log('\n✅ Superusuario creado exitosamente!');
    console.log(`👤 Usuario: ${superuser.username}`);
    console.log(`🔑 Rol: ${superuser.role}`);
    console.log(`📧 Email: ${superuser.email || 'No especificado'}`);
    console.log(`📅 Creado: ${superuser.createdAt.toLocaleString('es-ES')}`);
    
    console.log('\n🎯 Ahora puedes iniciar sesión en el portal con estas credenciales.');
    
  } catch (error) {
    console.error('\n❌ Error creando superusuario:', error.message);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

createSuperuser();