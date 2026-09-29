import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';
import { notify } from '../../src/services/notificationService';

// Reemplaza todo el módulo por una versión falsa: notify pasa a ser un espía
// y no se manda ninguna notificación real.
vi.mock('../../src/services/notificationService', () => ({
    notify: vi.fn()
}));

describe('NoteService - notificación al fijar (Ejercicio 6)', () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
    vi.clearAllMocks();
    const db = createDb(':memory:');
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
    });

    it('llama a notify una vez cuando la nota se crea con pinned: true', () => {
    const note = service.createNote({ title: 'Importante', content: 'Urgente', pinned: true });

    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith(note);
    });

    it('no llama a notify cuando pinned es false', () => {
    service.createNote({ title: 'Común', content: 'Nada especial', pinned: false });

    expect(notify).not.toHaveBeenCalled();
    });

    it('no llama a notify cuando no se indica pinned', () => {
    service.createNote({ title: 'Común', content: 'Nada especial' });

    expect(notify).not.toHaveBeenCalled();
    });
});