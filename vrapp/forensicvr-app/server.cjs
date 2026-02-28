const express = require('express')
const cors = require('cors')
const crypto = require('crypto')

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// In-memory storage (persists while server is running)
let objects = []

// GET all objects
app.get('/api/objects', (req, res) => {
  res.json(objects)
})

// POST new object
app.post('/api/objects', (req, res) => {
  const newObject = {
    id: crypto.randomUUID(),
    ...req.body,
    createdAt: new Date().toISOString()
  }
  objects.unshift(newObject)
  res.json(newObject)
})

// DELETE object
app.delete('/api/objects/:id', (req, res) => {
  objects = objects.filter(o => o.id !== req.params.id)
  res.json({ success: true })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`CrimeLens backend running on http://localhost:${PORT}`)
})
