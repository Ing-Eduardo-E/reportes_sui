import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// GET /api/init - Inicializar base de datos
export async function GET() {
  try {
    // Verificar conexión con Prisma
    await prisma.$connect();
    
    // Verificar si ya existe un superuser
    const existingSuperuser = await prisma.user.findFirst({
      where: { role: 'SUPERUSER' }
    });
    
    if (existingSuperuser) {
      // Si ya existe, resetear contraseña
      const hashedPassword = await bcrypt.hash('Admin123!', 12);
      
      await prisma.user.updateMany({
        where: { role: 'SUPERUSER' },
        data: { password: hashedPassword }
      });
      
      return NextResponse.json({
        success: true,
        message: 'Contraseña de SUPERUSER resetada',
        credentials: {
          username: existingSuperuser.username,
          password: 'Admin123!',
          note: 'Contraseña resetada exitosamente'
        }
      });
    }
    
    // Crear usuario SUPERUSER inicial si no existe
    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    
    await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@3easesorias.com',
        password: hashedPassword,
        role: 'SUPERUSER',
        isActive: true
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Usuario SUPERUSER creado exitosamente',
      credentials: {
        username: 'admin',
        password: 'Admin123!',
        note: 'Usuario creado exitosamente'
      }
    });
    
  } catch (error) {
    console.error('Error detallado:', error);
    return NextResponse.json(
      { 
        error: 'Error al inicializar base de datos',
        details: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
