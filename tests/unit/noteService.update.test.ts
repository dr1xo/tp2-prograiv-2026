import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - updateNote (Ejercicio 4)', () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:');
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('actualiza solo el título sin modificar el contenido', () => {
    const created = service.createNote({ title: 'Original', content: 'Contenido intacto' });

    const updated = service.updateNote(created.id, { title: 'Modificado' });

    expect(updated).toBeDefined();
    expect(updated?.id).toBe(created.id);
    expect(updated?.title).toBe('Modificado');
    expect(updated?.content).toBe('Contenido intacto');
  });

  it('actualiza solo el contenido sin modificar el título', () => {
    const created = service.createNote({ title: 'Título intacto', content: 'Original' });

    const updated = service.updateNote(created.id, { content: 'Modificado' });

    expect(updated).toBeDefined();
    expect(updated?.title).toBe('Título intacto');
    expect(updated?.content).toBe('Modificado');
  });

  it('actualiza la propiedad pinned', () => {
    const created = service.createNote({ title: 'Nota', content: 'Contenido', pinned: false });

    const updated = service.updateNote(created.id, { pinned: true });

    expect(updated?.pinned).toBe(true);
  });

  it('devuelve undefined si el id de nota no existe', () => {
    const result = service.updateNote(9999, { title: 'Inexistente' });

    expect(result).toBeUndefined();
  });
});