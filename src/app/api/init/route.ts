import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// GET /api/init - Inicializar base de datos
export async function GET() {
  try {
    // Verificar si ya existe un superuser
    const existingSuperuser = await prisma.user.findFirst({
      where: { role: 'SUPERUSER' }
    });
    
    if (existingSuperuser) {
      return NextResponse.json({
        success: true,
        message: 'Base de datos ya inicializada',
        user: {
          username: existingSuperuser.username,
          email: existingSuperuser.email
        }
      });
    }
    
    // Crear usuario SUPERUSER inicial
    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    
    const superuser = await prisma.user.create({
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
        note: 'Cambia la contraseña después del primer login'
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al inicializar base de datos' },
      { status: 500 }
    );
  }
}
