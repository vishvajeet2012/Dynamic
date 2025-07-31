const Order = require("../models/order");
const User = require('../models/authModel')
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
exports.placeOrder = async (req, res) => {

  try {
    const userId = req.user._id;
    const { shippingInfo, paymentMethod } = req.body;

    const user = await User.findById(userId)?.populate('cart.product')
    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }
    const orderItems = user.cart.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0]?.imagesUrls || '',
      price: item.product.sellingPrice,
      quantity: item.quantity,
      size: item.size,
      color: item.color


    }))
    const totalPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const order = await Order.create({
      user: userId,
      orderItems,
      shippingInfo,
      paymentMethod,
      totalPrice
    });
    const mailSent = {
      from: process.env.EMAIL_USER,
      to: user?.email,
      subject: "Order Succesfully",
      html: `
  <div style="max-width:700px;margin:0 auto;padding:20px;background-color:#fff;border:1px solid #e0e0e0;font-family:sans-serif;">
    <!-- Header -->
    <div style="background-color:#d32f2f;padding:25px;color:#fff;text-align:center;border-radius:5px 5px 0 0;">
      <h1 style="margin:0;font-size:24px;">🛒 Order Confirmation & Invoice</h1>
      <p style="margin:5px 0;font-size:14px;">Thank you for shopping with Your Store!</p>
    </div>

    <!-- Order Info -->
    <div style="padding:25px;color:#333;">
      <h2 style="font-size:20px;margin-bottom:10px;">Hello, ${user?.firstName} ${user?.lastName} 👋</h2>
      <p>We’re happy to let you know we’ve received your order and it’s being processed.</p>

      <!-- Shipping & Customer Info -->
      <h3 style="margin-top:30px;border-bottom:1px solid #ccc;padding-bottom:10px;">Customer & Shipping Info</h3>
      <p><strong>Email:</strong> ${user?.email}</p>
      <p><strong>Shipping Address:</strong> ${shippingInfo.fullAddress}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}</p>

      <!-- Order Items Table -->
      <h3 style="margin-top:30px;border-bottom:1px solid #ccc;padding-bottom:10px;">Order Summary</h3>
      <table width="100%" style="border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="background-color:#f8f8f8;">
            <th align="left" style="padding:10px;border:1px solid #ddd;">Product</th>
            <th align="center" style="padding:10px;border:1px solid #ddd;">Size</th>
            <th align="center" style="padding:10px;border:1px solid #ddd;">Color</th>
            <th align="center" style="padding:10px;border:1px solid #ddd;">Qty</th>
            <th align="right" style="padding:10px;border:1px solid #ddd;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${orderItems.map(item => `
            <tr>
              <td style="padding:10px;border:1px solid #ddd;">${item.name}</td>
              <td align="center" style="padding:10px;border:1px solid #ddd;">${item.size}</td>
              <td align="center" style="padding:10px;border:1px solid #ddd;">${item.color}</td>
              <td align="center" style="padding:10px;border:1px solid #ddd;">${item.quantity}</td>
              <td align="right" style="padding:10px;border:1px solid #ddd;">₹${item.price * item.quantity}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr style="background-color:#fafafa;">
            <td colspan="4" align="right" style="padding:10px;border:1px solid #ddd;"><strong>Total Amount:</strong></td>
            <td align="right" style="padding:10px;border:1px solid #ddd;"><strong>₹${totalPrice}</strong></td>
          </tr>
        </tfoot>
      </table>

      <!-- Payment Method -->
      <p><strong>Payment Method:</strong> ${paymentMethod}</p>

      <!-- Note -->
      <div style="margin-top:30px;padding:15px;background-color:#fffbe6;border-left:4px solid #ffeb3b;">
        <p style="margin:0;font-size:14px;"><strong>Note:</strong> You’ll receive another update once your order is shipped.</p>
      </div>

      <!-- Support -->
      <p style="margin-top:30px;font-size:14px;">Have questions? Contact us anytime at <a href="mailto:support@yourstore.com">support@yourstore.com</a></p>

      <!-- Thank You -->
      <div style="text-align:center;margin-top:40px;">
        <p style="font-size:16px;">❤️ Thank you for supporting Your Store!</p>
        <a href="https://yourstore.com/orders" 
           style="background-color:#d32f2f;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;margin-top:10px;">
          Track Your Order
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color:#f5f5f5;padding:15px;text-align:center;font-size:12px;color:#888;border-radius:0 0 5px 5px;">
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
      message: "order placed succesfully "
      , orderId: order?._id
    })


  } catch (error) {
    res.status(500).json({ message: "server error", error: error })

  }

}




exports.getUserOrder = async(req,res)=>{

  try{

        const orders  = await Order.find({user:req.user._id}).sort({placeAt:-1})
res.status(200).json({
  message:"user order fetch"
  ,orders
})
    
  }catch(error){
    res.status(500).json({message:"server error please try again "})
  }
}

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('firstName','lastName', ' email') // Optional: show user info
      .sort({ placedAt: -1 });

    res.status(200).json({
      message: "All orders fetched",
      orders
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};



/////////////////exprots update order status ///////////////////
exports.updateOrderStatus = async (req,res)=>{

try{
      const {orderId} = req.body
      const {status}= req.body
const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered']
if(!allowedStatuses.includes(status)){
  return res.status(400).json({message:"Invalied status value"})

}
const order = await Order.findById(orderId)
if(!order) return res.status(404).json({message:"order not found "})
  order.status=status
await Order.Save()
    res.status(200).json({ message: 'Order status updated', status: order.status });



}catch(error){
  res.ststus(500).json({message:"invald status value"})
}

}


