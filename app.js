const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require("multer");

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

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "product",
  connectionLimit: 10,
});

app.post("/add-product", upload.single("product_image"), (req, res) => {
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
