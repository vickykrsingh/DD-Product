import express from "express";
import {
  createCategoryController,
  updateCategoryController,
  getAllCategory,
  getSingleCategory,
  deleteCategory,
} from "./../controllers/categoryController.js";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);
router.get("/get-all-category", getAllCategory);
router.get("/get-single-category/:slug", getSingleCategory);
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategory);

export default router;
