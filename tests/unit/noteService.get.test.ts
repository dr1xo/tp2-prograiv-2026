import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - getNote (Ejercicio 3)', () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
    const db = createDb(':memory:');
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
    });

    it('devuelve la nota cuando el id existe', () => {
    const created = service.createNote({ title: 'Comprar pan', content: 'Antes de las 20hs' });

    const found = service.getNote(created.id);

    expect(found).toEqual(created);
    expect(found?.title).toBe('Comprar pan');
    expect(found?.content).toBe('Antes de las 20hs');
    expect(found?.pinned).toBe(false);
    });

    it('devuelve la nota correcta cuando hay varias guardadas', () => {
    service.createNote({ title: 'Nota 1', content: 'Contenido 1' });
    const second = service.createNote({ title: 'Nota 2', content: 'Contenido 2' });
    service.createNote({ title: 'Nota 3', content: 'Contenido 3' });

    const found = service.getNote(second.id);

    expect(found?.id).toBe(second.id);
    expect(found?.title).toBe('Nota 2');
    });

    it('devuelve undefined cuando el id no existe', () => {
    expect(service.getNote(999)).toBeUndefined();
    });

    it('devuelve undefined si la base está vacía', () => {
    expect(service.listNotes()).toEqual([]);
    expect(service.getNote(1)).toBeUndefined();
    });
});