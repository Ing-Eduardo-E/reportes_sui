import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const newPassword = 'Admin123!';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    const updatedUser = await prisma.user.updateMany({
      where: { role: 'SUPERUSER' },
      data: { password: hashedPassword }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Contraseña resetada exitosamente',
      credentials: {
        username: 'rekineke',
        password: 'Admin123!',
        note: 'Usar estas credenciales para login'
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al resetear contraseña' },
      { status: 500 }
    );
  }
}
