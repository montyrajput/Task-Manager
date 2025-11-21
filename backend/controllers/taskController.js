
const Joi = require('joi');
const { run, get, all } = require('../config/db');

const createSchema = Joi.object({
  title: Joi.string().min(1).required(),
  description: Joi.string().allow('', null),
  status: Joi.string().valid('pending', 'inprogress', 'done').default('pending')
});

exports.createTask = async (req, res) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, description, status } = value;
    const createdBy = req.user.id;

    const { lastID } = await run(
      'INSERT INTO tasks (title, description, status, createdBy) VALUES (?, ?, ?, ?)',
      [title, description || '', status, createdBy]
    );

    const task = await get('SELECT * FROM tasks WHERE id = ?', [lastID]);
    return res.status(201).json({ task });
  } catch (err) {
    console.error('createTask error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    const status = (req.query.status || "").trim(); 
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    const where = [];
    const params = [];

    
    if (req.user.role !== "admin") {
      where.push("createdBy = ?");
      params.push(req.user.id);
    }

    
    if (search) {
      where.push("LOWER(tasks.title) LIKE ?");
      params.push("%" + search.toLowerCase() + "%");
    }

    
    if (status) {
      where.push("tasks.status = ?");
      params.push(status);
    }

    const whereSQL = where.length ? "WHERE " + where.join(" AND ") : "";

    
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM tasks
      ${whereSQL}
    `;
    const countRow = await get(countQuery, params);
    const total = countRow?.total || 0;

    
    const query = `
      SELECT tasks.*, users.username AS ownerName
      FROM tasks
      LEFT JOIN users ON tasks.createdBy = users.id
      ${whereSQL}
      ORDER BY createdAt DESC
      LIMIT ? OFFSET ?
    `;

    const fetchParams = [...params, limit, offset];
    const tasks = await all(query, fetchParams);

    return res.json({ tasks, total });
  } catch (err) {
    console.error("getTasks error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await get('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    
    if (req.user.role !== 'admin' && task.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return res.json({ task });
  } catch (err) {
    console.error('getTaskById error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await get('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ message: 'Task not found' });

    
    if (req.user.role !== 'admin' && existing.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    await run('UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?', [
      value.title,
      value.description || '',
      value.status,
      id
    ]);

    const task = await get('SELECT * FROM tasks WHERE id = ?', [id]);
    return res.json({ task });
  } catch (err) {
    console.error('updateTask error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await get('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ message: 'Task not found' });

    
    if (req.user.role !== 'admin' && existing.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await run('DELETE FROM tasks WHERE id = ?', [id]);
    return res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('deleteTask error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
