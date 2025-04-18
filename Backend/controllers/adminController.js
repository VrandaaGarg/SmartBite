const db = require('../db');


// 🟢 GET all dishes
const getAllDishes = async (req, res) => {
  try {
    const [dishes] = await db.promise().query("SELECT * FROM DISH");
    res.json(dishes);
  } catch (err) {
    console.error("Error fetching dishes:", err);
    res.status(500).json({ error: "Failed to fetch dishes" });
  }
};

// 🟢 ADD a new dish
const addDish = async (req, res) => {
  const { Name, Description, Price, Image, MenuID, Type } = req.body;
  try {
    const sql = `
      INSERT INTO DISH (Name, Description, Price, Image, MenuID, Type)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.promise().execute(sql, [Name, Description, Price, Image, MenuID, Type]);
    res.status(201).json({ message: "Dish added", dishId: result.insertId });
  } catch (err) {
    console.error("Error adding dish:", err);
    res.status(500).json({ error: "Failed to add dish" });
  }
};

// 🟢 UPDATE dish
const updateDish = async (req, res) => {
  const { id } = req.params;
  const { Name, Description, Price, Image, MenuID, Type } = req.body;
  try {
    const sql = `
      UPDATE DISH SET Name=?, Description=?, Price=?, Image=?, MenuID=?, Type=? WHERE DishID=?
    `;
    await db.promise().execute(sql, [Name, Description, Price, Image, MenuID, Type, id]);
    res.json({ message: "Dish updated" });
  } catch (err) {
    console.error("Error updating dish:", err);
    res.status(500).json({ error: "Failed to update dish" });
  }
};

// 🟢 DELETE dish
const deleteDish = async (req, res) => {
  const { id } = req.params;
  try {
    await db.promise().execute("DELETE FROM DISH WHERE DishID = ?", [id]);
    res.json({ message: "Dish deleted" });
  } catch (err) {
    console.error("Error deleting dish:", err);
    res.status(500).json({ error: "Failed to delete dish" });
  }
};

// 🟢 GET all orders with customer and dish details
// 🟢 GET all orders with full customer and dish details
const getAllOrders = async (req, res) => {
    try {
      const [orders] = await db.promise().query(`
        SELECT 
          o.OrderID,
          o.Amount AS TotalAmount,
          o.Discount,
          o.CreatedAt,
          c.CustomerID,
          c.Name AS CustomerName,
          c.Email AS CustomerEmail,
          c.Phone AS CustomerPhone,
          c.HouseNo, c.Street, c.Landmark, c.City, c.State, c.Pincode,
          d.DishID,
          d.Name AS DishName,
          d.Price AS DishPrice,
          oi.Quantity,
          oi.Amount AS DishTotal
        FROM ORDER_TABLE o
        JOIN CUSTOMER c ON o.CustomerID = c.CustomerID
        JOIN ORDER_ITEMS oi ON o.OrderID = oi.OrderID
        JOIN DISH d ON oi.DishID = d.DishID
        ORDER BY o.CreatedAt DESC
      `);
  
      const groupedOrders = {};
  
      for (const row of orders) {
        const {
          OrderID, CreatedAt, TotalAmount, Discount,
          CustomerID, CustomerName, CustomerEmail, CustomerPhone,
          HouseNo, Street, Landmark, City, State, Pincode,
          DishID, DishName, DishPrice, Quantity, DishTotal,
        } = row;
  
        const fullAddress = `${HouseNo || ''}, ${Street || ''}, ${Landmark || ''}, ${City || ''}, ${State || ''} - ${Pincode || ''}`.replace(/, ,/g, ',').trim();
  
        if (!groupedOrders[OrderID]) {
          groupedOrders[OrderID] = {
            OrderID,
            CreatedAt,
            TotalAmount,
            Discount,
            Customer: {
              CustomerID,
              Name: CustomerName,
              Email: CustomerEmail,
              Phone: CustomerPhone,
              Address: fullAddress,
            },
            Dishes: [],
          };
        }
  
        groupedOrders[OrderID].Dishes.push({
          DishID,
          Name: DishName,
          Price: DishPrice,
          Quantity,
          Total: DishTotal,
        });
      }
  
      res.json(Object.values(groupedOrders));
    } catch (err) {
      console.error("Error fetching full order details:", err);
      res.status(500).json({ error: "Failed to fetch full order details" });
    }
  };
  


// 🟢 GET all customers
const getAllCustomers = async (req, res) => {
  try {
    const [customers] = await db.promise().query("SELECT * FROM CUSTOMER");
    res.json(customers);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

module.exports = {
  getAllDishes,
  addDish,
  updateDish,
  deleteDish,
  getAllOrders,
  getAllCustomers,
};
