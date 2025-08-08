const Order = require("../models/order");
const User = require('../models/authModel')
const nodemailer = require("nodemailer");
const order = require("../models/order");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
// exports.placeOrder = async (req, res) => {

//   try {
//     const userId = req.user._id;
//     const {shippingInfo:datas
//  } = req.body;
//  const {shippingInfo   ,paymentMethod}=datas
// console.log(shippingInfo)
//     const user = await User.findById(userId)?.populate('cart.product')
//     if (!user || user.cart.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" })
//     }
//     const orderItems = user.cart.map(item => ({
//       product: item.product._id,
//       name: item.product.name,
//       image: item.product.images?.[0]?.imagesUrls || '',
//       price: item.product.sellingPrice,
//       quantity: item.quantity,
//       size: item.size,
//       color: item.color


//     }))
//     console.log(shippingInfo)
//     const totalPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
//     const order = await Order.create({
//       user: userId,
//       orderItems,
//       shippingInfo,
//       paymentMethod,
//       totalPrice
//     });
//     const mailSent = {
//       from: process.env.EMAIL_USER,
//       to: user?.email,
//       subject: "Order Succesfully",
//       html: `
//   <div style="max-width:700px;margin:0 auto;padding:20px;background-color:#fff;border:1px solid #e0e0e0;font-family:sans-serif;">
//     <!-- Header -->
//     <div style="background-color:#d32f2f;padding:25px;color:#fff;text-align:center;border-radius:5px 5px 0 0;">
//       <h1 style="margin:0;font-size:24px;">🛒 Order Confirmation & Invoice</h1>
//       <p style="margin:5px 0;font-size:14px;">Thank you for shopping with Your Store!</p>
//     </div>

//     <!-- Order Info -->
//     <div style="padding:25px;color:#333;">
//       <h2 style="font-size:20px;margin-bottom:10px;">Hello, ${user?.firstName} ${user?.lastName} 👋</h2>
//       <p>We’re happy to let you know we’ve received your order and it’s being processed.</p>

//       <!-- Shipping & Customer Info -->
//       <h3 style="margin-top:30px;border-bottom:1px solid #ccc;padding-bottom:10px;">Customer & Shipping Info</h3>
//       <p><strong>Email:</strong> ${user?.email}</p>
//       <p><strong>Shipping Address:</strong> ${shippingInfo.fullAddress}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}</p>

//       <!-- Order Items Table -->
//       <h3 style="margin-top:30px;border-bottom:1px solid #ccc;padding-bottom:10px;">Order Summary</h3>
//       <table width="100%" style="border-collapse:collapse;margin-bottom:20px;">
//         <thead>
//           <tr style="background-color:#f8f8f8;">
//             <th align="left" style="padding:10px;border:1px solid #ddd;">Product</th>
//             <th align="center" style="padding:10px;border:1px solid #ddd;">Size</th>
//             <th align="center" style="padding:10px;border:1px solid #ddd;">Color</th>
//             <th align="center" style="padding:10px;border:1px solid #ddd;">Qty</th>
//             <th align="right" style="padding:10px;border:1px solid #ddd;">Price</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${orderItems.map(item => `
//             <tr>
//               <td style="padding:10px;border:1px solid #ddd;">${item.name}</td>
//               <td align="center" style="padding:10px;border:1px solid #ddd;">${item.size}</td>
//               <td align="center" style="padding:10px;border:1px solid #ddd;">${item.color}</td>
//               <td align="center" style="padding:10px;border:1px solid #ddd;">${item.quantity}</td>
//               <td align="right" style="padding:10px;border:1px solid #ddd;">₹${item.price * item.quantity}</td>
//             </tr>
//           `).join('')}
//         </tbody>
//         <tfoot>
//           <tr style="background-color:#fafafa;">
//             <td colspan="4" align="right" style="padding:10px;border:1px solid #ddd;"><strong>Total Amount:</strong></td>
//             <td align="right" style="padding:10px;border:1px solid #ddd;"><strong>₹${totalPrice}</strong></td>
//           </tr>
//         </tfoot>
//       </table>

