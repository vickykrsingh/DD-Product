import express from "express";
import formidable from "express-formidable";
import {
  createProductController,
  deleteProductController,
  getAllProductController,
  getSingleProductController,
  perPageProduct,
  photoController,
  productFilter,
  searchProductController,
  similarProduct,
  totalProduct,
  updateProductController,
} from "../controllers/productControllers.js";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";

const router = express.Router();

// Route for Created product for admin
router.post(
  "/create-product",
  formidable(),
  requireSignIn,
  isAdmin,
  createProductController
);
// Route for get all product for any one who is signIn or not , admin or not.
router.get("/get-product", getAllProductController);
// Route for get a single product on the basis of slug no signIn require no admin require.
router.get("/get-product/:id", getSingleProductController);
// Route for getting product photo
router.get("/product-photo/:pid", photoController);
// Route for deleting product
router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  deleteProductController
);
// Route for update product
router.put(
  "/update-product/:pid",
  formidable(),
  requireSignIn,
  isAdmin,
  updateProductController
);
// Filter Product
router.post("/product-filter", productFilter);
// count Product
router.get("/product-count", totalProduct);
// per page list product
router.get("/product-list/:page", perPageProduct);
// Search product
router.get("/search/:keyword", searchProductController);
// Similar product
router.get("/similar-product/:pId/:cId", similarProduct);

export default router;
