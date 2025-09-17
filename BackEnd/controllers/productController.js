const { poolPromise } = require("../config/db");

exports.getAllProducts = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT p.ProductID, p.Name, p.Price, p.Image, p.DiscountPercent, c.CategoryName,
             ps.Size, ps.Stock
      FROM Products p
      JOIN Categories c ON p.CategoryID = c.CategoryID
      LEFT JOIN ProductSizes ps ON p.ProductID = ps.ProductID
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
