const express = require('express')
const cors = require('cors')
const Database = require('better-sqlite3')
const { v4: uuidv4 } = require('uuid')

const app = express()
const db = new Database('forensicvr.db')

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Create objects table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS objects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    shape TEXT,
    estimatedSize TEXT,
    color TEXT,
    material TEXT,
    forensicRelevance TEXT,
    imageUrl TEXT,
    createdAt TEXT
  )
`)

// GET all objects
app.get('/api/objects', (req, res) => {
  const objects = db.prepare('SELECT * FROM objects ORDER BY createdAt DESC').all()
  res.json(objects)
})

// POST new object
app.post('/api/objects', (req, res) => {
  const obj = { id: uuidv4(), ...req.body }
  db.prepare(`INSERT INTO objects VALUES (
    @id, @name, @description, @shape, @estimatedSize,
    @color, @material, @forensicRelevance, @imageUrl, @createdAt
  )`).run(obj)
  res.json(obj)
})

// DELETE object
app.delete('/api/objects/:id', (req, res) => {
  db.prepare('DELETE FROM objects WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

app.listen(3001, '0.0.0.0', () => {
  console.log('CrimeLens backend running on port 3001')
})
