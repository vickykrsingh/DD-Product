import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    productId:{
        type:mongoose.ObjectId,
        required:true
    },
    categoryId:{
        type:mongoose.ObjectId,
        required:true
    },
    pName:{
        type:String,
        required:true
    },
    pDescription:{
        type:String,
        required:true
    },
    pPrice:{
        type:Number,
        required:true
    },
    pQuantity:{
        type:Number,
        required:true
    },
    pShipping:{
        type:String,
        required:true
    },
    pSlug:{
        type:String,
        required:true
    },
})

export default mongoose.model('cartItem',CartSchema)