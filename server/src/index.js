import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'tasks.json');

const app = express();
const PORT = process.env.PORT || 5174; // avoid clashing with Vite default 5173

app.use(cors());
app.use(express.json());

// Root endpoint - API info
app.get('/', (req, res) => {
  res.json({
    name: 'To-Do Management API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      tasks: {
        list: 'GET /api/tasks',
        create: 'POST /api/tasks',
        update: 'PUT /api/tasks/:id',
        delete: 'DELETE /api/tasks/:id'
      }
    },
    message: 'API is running. Visit http://localhost:5173 for the web interface.'
  });
});

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

function readTasks() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read tasks:', e);
    return [];
  }
}

function writeTasks(tasks) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// List tasks with optional filtering via query params
app.get('/api/tasks', (req, res) => {
  const tasks = readTasks();
  const { q, status } = req.query;
  let filtered = tasks;
  if (q) {
    const needle = String(q).toLowerCase();
    filtered = filtered.filter(
      (t) => t.title.toLowerCase().includes(needle) || (t.description || '').toLowerCase().includes(needle)
    );
  }
  if (status === 'active' || status === 'completed') {
    const done = status === 'completed';
    filtered = filtered.filter((t) => !!t.completed === done);
  }
  res.json(filtered);
});

// Create task
app.post('/api/tasks', (req, res) => {
  const { title, description = '', dueDate = null, priority = 'medium', category = '' } = req.body || {};
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required' });
  }
  const tasks = readTasks();
  const now = new Date().toISOString();
  const task = {
    id: nanoid(),
    title: title.trim(),
    description: String(description || ''),
    completed: false,
    dueDate: dueDate || null,
    priority: priority || 'medium',
    category: category || undefined,
    createdAt: now,
    updatedAt: now
  };
  tasks.push(task);
  writeTasks(tasks);
  res.status(201).json(task);
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, completed, dueDate, priority, category } = req.body || {};
  const tasks = readTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  const existing = tasks[idx];
  const updated = {
    ...existing,
    title: typeof title === 'string' ? title : existing.title,
    description: typeof description === 'string' ? description : existing.description,
    completed: typeof completed === 'boolean' ? completed : existing.completed,
    dueDate: typeof dueDate === 'string' || dueDate === null ? dueDate : existing.dueDate,
    priority: typeof priority === 'string' ? priority : existing.priority,
    category: typeof category === 'string' ? (category || undefined) : existing.category,
    updatedAt: new Date().toISOString()
  };
  tasks[idx] = updated;
  writeTasks(tasks);
  res.json(updated);
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const tasks = readTasks();
  const next = tasks.filter((t) => t.id !== id);
  if (next.length === tasks.length) return res.status(404).json({ error: 'Task not found' });
  writeTasks(next);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
