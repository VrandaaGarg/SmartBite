const db = require('../db');

const getAllMenus = async (req, res) => {
  try {
    const [menus] = await db.promise().query('SELECT * FROM MENU');
    res.json(menus);
  } catch (err) {
    console.error('Error fetching menus:', err);
    res.status(500).json({ error: 'Failed to fetch menus' });
  }
};

module.exports = {
  getAllMenus,
};
