const order = require("../models/order");
const User =requrie("../models/authModel.js")


exports.placeOrder = async (req, res) => {

    try{
    const userId = req.user._id;
    const { shippingInfo, paymentMethod } = req.body;

                const user = await User.findById(userId)?.populate('cart.product')
                if(!user || user.cart.length ===0){
                    return res.status(400).json({message:"Cart is empty"})
                }
                        const orderItems = user.cart.map(item=>({
                                product:item.product._id,
                                 name: item.product.name,
      image: item.product.images?.[0]?.imagesUrls || '',
      price: item.product.sellingPrice,
      quantity: item.quantity,
      size: item.size,
      color: item.color


                        }))         
                            const totalPrice =orderItems.reduce ((acc,item)=>acc+item.price *item.quantity,0)
                                    const order = await order.create({
                                        user:userId,
                                        orderItems,
                                   shippingInfo,
      paymentMethod,
      totalPrice
    });
                        
                 // Clear user cart
    user.cart = [];
    await user.save()   
                    res.status(201).json({
                        message:"order placed succesfully "
                        ,orderId:order?._id
                    })


    }catch(error){
            res.status(500).json({message:"server error",error:error})

    }












}