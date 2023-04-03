import { instance } from "../server.js";
import crypto from "crypto";
import OrderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";

export const checkoutController = async (req, res) => {
  var options = {
    amount: Number(req.body.amount * 100), // amount in the smallest currency unit
    currency: "INR",
  };
  const order = await instance.orders.create(options);
  res.status(200).send({
    success: true,
    order,
  });
};

export const paymentVerification = (req, res) => {
  const { payment_id, order_id, signature, cart, tot } = req.body;

  const body = order_id + "|" + payment_id;

  const userId = req.user._id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const orderController = async () => {
    try {
      const userOrder = await new OrderModel({
        products: cart,
        payment_id: payment_id,
        order_id: order_id,
        signature: signature,
        totalPrice: tot,
        buyer: userId,
      }).save();
      await cartModel.deleteMany({});
      return userOrder;
    } catch (error) {
      error;
    }
  };
  if (signature === expectedSignature) {
    const userOrder = orderController();
    res.status(200).send({
      success: true,
      userOrder,
    });
  } else {
    res.status(205).send({
      success: false,
      message: "Unauthorized Order",
    });
  }
};

export const userOrderController = async (req, res) => {
  try {
    const orders = await OrderModel.find({ buyer: req.user._id });
    res.status(200).send({
      success: true,
      message: "Your all orders",
      orders,
    });
  } catch (error) {
    res.status(205).send({
      success: false,
      message: "Error while fetching Your all orders",
      error,
    });
  }
};
export const adminAllOrder = async (req, res) => {
  try {
    const orders = await OrderModel.find({}).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Your all orders",
      orders,
    });
  } catch (error) {
    res.status(205).send({
      success: false,
      message: "Error while fetching Your all orders",
      error,
    });
  }
};

export const orderStatusUpdate = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Status Update Successfully",
      order,
    });
  } catch (error) {
    res.status(205).send({
      success: false,
      message: "Error while updating Status",
      error,
    });
  }
};

export const searchAdminOrder = async (req, res) => {
  try {
    const { searchKey, searchValue } = req.body;
    const order = await OrderModel.find({ [searchKey]: searchValue });
    res.status(200).send({
      success: true,
      message: "Status Update Successfully",
      order,
    });
  } catch (error) {
    res.status(205).send({
      success: false,
      message: "Error while updating Status",
      error,
    });
  }
};
