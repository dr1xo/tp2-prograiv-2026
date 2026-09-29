import { test, expect } from '@playwright/test';
import { resetAndSeed } from './helpers';

test.describe('E2E - Flujo de Notas (Ejercicio 7)', () => {
  // Se ejecuta antes de cada test para limpiar la BD y sembrar las notas iniciales
  test.beforeEach(async ({ baseURL }) => {
    await resetAndSeed(baseURL!);
  });

  // ==========================================
  // CASO FELIZ
  // Ciclo de vida completo: Crear -> Listar -> Modificar -> Eliminar
  // ==========================================
  test('caso feliz: ciclo completo de creación, consulta, modificación y eliminación de una nota', async ({ request }) => {
    // 1. Crear una nueva nota (POST)
    const createRes = await request.post('/notes', {
      data: {
        title: 'Nota E2E Feliz',
        content: 'Probando todo el circuito integrado',
        pinned: false,
      },
    });

    expect(createRes.status()).toBe(201);
    const createdNote = await createRes.json();
    expect(createdNote.id).toBeDefined();
    expect(createdNote.title).toBe('Nota E2E Feliz');
    expect(createdNote.content).toBe('Probando todo el circuito integrado');
    expect(createdNote.pinned).toBe(false);

    const noteId = createdNote.id;

    // 2. Listar notas y confirmar que la nueva nota existe (GET)
    const listRes = await request.get('/notes');
    expect(listRes.status()).toBe(200);
    const notes = await listRes.json();
    const found = notes.find((n: { id: number }) => n.id === noteId);
    expect(found).toBeDefined();
    expect(found.title).toBe('Nota E2E Feliz');

    // 3. Modificar la nota parcialmente (PATCH)
    const patchRes = await request.patch(`/notes/${noteId}`, {
      data: {
        title: 'Nota E2E Modificada',
      },
    });

    expect(patchRes.status()).toBe(200);
    const updatedNote = await patchRes.json();
    expect(updatedNote.title).toBe('Nota E2E Modificada');
    expect(updatedNote.content).toBe('Probando todo el circuito integrado'); // Mantiene el contenido original

    // 4. Eliminar la nota (DELETE)
    const deleteRes = await request.delete(`/notes/${noteId}`);
    expect(deleteRes.status()).toBe(204);

    // 5. Verificar que la nota ya no existe (GET por id -> 404)
    const getRes = await request.get(`/notes/${noteId}`);
    expect(getRes.status()).toBe(404);
  });

  // ==========================================
  // CASO DE ERROR 
  // ==========================================

    // ==========================================
  // CASO DE ERROR
  // Datos inválidos: la API rechaza la nota y no modifica el estado
  // ==========================================
  test('caso de error: rechaza una nota con content vacio', async ({ request }) => {
    // Intentar crear una nota invalida, con el content vacip
    const createRes = await request.post('/notes', {
      data: {
        title: 'Nota sin contenido',
        content: '',
      },
    });

    // Verificar el rechazo: 400 con el formato de error del controller
    expect(createRes.status()).toBe(400);
    const errorBody = await createRes.json();
    expect(errorBody.error).toBe('ValidationError');

    // Verificar que la nota invalida no se guardo (quedan solo las 2 de la semilla)
    const listRes = await request.get('/notes');
    expect(listRes.status()).toBe(200);
    const notes = await listRes.json();
    expect(notes).toHaveLength(2);
  });
});