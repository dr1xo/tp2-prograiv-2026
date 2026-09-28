import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { makeApp } from '../../src/app';

describe('Rutas HTTP - PATCH /notes/:id (Ejercicio 4)', () => {
  let app: ReturnType<typeof makeApp>;

  beforeEach(() => {
    app = makeApp(':memory:');
  });

  it('PATCH /notes/:id modifica parcialmente la nota y responde 200', async () => {
    const createRes = await request(app)
      .post('/notes')
      .send({ title: 'Nota inicial', content: 'Texto inicial' });

    const noteId = createRes.body.id;

    const patchRes = await request(app)
      .patch(`/notes/${noteId}`)
      .send({ content: 'Texto actualizado' });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.title).toBe('Nota inicial');
    expect(patchRes.body.content).toBe('Texto actualizado');
  });

  it('PATCH /notes/:id responde 404 si la nota no existe', async () => {
    const res = await request(app)
      .patch('/notes/9999')
      .send({ title: 'Nota inexistente' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'NotFound' });
  });

  it('PATCH /notes/:id responde 400 si el body no cumple con las validaciones', async () => {
    const createRes = await request(app)
      .post('/notes')
      .send({ title: 'Nota válida', content: 'Contenido' });

    const noteId = createRes.body.id;

    // String vacío viola min(1) definido en patchSchema
    const res = await request(app)
      .patch(`/notes/${noteId}`)
      .send({ title: '' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });
});

describe('GET /notes/:id (Ejercicio 3)', () => {
  let app: ReturnType<typeof makeApp>;

  beforeEach(() => {
    app = makeApp(':memory:');
  });

  it('responde 200 con la nota cuando el id existe', async () => {
    const created = await request(app)
      .post('/notes')
      .send({ title: 'Comprar pan', content: 'Antes de las 20hs' });

    const res = await request(app).get(`/notes/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(created.body);
    expect(res.body.title).toBe('Comprar pan');
    expect(res.body.content).toBe('Antes de las 20hs');
    expect(res.body.pinned).toBe(false);
  });

  it('responde 404 cuando el id no existe', async () => {
    const res = await request(app).get('/notes/999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'NotFound' });
  });
});