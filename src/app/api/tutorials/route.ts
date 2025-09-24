import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'src', 'data', 'tutorials.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Error al leer los tutoriales' },
      { status: 500 }
    );
  }
}

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
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Solo SUPERUSER puede agregar tutoriales
    if (user.role !== 'SUPERUSER') {
      return NextResponse.json(
        { error: 'Solo los superusuarios pueden agregar tutoriales' },
        { status: 403 }
      );
    }

    // Leer datos actuales
    const filePath = join(process.cwd(), 'src', 'data', 'tutorials.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    // Obtener nuevo tutorial del request
    const newTutorial = await request.json();
    
    // Generar ID único
    const id = `tutorial-${Date.now()}`;
    const now = new Date().toISOString();
    
    const tutorialToSave = {
      id,
      ...newTutorial,
      createdAt: now,
      updatedAt: now
    };

    // Agregar nuevo tutorial
    data.tutorials.push(tutorialToSave);

    // Guardar archivo actualizado
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json({
      message: 'Tutorial agregado exitosamente',
      tutorial: tutorialToSave
    });

  } catch {
    return NextResponse.json(
      { error: 'Error al guardar el tutorial' },
      { status: 500 }
    );
  }
}