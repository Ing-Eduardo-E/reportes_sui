import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({
      success: true,
      total_users: users.length,
      users: users,
      superusers: users.filter(u => u.role === 'SUPERUSER').length,
      message: 'Debug: Lista de usuarios en base de datos'
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Error al verificar usuarios',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
