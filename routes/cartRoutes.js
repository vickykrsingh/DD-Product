import express from "express";
import { cartController, deleteCart, getAllCart } from "../controllers/cartController.js";

const router = express.Router()

router.post('/add-to-cart',cartController)
router.get('/get-all-cart',getAllCart)
router.post('/delete-single-cart',deleteCart)


export default router;