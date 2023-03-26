const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "product",
  connectionLimit: 10,
});

router.get("/get-products", (req, res) => {
  const fetchProductsQuery = "SELECT * FROM products";

  pool.query(fetchProductsQuery, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch products." });
    } else {
      res.status(200).json(results);
    }
  });
});

module.exports = router;
