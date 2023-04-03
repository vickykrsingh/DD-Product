import cartModel from "../models/cartModel.js"



export const cartController = async (req,res) => {
    try {
        const { _id , name , description , price , quantity , category , shipping , slug } = req.body;

        const cartItem = await new cartModel({
            productId:_id,
            categoryId:category,
            pName:name,
            pDescription:description,
            pPrice:price,
            pQuantity:quantity,
            pShipping:shipping,
            pSlug:slug,
        }).save()
        res.status(200).send({
            success:true,
            message:'product added to card successfully',
            cartItem
        })

    } catch (error) {
        res.status(205).send({
            success:false,
            message:'Error while added to cart.',
            error
        })
    }
}


export const getAllCart = async (req,res) => {
    try {
        const cartItem = await cartModel.find({})
        res.status(200).send({
            cartItem
        })
    } catch (error) {
        res.status(205).send({
            success:false,
            message:"Error while fetching cart item",
            error
        })
    }
}

export const deleteCart = async (req,res) => {
    try {
        const {id} = req.body;
        await cartModel.findByIdAndDelete(id)
        res.send({
            success:true,
            message:'Item deleted successfully.'
        })
    } catch (error) {
        res.status(200).send({
            success:false,
            message:"Error while deleting cart item."
        })
    }
}