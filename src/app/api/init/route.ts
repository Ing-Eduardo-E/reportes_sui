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
      // Si ya existe, crear usuario admin adicional o resetear existente
      const hashedPassword = await bcrypt.hash('Admin123!', 12);
      
      try {
        // Intentar crear nuevo admin
        const newAdmin = await prisma.user.create({
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
          message: 'Nuevo usuario admin creado exitosamente',
          credentials: {
            username: 'admin',
            password: 'Admin123!',
            note: 'Usuario admin adicional creado'
          },
          existing_user: {
            username: existingSuperuser.username,
            email: existingSuperuser.email
          }
        });
        
      } catch {
        // Si no se puede crear (ya existe admin), resetear contraseña del existente
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
            note: 'Contraseña resetada a Admin123!'
          }
        });
      }
    }
    
    // Crear usuario SUPERUSER inicial si no existe
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
