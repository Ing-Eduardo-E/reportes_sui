import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { User } from '@/types';

// POST /api/auth - Login
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { 
        username,
        isActive: true 
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }
    
    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }
    
    // Actualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });
    
    // Preparar respuesta del usuario
    const userResponse: User = {
      id: user.id,
      username: user.username,
      email: user.email || undefined,
      role: user.role as 'SUPERUSER' | 'USER',
      isActive: user.isActive,
      lastLogin: new Date().toISOString()
    };
    
    // Crear token simple
    const payload = {
      user: userResponse,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    const token = Buffer.from(JSON.stringify(payload)).toString('base64');
    
    return NextResponse.json({
      success: true,
      user: userResponse,
      token
    });
    
  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}