//       <!-- Payment Method -->
//       <p><strong>Payment Method:</strong> ${paymentMethod}</p>

//       <!-- Note -->
//       <div style="margin-top:30px;padding:15px;background-color:#fffbe6;border-left:4px solid #ffeb3b;">
//         <p style="margin:0;font-size:14px;"><strong>Note:</strong> You’ll receive another update once your order is shipped.</p>
//       </div>

//       <!-- Support -->
//       <p style="margin-top:30px;font-size:14px;">Have questions? Contact us anytime at <a href="mailto:support@yourstore.com">support@yourstore.com</a></p>

//       <!-- Thank You -->
//       <div style="text-align:center;margin-top:40px;">
//         <p style="font-size:16px;">❤️ Thank you for supporting Your Store!</p>
//         <a href="https://yourstore.com/orders" 
//            style="background-color:#d32f2f;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;margin-top:10px;">
//           Track Your Order
//         </a>
//       </div>
//     </div>

//     <!-- Footer -->
//     <div style="background-color:#f5f5f5;padding:15px;text-align:center;font-size:12px;color:#888;border-radius:0 0 5px 5px;">
//       © ${new Date().getFullYear()} Your Store. All rights reserved.
//     </div>
//   </div>
// `






//     }

//     await transporter.sendMail(mailSent);






//     // Clear user cart
//     user.cart = [];
//     await user.save()
//     res.status(201).json({
//       message: "order placed succesfully "
//       , orderId: order?._id
//     })


//   } catch (error) {
//     res.status(500).json({ message: "server error", error: error })

//   }

// }


const stripe = require('stripe')("sk_test_51RqzXoF7zcR2ir3BlaqMuZiWodaIjY53vczC2HN79utsMEOcBkWEZYP0EWDJdgQJ9SCQhxnAbfMF8hj5DDTGCeO600izpdfZxb"); 


// Create Payment Intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amount, currency = 'inr' } = req.body;

    console.log('Creating payment intent for amount:', amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid amount" 
      });
    }

    const user = await User.findById(userId).populate('cart.product');
    if (!user || user.cart.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Cart is empty" 
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paisa
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: userId.toString(),
        timestamp: new Date().toISOString()
      },
      description: `Order payment for user ${user.firstName} ${user.lastName}`,
      receipt_email: user.email,
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Payment intent creation failed:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create payment intent", 
      error: error.message 
    });
  }
};

