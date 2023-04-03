import express from 'express';
import { adminAllOrder, checkoutController, orderStatusUpdate, paymentVerification, searchAdminOrder, userOrderController } from '../controllers/paymentControllers.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router()

router.post('/checkout',checkoutController)
router.post('/payment-verification',requireSignIn,paymentVerification)
router.get('/all-order',requireSignIn,userOrderController)
router.get('/all-admin-order',requireSignIn,isAdmin,adminAllOrder)
router.put('/order-status/:orderId',requireSignIn,isAdmin,orderStatusUpdate)
router.post('/search-order',requireSignIn,isAdmin,searchAdminOrder)
router.get('/get-key',(req,res)=>{
    res.status(200).send({
        success:true,
        key:process.env.RAZORPAY_KEY_ID
    })
  })




export default router;