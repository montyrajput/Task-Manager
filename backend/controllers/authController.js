// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { run, get } = require('../config/db');

const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').optional()
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const generateToken = (user) => {
  // include minimal user info in token
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

exports.register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, password, role } = value;

    // check existing
    const existing = await get('SELECT * FROM users WHERE username = ?', [username]);
    if (existing) return res.status(400).json({ message: 'Username already taken' });

    const hashed = await bcrypt.hash(password, 10);
    const { lastID } = await run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashed, role || 'user']);

    const user = { id: lastID, username, role: role || 'user' };
    const token = generateToken(user);

    return res.status(201).json({ user, token });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, password } = value;
    const userRow = await get('SELECT * FROM users WHERE username = ?', [username]);
    if (!userRow) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, userRow.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const user = { id: userRow.id, username: userRow.username, role: userRow.role };
    const token = generateToken(user);

    return res.json({ user, token });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
