import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET /api/tutorials - Obtener todos los tutoriales
export async function GET() {
  try {
    const tutorials = await prisma.tutorial.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Convertir las fechas a strings para el frontend
    const tutorialsFormatted = tutorials.map(tutorial => ({
      ...tutorial,
      createdAt: tutorial.createdAt.toISOString(),
      updatedAt: tutorial.updatedAt.toISOString()
    }));

    return NextResponse.json({
      tutorials: tutorialsFormatted,
      categories: [
        {
          id: 'formularios-online',
          name: 'Formularios en línea',
          description: 'Tutoriales sobre formularios digitales',
          color: 'bg-blue-500',
          icon: 'FileText'
        },
        {
          id: 'formulario-no-aplican',
          name: 'Formulario No Aplican',
          description: 'Casos especiales de formularios',
          color: 'bg-orange-500',
          icon: 'UserX'
        },
        {
          id: 'cargue-masivo',
          name: 'Cargue Masivo',
          description: 'Procesos de carga masiva de datos',
          color: 'bg-green-500',
          icon: 'Upload'
        },
        {
          id: 'reportes-validaciones',
          name: 'Reportes y Validaciones',
          description: 'Tutoriales sobre generación de reportes y procesos de validación',
          color: 'bg-purple-500',
          icon: 'CheckCircle'
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    return NextResponse.json(
      { error: 'Error al cargar los tutoriales' },
      { status: 500 }
    );
  }
}

// POST /api/tutorials - Crear nuevo tutorial
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

    // Obtener datos del tutorial
    const { title, description, category, oneDriveUrl } = await request.json();
    
    if (!title || !description || !category || !oneDriveUrl) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Crear tutorial en la base de datos
    const tutorial = await prisma.tutorial.create({
      data: {
        title,
        description,
        category,
        oneDriveUrl
      }
    });

    // Formatear fechas para el frontend
    const tutorialFormatted = {
      ...tutorial,
      createdAt: tutorial.createdAt.toISOString(),
      updatedAt: tutorial.updatedAt.toISOString()
    };

    return NextResponse.json({
      message: 'Tutorial creado exitosamente',
      tutorial: tutorialFormatted
    });

  } catch (error) {
    console.error('Error creating tutorial:', error);
    return NextResponse.json(
      { error: 'Error al crear el tutorial' },
      { status: 500 }
    );
  }
}

// PUT /api/tutorials - Actualizar tutorial existente
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
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Solo SUPERUSER puede editar tutoriales
    if (user.role !== 'SUPERUSER') {
      return NextResponse.json(
        { error: 'Solo los superusuarios pueden editar tutoriales' },
        { status: 403 }
      );
    }

    // Obtener datos del tutorial
    const { id, title, description, category, oneDriveUrl } = await request.json();
    
    if (!id || !title || !description || !category || !oneDriveUrl) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el tutorial existe
    const existingTutorial = await prisma.tutorial.findUnique({
      where: { id }
    });

    if (!existingTutorial) {
      return NextResponse.json(
        { error: 'Tutorial no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar tutorial en la base de datos
    const tutorial = await prisma.tutorial.update({
      where: { id },
      data: {
        title,
        description,
        category,
        oneDriveUrl
      }
    });

    // Formatear fechas para el frontend
    const tutorialFormatted = {
      ...tutorial,
      createdAt: tutorial.createdAt.toISOString(),
      updatedAt: tutorial.updatedAt.toISOString()
    };

    return NextResponse.json({
      message: 'Tutorial actualizado exitosamente',
      tutorial: tutorialFormatted
    });

  } catch (error) {
    console.error('Error updating tutorial:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el tutorial' },
      { status: 500 }
    );
  }
}

// DELETE /api/tutorials - Eliminar tutorial
export async function DELETE(request: NextRequest) {
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

    // Solo SUPERUSER puede eliminar tutoriales
    if (user.role !== 'SUPERUSER') {
      return NextResponse.json(
        { error: 'Solo los superusuarios pueden eliminar tutoriales' },
        { status: 403 }
      );
    }

    // Obtener ID del tutorial a eliminar
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID del tutorial es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el tutorial existe
    const existingTutorial = await prisma.tutorial.findUnique({
      where: { id }
    });

    if (!existingTutorial) {
      return NextResponse.json(
        { error: 'Tutorial no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar tutorial de la base de datos
    await prisma.tutorial.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Tutorial eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting tutorial:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el tutorial' },
      { status: 500 }
    );
  }
}