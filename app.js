const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "product", // e krijon 1 db me cfardo emri ktu ja len emrin e db
  connectionLimit: 10,
});

// Krijon route ku ki mi shtu products (post request)
app.post("/add-product", (req, res) => {
  const { product_title, product_description, product_price } = req.body;

  const insertProductQuery = `
      INSERT INTO products (product_title, product_description, product_price)
      VALUES (?, ?, ?);
    `;

  pool.query(
    insertProductQuery,
    [product_title, product_description, product_price],
    (err, result) => {
      if (err) {
        console.error(err); // Log the error
        res.status(500).json({ error: "Failed to add product." });
      } else {
        res.status(200).json({ message: "Product added successfully." });
      }
    }
  );
});

// endpoint per mi fetch produktet ne react
app.get("/get-products", (req, res) => {
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
