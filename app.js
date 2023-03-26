const express = require("express");
const cors = require("cors");
const addProduct = require("./routes/addProduct");
const getProducts = require("./routes/getProducts");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/products", addProduct);
app.use("/api", getProducts);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