// Updated Place Order Controller
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    
    console.log('Raw request body:', JSON.stringify(req.body, null, 2));
    
    // Handle different payload formats
    let shippingInfo, paymentMethod, orderItems, itemsPrice, shippingPrice, totalPrice, paymentResult;
    
    // Check if it's the old COD format
    if (req.body.shippingInfo && typeof req.body.shippingInfo === 'object' && req.body.shippingInfo.shippingInfo) {
      // Old COD format: { shippingInfo: { shippingInfo: {...}, paymentMethod: "cod" } }
      console.log('Using COD format');
      const datas = req.body.shippingInfo;
      shippingInfo = datas.shippingInfo;
      paymentMethod = datas.paymentMethod;
      orderItems = null; // Will use cart items
      itemsPrice = null; // Will calculate from cart
      shippingPrice = 0;
      totalPrice = null; // Will calculate from cart
      paymentResult = null;
    } else {
      // New Stripe format: direct properties
      console.log('Using Stripe format');
      ({
        shippingInfo,
        paymentMethod,
        orderItems,
        itemsPrice,
        shippingPrice,
        totalPrice,
        paymentResult
      } = req.body);
    }

    console.log('Parsed data:', { paymentMethod, totalPrice, itemsPrice });

    // Get user data
    const user = await User.findById(userId).populate('cart.product');
    if (!user || user.cart.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Cart is empty" 
      });
    }

    // Validate payment method
    if (!['cod', 'stripe'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method"
      });
    }

    // For Stripe payments, verify the payment
    if (paymentMethod === 'stripe') {
      if (!paymentResult || !paymentResult.id) {
        return res.status(400).json({
          success: false,
          message: "Payment verification failed - missing payment result"
        });
      }

      // Verify payment intent with Stripe
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentResult.id);
        
        if (paymentIntent.status !== 'succeeded') {
          return res.status(400).json({
            success: false,
            message: "Payment not completed"
          });
        }

        // Verify amount matches (convert totalPrice to paisa for comparison)
        const expectedAmount = Math.round(totalPrice * 100);
        if (paymentIntent.amount !== expectedAmount) {
          console.log('Amount mismatch:', { 
            expected: expectedAmount, 
            received: paymentIntent.amount,
            totalPrice: totalPrice
          });
          return res.status(400).json({
            success: false,
            message: "Payment amount mismatch"
          });
        }

      } catch (stripeError) {
        console.error('Stripe verification error:', stripeError);
        return res.status(400).json({
          success: false,
          message: "Payment verification failed"
        });
      }
    }

    // Prepare order items from cart or provided data
    let finalOrderItems;
    if (orderItems && orderItems.length > 0) {
      // Use provided order items (from frontend)
      finalOrderItems = orderItems;
    } else {
      // Fallback to cart items (COD format)
      finalOrderItems = user.cart.map(item => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0]?.imagesUrls || '',
        price: item.product.sellingPrice,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      }));
    }

    // Calculate totals
    const calculatedItemsPrice = finalOrderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const finalItemsPrice = itemsPrice || calculatedItemsPrice;
    const finalShippingPrice = shippingPrice || (finalItemsPrice > 500 ? 0 : 50);
    const finalTotalPrice = totalPrice || (finalItemsPrice + finalShippingPrice);

    // Create order in database
    const orderData = {
      user: userId,
      orderItems: finalOrderItems,
      shippingInfo,
      paymentMethod,
      totalPrice: finalTotalPrice,
      itemsPrice: finalItemsPrice,
      shippingPrice: finalShippingPrice,
      isPaid: paymentMethod === 'stripe',
      paidAt: paymentMethod === 'stripe' ? new Date() : undefined,
    };

    // Add payment result for Stripe orders
    if (paymentMethod === 'stripe' && paymentResult) {
      orderData.paymentResult = {
        id: paymentResult.id,
        status: paymentResult.status,
        update_time: paymentResult.update_time || new Date().toISOString(),
        email_address: paymentResult.email_address || user.email
      };
    }

    const order = await Order.create(orderData);

    // Send confirmation email (your existing email code here)
    // ... email sending code

    // Clear user cart
    user.cart = [];
    await user.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: order._id,
      order: {
        _id: order._id,
        orderItems: order.orderItems,
        shippingInfo: order.shippingInfo,
        paymentMethod: order.paymentMethod,
        totalPrice: order.totalPrice,
        isPaid: order.isPaid,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Order placement error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};


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
      .populate('user', 'firstName lastName email') // Optional: show user info
      .sort({ placedAt: -1 });

    res.status(200).json({
      message: "All orders fetched",
      orders
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};


exports.getOrderbyId = async (req,res)=>{
  const {orderId} = req.body
  console.log(orderId)

      try{
          ////get order form here or by id 
        if(!orderId){
          return res.status(404).json({message:"no order id find "})
        }
            const OrderC = await order.findById(orderId)
            if(!OrderC){
              return  res.status(404).json({message:"order not found " ,status:false})

            }
           
             res.status(201).json({message:"Thank you for purchase" ,data:OrderC ,status:true})
          

          


      }catch(error){
        res.status(500).json({message:"Internal server Errror ",error:error})

      }

}


/////////////////exprots update order status ///////////////////



exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    

    if (!orderId || !status) {
      return res.status(400).json({ 
        message: "OrderId and status are required" 
      });
    }
    
    const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status value. Allowed values: " + allowedStatuses.join(', ') 
      });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        message: "Order not found" 
      });
    }
    const userNumber = order?.shippingInfo?.phoneNo
    const userId =order?.user
    console.log(userId)
const user = await User.findOne(userId);
console.log(user)


    // Update the status
    order.status = status;
    
    await order.save();
