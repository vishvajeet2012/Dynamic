const Order = require("../models/order");
const  User = require('../models/authModel')
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
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
                                    const order = await Order.create({
                                        user:userId,
                                        orderItems,
                                   shippingInfo,
      paymentMethod,
      totalPrice
    });
    const mailSent= {
            from:process.env.EMAIL_USER,
            to: user?.email,
            subject:"Order Succesfully",
            html:
            `
    <div style="max-width:600px;margin:0 auto;padding:20px;background-color:#ffffff;border:1px solid #e0e0e0;font-family:sans-serif;">
      <div style="background-color:#d32f2f;padding:20px 30px;color:#fff;text-align:center;">
        <h1 style="margin:0;">Thank You for Your Order!</h1>
      </div>

      <div style="padding:30px 20px;text-align:left;color:#333;">
        <p>Hi <strong>${user?.firstName || 'Customer'}</strong>,</p>

        <p>We're excited to let you know that we've successfully received your order. We'll notify you once it's shipped!</p>

        <div style="margin:30px 0;text-align:center;">
          <a href="https://yourstore.com/orders" 
            style="background-color:#d32f2f;color:#fff;padding:12px 24px;text-decoration:none;border-radius:5px;display:inline-block;">
            View Your Order
          </a>
        </div>

        <p>If you have any questions, feel free to reply to this email. We're here to help!</p>

        <p style="margin-top:30px;">Cheers,<br/><strong>Your Store Team</strong></p>
      </div>

      <div style="background-color:#f5f5f5;padding:15px;text-align:center;font-size:12px;color:#888;">
        © ${new Date().getFullYear()} Your Store. All rights reserved.
      </div>
    </div>
  `
            
          



    }
      
                        await transporter.sendMail(mailSent);
        


          
     
                        
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