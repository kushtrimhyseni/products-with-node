const express = require("express");
const multer = require("multer");
const mysql = require("mysql");
const router = express.Router();

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "product",
  connectionLimit: 10,
});

router.post("/add-product", upload.single("product_image"), (req, res) => {
  const { product_title, product_description, product_price } = req.body;
  const product_image = req.file.filename;

  const insertProductQuery = `
      INSERT INTO products (product_title, product_description, product_price, product_image)
      VALUES (?, ?, ?, ?);
    `;

  pool.query(
    insertProductQuery,
    [product_title, product_description, product_price, product_image],
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

module.exports = router;
