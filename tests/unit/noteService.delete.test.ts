import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';


describe('NoteService - deleteNote (Ejercicio 5)', () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:');
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('elimina una nota existente por id', () => {
    const note = service.createNote({ title: 'titulo', content: 'contenido' });

    service.deleteNote(note.id);

    expect(service.listNotes()).toHaveLength(0);
  });
})