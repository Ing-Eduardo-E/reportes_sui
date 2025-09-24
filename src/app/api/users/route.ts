import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET /api/users - Obtener lista de usuarios (solo SUPERUSER)
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);
    
    if (!user || user.role !== 'SUPERUSER') {
      return NextResponse.json(
        { error: 'Solo superusuarios pueden gestionar usuarios' },
        { status: 403 }
      );
    }

    // Obtener lista de usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLogin: true
        // No incluir password por seguridad
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(users);

  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/users - Crear nuevo usuario (solo SUPERUSER)
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);
    
    if (!user || user.role !== 'SUPERUSER') {
      return NextResponse.json(
        { error: 'Solo superusuarios pueden crear usuarios' },
        { status: 403 }
      );
    }

    const { username, email, password, role = 'USER' } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 409 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = await prisma.user.create({
      data: {
        username,
        email: email || null,
        password: hashedPassword,
        role: role as 'SUPERUSER' | 'USER'
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
        // No incluir password por seguridad
      }
    });

    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: newUser
    });

  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/users - Actualizar usuario existente (solo SUPERUSER)
export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);
    
    if (!user || user.role !== 'SUPERUSER') {
      return NextResponse.json(
        { error: 'Solo superusuarios pueden modificar usuarios' },
        { status: 403 }
      );
    }

    const { id, username, email, password, role, isActive } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de usuario es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Preparar datos para actualizar
    const updateData: {
      username?: string;
      email?: string | null;
      password?: string;
      role?: 'SUPERUSER' | 'USER';
      isActive?: boolean;
    } = {};
    
    if (username) {
      // Validar que el nuevo username no existe (excepto el actual)
      const usernameExists = await prisma.user.findUnique({
        where: { username }
      });
      
      if (usernameExists && usernameExists.id !== id) {
        return NextResponse.json(
          { error: 'El nombre de usuario ya existe' },
          { status: 409 }
        );
      }
      updateData.username = username;
    }
    
    if (email !== undefined) {
      updateData.email = email || null;
    }
    
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'La contraseña debe tener al menos 6 caracteres' },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    if (role) {
      updateData.role = role;
    }
    
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      message: 'Usuario actualizado exitosamente',
      user: updatedUser
    });

  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}