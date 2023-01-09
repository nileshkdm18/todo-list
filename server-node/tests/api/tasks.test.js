import request from 'supertest'
import app from '../../src/app'
import database from '../../src/database'

const newEntry = {
  description: 'test',
  completed: false
}

jest.useRealTimers()

describe('Task Api', () => {
  beforeAll(async () => await database.connect())
  afterAll(async () => await database.close())
  describe('GET /tasks', () => {
    let record = null
    beforeAll(async () => {
      const resp = await request(app).post('/api/tasks').send(newEntry)
      record = resp.body
    })
    afterAll(async () => {
      await request(app).delete(`/api/tasks/${record.id}`)
    })
    it('should return 200', async () => {
      const response = await request(app).get('/api/tasks')
      expect(response.statusCode).toBe(200)
      expect(response.body[0].description).toBe(newEntry.description)
    })
    it('should return tasks', async () => {
      const response = await request(app).get('/api/tasks')
      expect(response.body.length).toBeGreaterThan(0)
    })
  })

  describe('GET /api/tasks/:id', () => {
    let record = null
    beforeAll(async () => {
      const resp = await request(app).post('/api/tasks').send(newEntry)
      record = resp.body
    })
    afterAll(async () => {
      await request(app).delete(`/api/tasks/${record.id}`)
    })
    it('should return a task', async () => {
      const res = await request(app).get(
      `/api/tasks/${record.id}`
      )
      expect(res.statusCode).toBe(200)
      expect(res.body.title).toBe(newEntry.title)
    })
  })

  describe('POST /api/tasks', () => {
    let record = null
    afterAll(async () => {
      if (record && record.id) {
        await request(app).delete(`/api/tasks/${record.id}`)
      }
    })
    it('should create a task', async () => {
      const resp = await request(app).post('/api/tasks').send(newEntry)
      record = resp.body
      expect(resp.statusCode).toBe(200)
      expect(resp.body.title).toBe(newEntry.title)
    })

    it('should get error while creating a task', async () => {
      const resp = await request(app).post('/api/tasks').send({})
      expect(resp.statusCode).toBe(400)
      expect(resp.body.message).toBe('Content can not be empty!')
    })
  })

  describe('PUT /api/tasks/:id', () => {
    let record = null
    beforeAll(async () => {
      const resp = await request(app).post('/api/tasks').send(newEntry)
      record = resp.body
    })
    afterAll(async () => {
      if (record && record.id) {
        await request(app).delete(`/api/tasks/${record.id}`)
      }
    })
    it('should update a task', async () => {
      const updatedDesc = 'Updated Description'
      const res = await request(app)
        .patch(`/api/tasks/${record.id}`)
        .send({
          description: updatedDesc
        })
      expect(res.statusCode).toBe(200)
      expect(res.body.description).toBe(updatedDesc)
    })

    it('should get error if id is incorrect', async () => {
      const updatedDesc = 'Updated Description'
      const res = await request(app)
        .patch('/api/tasks/123')
        .send({
          description: updatedDesc
        })
      expect(res.statusCode).toBe(500)
      expect(res.body.message).toBe('Error updating Task with id=123')
    })
  })

  describe('DELETE /api/tasks/:id', () => {
    let record = null
    beforeAll(async () => {
      const resp = await request(app).post('/api/tasks').send(newEntry)
      record = resp.body
    })
    it('should delete a task', async () => {
      const res = await request(app).delete(
      `/api/tasks/${record.id}`
      )
      expect(res.statusCode).toBe(200)
    })
  })
})
