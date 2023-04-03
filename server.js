// packages import 
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import cors from 'cors'
import Razorpay from "razorpay";
import connectDB from "./Config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoute from "./routes/productRoutes.js";
import cartRoute from "./routes/cartRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import path from 'path'


// rest object
const app = express();

// configuration environment
dotenv.config();

// configuration DATABASE
connectDB();

export const instance = new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET
})

// middleWares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'./client/build')))

// Accessing Environment variables
const PORT = process.env.PORT || 8080;
const Mode = process.env.MODE;

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/payment", paymentRoutes);

// Rest api
app.use('*',function(req,res){
  res.sendFile(path.join(__dirname,"*./client/build/index.html"));
})

app.get('/api/get-key',(req,res)=>{
  res.status(200).send({
      success:true,
      key:process.env.RAZORPAY_KEY_ID
  })
})

// Server listening
app.listen(PORT);