if (order.status === "Shipped") {
  const mailSent = {
    from: process.env.EMAIL_USER,
    to: user?.email,
    subject: "🚚 Your Order Has Been Shipped - The V Store!",
    html: `
      <div style="max-width:600px;margin:auto;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#ffffff;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
        
        <!-- Header with Logo -->
        <div style="background:linear-gradient(135deg, #dc2626, #b91c1c);color:white;text-align:center;padding:30px 20px;position:relative;">
          <img src="https://res.cloudinary.com/dkcc4frdi/image/upload/v1751125393/progoruoiovchkxdnpip.png" alt="The V Store Logo" style="max-width:120px;height:auto;filter:brightness(0) invert(1);margin-bottom:15px;" />
          <h1 style="font-size:28px;font-weight:bold;margin:10px 0;text-shadow:2px 2px 4px rgba(0,0,0,0.3);">The V Store</h1>
          <h2 style="font-size:24px;margin:0;display:flex;align-items:center;justify-content:center;gap:10px;">
            <span style="font-size:30px;">🚚</span> Your Order Has Been Shipped!
          </h2>
        </div>

        <!-- Main Content -->
        <div style="padding:30px 20px;">
          <p style="font-size:18px;margin-bottom:20px;color:#374151;">Hello ${order?.shippingInfo?.email || 'Valued Customer'},</p>
          <p style="font-size:16px;margin-bottom:30px;color:#6b7280;line-height:1.7;">We're excited to let you know that your order has been shipped and is on its way to you! Thank you for choosing The V Store.</p>
          
          <!-- Order Details Section -->
          <h3 style="color:#dc2626;font-size:20px;font-weight:bold;margin:30px 0 15px 0;padding-bottom:8px;border-bottom:2px solid #dc2626;display:flex;align-items:center;gap:10px;">
            <span>📦</span> Order Details
          </h3>
          
          <div style="background:linear-gradient(135deg, #fef2f2, #ffffff);border:1px solid #fecaca;border-radius:8px;padding:20px;margin:20px 0;">
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #fee2e2;">
              <span style="font-weight:600;color:#dc2626;">Shipping Address:</span>
              <span style="color:#374151;text-align:right;max-width:60%;">${order.shippingInfo.fullAddress}, ${order.shippingInfo.city}, ${order.shippingInfo.state} - ${order.shippingInfo.pincode}, ${order.shippingInfo.country}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #fee2e2;">
              <span style="font-weight:600;color:#dc2626;">Phone:</span>
              <span style="color:#374151;">${order.shippingInfo.phoneNo || 'N/A'}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #fee2e2;">
              <span style="font-weight:600;color:#dc2626;">Payment Method:</span>
              <span style="color:#374151;">${order.paymentMethod}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;">
              <span style="font-weight:600;color:#dc2626;">Status:</span>
              <span style="color:#10b981;font-weight:bold;">${order.status}</span>
            </div>
          </div>

          <!-- Order Summary Section -->
          <h3 style="color:#dc2626;font-size:20px;font-weight:bold;margin:30px 0 15px 0;padding-bottom:8px;border-bottom:2px solid #dc2626;display:flex;align-items:center;gap:10px;">
            <span>🛍️</span> Order Summary
          </h3>
          
          <div style="background:#ffffff;border:1px solid #fecaca;border-radius:8px;overflow:hidden;margin:20px 0;">
            <table width="100%" style="border-collapse:collapse;">
              <thead>
                <tr style="background:linear-gradient(135deg, #dc2626, #b91c1c);color:#ffffff;">
                  <th align="left" style="padding:15px 12px;font-weight:600;">Product</th>
                  <th align="center" style="padding:15px 8px;font-weight:600;">Size</th>
                  <th align="center" style="padding:15px 8px;font-weight:600;">Color</th>
                  <th align="center" style="padding:15px 8px;font-weight:600;">Qty</th>
                  <th align="right" style="padding:15px 12px;font-weight:600;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.orderItems.map((item, index) => `
                  <tr style="border-bottom:1px solid #fee2e2;${index % 2 === 0 ? 'background:#fef2f2;' : 'background:#ffffff;'}">
                    <td style="padding:12px;color:#374151;font-weight:500;">${item.name}</td>
                    <td align="center" style="padding:12px;color:#6b7280;">${item.size}</td>
                    <td align="center" style="padding:12px;color:#6b7280;">${item.color}</td>
                    <td align="center" style="padding:12px;color:#6b7280;font-weight:600;">${item.quantity}</td>
                    <td align="right" style="padding:12px;color:#dc2626;font-weight:600;">₹${item.quantity * item.price}</td>
                  </tr>
                `).join('')}
                <tr style="background:linear-gradient(135deg, #fef2f2, #ffffff);border-top:2px solid #dc2626;">
                  <td colspan="4" align="right" style="padding:15px 12px;font-weight:bold;color:#374151;font-size:16px;">Total Amount:</td>
                  <td align="right" style="padding:15px 12px;font-weight:bold;color:#dc2626;font-size:18px;">₹${order.totalPrice}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- CTA Button -->
          <div style="text-align:center;margin:40px 0;">
            <a href="https://thevstore.com/orders" style="display:inline-block;background:linear-gradient(135deg, #dc2626, #b91c1c);color:#ffffff;padding:15px 30px;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;box-shadow:0 4px 12px rgba(220,38,38,0.3);transition:all 0.3s ease;">
              🔍 Track Your Order
            </a>
          </div>

          <!-- Footer Message -->
          <div style="text-align:center;margin-top:40px;padding-top:30px;border-top:1px solid #fee2e2;">
            <p style="font-size:16px;color:#374151;margin-bottom:10px;">Thank you for shopping with <strong style="color:#dc2626;">The V Store</strong>!</p>
            <p style="font-size:14px;color:#9ca3af;">We appreciate your business and hope you love your purchase.</p>
          </div>

          <!-- Copyright -->
          <div style="text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid #fee2e2;">
            <p style="font-size:12px;color:#9ca3af;">&copy; ${new Date().getFullYear()} The V Store. All rights reserved.</p>
          </div>
        </div>
      </div>

      <!-- Mobile Responsive Styles -->
      <style>
        @media only screen and (max-width: 600px) {
          .email-container { width: 100% !important; margin: 0 !important; }
          .content { padding: 20px 15px !important; }
          .header { padding: 20px 15px !important; }
          .company-name { font-size: 24px !important; }
          .shipping-title { font-size: 20px !important; }
          .section-header { font-size: 18px !important; }
          .order-details { padding: 15px !important; }
          .detail-item { flex-direction: column; align-items: flex-start !important; }
          .detail-value { text-align: left !important; margin-top: 5px; }
          table th, table td { padding: 8px 4px !important; font-size: 12px !important; }
          .cta-button { padding: 12px 24px !important; font-size: 14px !important; }
        }
      </style>
    `
  };

  await transporter.sendMail(mailSent);
}
if (order.status === "Delivered") {
  const mailSent = {
    from: process.env.EMAIL_USER,
    to: user?.email,
    subject: "🎉 Your Order Has Been Delivered - The V Store!",
    html: `
      <div style="max-width:600px;margin:auto;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#ffffff;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
        
        <!-- Header with Logo -->
        <div style="background:linear-gradient(135deg, #dc2626, #b91c1c);color:white;text-align:center;padding:30px 20px;position:relative;">
          <img src="https://res.cloudinary.com/dkcc4frdi/image/upload/v1751125393/progoruoiovchkxdnpip.png" alt="The V Store Logo" style="max-width:120px;height:auto;filter:brightness(0) invert(1);margin-bottom:15px;" />
          <h1 style="font-size:28px;font-weight:bold;margin:10px 0;text-shadow:2px 2px 4px rgba(0,0,0,0.3);">The V Store</h1>
          <h2 style="font-size:24px;margin:0;display:flex;align-items:center;justify-content:center;gap:10px;">
            <span style="font-size:30px;">🎉</span> Order Delivered Successfully!
          </h2>
        </div>

        <!-- Main Content -->
        <div style="padding:30px 20px;">z
          
          <!-- Celebration Message -->
          <div style="text-align:center;background:linear-gradient(135deg, #fef2f2, #ffffff);border:1px solid #fecaca;border-radius:12px;padding:25px;margin-bottom:30px;">
            <div style="font-size:48px;margin-bottom:15px;">📦✨</div>
            <p style="font-size:20px;color:#dc2626;font-weight:bold;margin-bottom:10px;">Great News, ${order?.shippingInfo?.fullName || 'Valued Customer'}!</p>
            <p style="font-size:16px;color:#374151;line-height:1.6;">Your package has been successfully delivered on <strong style="color:#dc2626;">${new Date().toLocaleDateString('en-IN')}</strong></p>
          </div>

          <!-- Delivery Details Section -->
          <h3 style="color:#dc2626;font-size:20px;font-weight:bold;margin:30px 0 15px 0;padding-bottom:8px;border-bottom:2px solid #dc2626;display:flex;align-items:center;gap:10px;">
            <span>📋</span> Delivery Details
          </h3>
          
          <div style="background:linear-gradient(135deg, #fef2f2, #ffffff);border:1px solid #fecaca;border-radius:8px;padding:20px;margin:20px 0;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:12px 0;border-bottom:1px solid #fee2e2;">
              <span style="font-weight:600;color:#dc2626;min-width:120px;">Delivered To:</span>
              <span style="color:#374151;text-align:right;flex:1;margin-left:15px;">${order.shippingInfo.fullAddress}, ${order.shippingInfo.city}, ${order.shippingInfo.state} - ${order.shippingInfo.pincode}, ${order.shippingInfo.country}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #fee2e2;">
              <span style="font-weight:600;color:#dc2626;">Contact Phone:</span>
              <span style="color:#374151;">${order.shippingInfo.phoneNo || 'N/A'}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:12px 0;">
              <span style="font-weight:600;color:#dc2626;">Delivery Date:</span>
              <span style="color:#10b981;font-weight:bold;">${new Date().toLocaleDateString('en-IN')}</span>
            </div>
          </div>

          <!-- Items Received Section -->
          <h3 style="color:#dc2626;font-size:20px;font-weight:bold;margin:30px 0 15px 0;padding-bottom:8px;border-bottom:2px solid #dc2626;display:flex;align-items:center;gap:10px;">
            <span>🛍️</span> Items You Received
          </h3>
          
          <div style="background:#ffffff;border:1px solid #fecaca;border-radius:8px;overflow:hidden;margin:20px 0;">
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;min-width:500px;">
                <thead>
                  <tr style="background:linear-gradient(135deg, #dc2626, #b91c1c);color:#ffffff;">
                    <th align="left" style="padding:15px 12px;font-weight:600;font-size:14px;">Product</th>
                    <th align="center" style="padding:15px 8px;font-weight:600;font-size:14px;">Size</th>
                    <th align="center" style="padding:15px 8px;font-weight:600;font-size:14px;">Color</th>
                    <th align="center" style="padding:15px 8px;font-weight:600;font-size:14px;">Qty</th>
                    <th align="right" style="padding:15px 12px;font-weight:600;font-size:14px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.orderItems.map((item, index) => `
                    <tr style="border-bottom:1px solid #fee2e2;${index % 2 === 0 ? 'background:#fef2f2;' : 'background:#ffffff;'}">
                      <td style="padding:12px;color:#374151;font-weight:500;">${item.name}</td>
                      <td align="center" style="padding:12px;color:#6b7280;">${item.size}</td>
                      <td align="center" style="padding:12px;color:#6b7280;">${item.color}</td>
                      <td align="center" style="padding:12px;color:#6b7280;font-weight:600;">${item.quantity}</td>
                      <td align="right" style="padding:12px;color:#dc2626;font-weight:600;">₹${item.price * item.quantity}</td>
                    </tr>
                  `).join('')}
                </tbody>
                <tfoot>
                  <tr style="background:linear-gradient(135deg, #fef2f2, #ffffff);border-top:2px solid #dc2626;">
                    <td colspan="4" align="right" style="padding:15px 12px;font-weight:bold;color:#374151;font-size:16px;">Total Amount:</td>
                    <td align="right" style="padding:15px 12px;font-weight:bold;color:#dc2626;font-size:18px;">₹${order.totalPrice}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div style="text-align:center;margin:40px 0;">
            <a href="https://thevstore.com/review" style="display:inline-block;background:linear-gradient(135deg, #f59e0b, #d97706);color:#ffffff;padding:15px 25px;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;margin:10px;box-shadow:0 4px 12px rgba(245,158,11,0.3);transition:all 0.3s ease;">
              ⭐ Leave a Review
            </a>
            <a href="https://thevstore.com/orders" style="display:inline-block;background:linear-gradient(135deg, #dc2626, #b91c1c);color:#ffffff;padding:15px 25px;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;margin:10px;box-shadow:0 4px 12px rgba(220,38,38,0.3);transition:all 0.3s ease;">
              📦 View All Orders
            </a>
          </div>

          <!-- Thank You Message -->
          <div style="text-align:center;background:linear-gradient(135deg, #fef2f2, #ffffff);border:1px solid #fecaca;border-radius:8px;padding:25px;margin:30px 0;">
            <p style="font-size:18px;color:#dc2626;font-weight:600;margin-bottom:10px;">Thank you for choosing The V Store!</p>
            <p style="font-size:16px;color:#374151;line-height:1.6;">We hope you love your purchase. Your satisfaction is our priority, and we look forward to serving you again soon!</p>
          </div>

          <!-- Footer -->
          <div style="text-align:center;margin-top:40px;padding-top:30px;border-top:1px solid #fee2e2;">
            <p style="font-size:12px;color:#9ca3af;margin-bottom:15px;">
              &copy; ${new Date().getFullYear()} The V Store. All rights reserved.
            </p>
            <div style="font-size:11px;color:#9ca3af;">
              <a href="https://thevstore.com/privacy" style="color:#9ca3af;text-decoration:none;margin:0 8px;">Privacy Policy</a> |
              <a href="https://thevstore.com/terms" style="color:#9ca3af;text-decoration:none;margin:0 8px;">Terms of Service</a> |
              <a href="https://thevstore.com/contact" style="color:#9ca3af;text-decoration:none;margin:0 8px;">Contact Us</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Responsive Styles -->
      <style>
        @media only screen and (max-width: 600px) {
          .email-container { width: 100% !important; margin: 0 !important; }
          .content { padding: 20px 15px !important; }
          .header { padding: 20px 15px !important; }
          .company-name { font-size: 24px !important; }
          .celebration-message { font-size: 18px !important; }
          .section-header { font-size: 18px !important; }
          .delivery-details { padding: 15px !important; }
          .detail-item { flex-direction: column !important; align-items: flex-start !important; text-align: left !important; }
          .detail-value { margin-top: 5px !important; margin-left: 0 !important; }
          .table-container { overflow-x: auto !important; }
          table { font-size: 12px !important; }
          table th, table td { padding: 8px 4px !important; }
          .cta-buttons a { display: block !important; margin: 10px auto !important; width: 80% !important; }
          .footer-links { display: block !important; }
          .footer-links a { display: block !important; margin: 5px 0 !important; }
        }
        
        @media only screen and (max-width: 480px) {
          .celebration-icon { font-size: 36px !important; }
          .celebration-title { font-size: 18px !important; }
          .celebration-text { font-size: 14px !important; }
          table th, table td { padding: 6px 2px !important; font-size: 11px !important; }
          .cta-buttons a { padding: 12px 20px !important; font-size: 14px !important; }
        }
      </style>
    `
  };

  await transporter.sendMail(mailSent);
}
    res.status(200).json({ 
      message: 'Order status updated successfully', 
      order: {
        _id: order._id,
        status: order.status,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    
    // More specific error handling
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: "Invalid order ID format" 
      });
    }
    
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};


// exports.updateOrderStatus = async (req,res)=>{

// try{
//       const {orderId,status} = req.body
//    console.log(status)
// const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered']
// if(!allowedStatuses.includes(status)){
//   return res.status(400).json({message:"Invalied status value"})

// }
// const order = await Order.findById(orderId)
// if(!order) return res.status(404).json({message:"order not found "})
//   order.status=status
// await Order.Save()
//     res.status(200).json({ message: 'Order status updated', status: order.status });



// }catch(error){
//   res.status(500).json({message:"invald status value"})
// }

// }