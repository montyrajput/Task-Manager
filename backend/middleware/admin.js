// backend/middleware/admin.js

/**
 * Admin middleware
 * - Assumes `protect` ran earlier and set `req.user`
 * - If you want to re-check role from DB (more strict), see the commented example below
 */

const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};

module.exports = admin;

/* Optional stricter variant (uncomment & adapt if you want to verify role from DB):

const { get } = require('../config/db');

const admin = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });

  try {
    const userRow = await get('SELECT role FROM users WHERE id = ?', [req.user.id]);
    if (!userRow) return res.status(401).json({ message: 'Not authorized' });
    if (userRow.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    next();
  } catch (err) {
    console.error('admin middleware error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = admin;
*/
