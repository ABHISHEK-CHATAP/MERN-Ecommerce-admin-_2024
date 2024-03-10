import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  deleteProduct,
  getAdminProducts,
  getAllCategories,
  getSingleProduct,
  getlatestProduct,
  newProduct,
  searchProducts,
  updateProduct,
} from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

// Create New Products - /api/v1/product/new?id=jksds
app.post("/new", adminOnly, singleUpload, newProduct);

// To get last 5 products - /api/v1/product/latest
app.get("/latest", getlatestProduct);

// To get all unique Categories - /api/v1/product/categories
app.get("/categories", getAllCategories);

// To get all products - /api/v1/product/admin-products?id=jksds
app.get("/admin-products",adminOnly, getAdminProducts);

// To Search all Products with Filters - api/v1/product/all 
  app.get("/all", searchProducts); 
  
// To GET, UPDATE and DELETE Products
app
  .route("/:id")
  .get(getSingleProduct)
  .put(adminOnly, singleUpload, updateProduct)
  .delete(adminOnly, deleteProduct);


export default app;
