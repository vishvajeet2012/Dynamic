const userAuthCollection = require("../models/authModel");
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Helper function to send OTP email
const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Account Verification',
        html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
  

  <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center; position: relative;">
    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg></div>
    <img src="https://res.cloudinary.com/dkcc4frdi/image/upload/v1751125393/progoruoiovchkxdnpip.png" alt="Company Logo" style="max-width: 120px; height: auto; filter: brightness(0) invert(1); position: relative; z-index: 1;" />
    <h1 style="color: #ffffff; margin: 20px 0 0 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; position: relative; z-index: 1;">Account Verification</h1>
  </div>

 
  <div style="padding: 50px 40px; background: #ffffff;">
    
  
    <div style="text-align: center; margin-bottom: 40px;">
      <h2 style="color: #1f2937; font-size: 24px; font-weight: 600; margin: 0 0 15px 0; line-height: 1.3;">Welcome aboard! 🚀</h2>
      <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0;">Thank you for registering with us. We're excited to have you on board!</p>
    </div>

  
    <div style="background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%); border: 2px solid #fee2e2; border-radius: 16px; padding: 35px; margin: 30px 0; text-align: center; position: relative; overflow: hidden;">
      <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: radial-gradient(circle, rgba(220,38,38,0.1) 0%, transparent 70%); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -30px; left: -30px; width: 60px; height: 60px; background: radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 70%); border-radius: 50%;"></div>
      
      <div style="position: relative; z-index: 1;">
        <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0; font-weight: 500;">Your verification code is:</p>
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: #ffffff; padding: 20px 30px; margin: 20px 0; font-size: 32px; font-weight: 800; letter-spacing: 8px; text-align: center; border-radius: 12px; box-shadow: 0 8px 25px rgba(220,38,38,0.3); font-family: 'Courier New', monospace;">
          ${otp}
        </div>
        <p style="color: #6b7280; font-size: 14px; margin: 15px 0 0 0;">Enter this code to complete your verification</p>
      </div>
    </div>
    <div style="background: #f9fafb; border-left: 4px solid #dc2626; padding: 20px 25px; margin: 30px 0; border-radius: 8px;">
      <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
        <div style="width: 20px; height: 20px; background: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <span style="color: #ffffff; font-size: 12px; font-weight: bold;">⏱</span>
        </div>
        <p style="color: #374151; font-size: 15px; margin: 0; font-weight: 500;">This code expires in <strong style="color: #dc2626;">10 minutes</strong></p>
      </div>
    </div>

    
    <div style="background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
      <h3 style="color: #374151; font-size: 18px; font-weight: 600; margin: 0 0 15px 0;">Security Notice</h3>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">If you didn't request this verification code, please ignore this email. Your account security is important to us.</p>
    </div>

  </div>
  <div style="background: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="color: #9ca3af; font-size: 13px; margin: 0 0 10px 0;">Need help? Contact our support team</p>
    <div style="margin: 15px 0;">
      <span style="display: inline-block; width: 30px; height: 2px; background: #dc2626; margin: 0 5px;"></span>
      <span style="display: inline-block; width: 15px; height: 2px; background: #fca5a5; margin: 0 5px;"></span>
      <span style="display: inline-block; width: 8px; height: 2px; background: #fecaca; margin: 0 5px;"></span>
    </div>
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2025 TheVStore. All rights reserved.</p>
  </div>

</div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
};

// exports.userRegister = async (req, res) => {
//     try {
//         const { firstName, lastName, email, password } = req.body;
        
//         if (!firstName || !lastName || !email || !password) {
//             return res.status(400).json({ message: "All fields are required" });
//         }
        
//         const existingUser = await userAuthCollection.findOne({ email });
//          if (existingUser) {
//             if (!existingUser.isVerified) {
//                 // Delete unverified user
//                 await userAuthCollection.deleteOne({ email });
//             } else {
//                 return res.status(400).json({ message: "Email is already registered." });
//             }
//         }


//         const hash = await bcrypt.hash(password, 10);
//         const user = new userAuthCollection({
//             firstName,
//             lastName,
//             email,
//             password: hash,
//         });

//         // Generate OTP
//         const otp = user.generateOTP();
//         await user.save();

//         // Send OTP email
//         const emailSent = await sendOTPEmail(email, otp);
//         if (!emailSent) {
//             return res.status(500).json({ message: "Failed to send OTP email" });
//         }

//         res.status(200).json({ 
//             status: 200,
//             message: "User registered successfully. Please check your email for OTP.", 
//             data:{
//                 firstName,
//                 lastName,
//                 email,
//                 password:"password "
//             }
//         });

//     } catch (err) {
//         console.error("Registration error:", err);
//         return res.status(500).json({ status: 500, message: "Internal server error" });
//     }
// };




exports.userRegister = async (req, res) => {
    try {
        const { firstName, lastName, email, password, guestToken } = req.body;
        
        // Check required fields
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // Check for existing user
        const existingUser = await userAuthCollection.findOne({ email });
        
        // Handle guest conversion if guestToken provided
        if (guestToken) {
            const guestUser = await userAuthCollection.findOne({ 
                guestToken,
                isGuest: true 
            });
            
            if (!guestUser) {
                return res.status(400).json({ message: "Invalid guest session" });
            }
            
            // Convert guest to regular user
            guestUser.firstName = firstName;
            guestUser.lastName = lastName;
            guestUser.email = email;
            guestUser.password = await bcrypt.hash(password, 10);
            guestUser.isGuest = false;
            guestUser.guestToken = undefined;
            
            // Generate OTP
            const otp = guestUser.generateOTP();
            await guestUser.save();
            
            // Send OTP email
            await sendOTPEmail(email, otp);
            
            return res.status(200).json({ 
                message: "Account created successfully. Please verify your email.",
                isGuestConversion: true
            });
        }
        
        // Rest of your existing registration logic...
    } catch (err) {
        // Error handling
    }
};






exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await userAuthCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user is already verified
        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified" });
        }

        // Check if OTP matches and is not expired
        if (user?.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Mark user as verified and clear OTP fields
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // Generate JWT token
        const token = user.generateAuthToken();

        res.status(200).json({ status:200,
            message: "Account verified successfully",
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isVerified: user.isVerified
            }
        });

    } catch (err) {
        console.error("OTP verification error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await userAuthCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user is already verified
        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified" });
        }

        // Generate new OTP
        const otp = user.generateOTP();
        await user.save();

        // Send OTP email
        const emailSent = await sendOTPEmail(email, otp);
        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send OTP email" });
        }

        res.status(200).json({ 
            message: "New OTP sent successfully. Please check your email.",
            email
        });

    } catch (err) {
        console.error("Resend OTP error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};



exports.userLogin = async (req, res) => {
    console.log(req.body, "this is login");
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required", status: 400 });
        }   
        const user = await userAuthCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found, please register first", status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials", status: 400 });
        }
         const token = user.generateAuthToken();
       
        res.status(200).json({ message: "Login successful", token });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.forgotPassword = async (req, res) => {
    try {
        
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ 
                status: 400,
                message: "Email is required" 
            });
        }

        const user = await userAuthCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                status: 404,
                message: "User not found with this email" 
            });
        }

        // Generate OTP
        const otp = user.generateOTP();
        await user.save();

        // Send OTP email
        const emailSent = await sendOTPEmail(email, otp);
        if (!emailSent) {
            return res.status(500).json({ 
                status: 500,
                message: "Failed to send OTP email" 
            });
        }

        res.status(200).json({ 
            status: 200,
            message: "OTP sent successfully. Please check your email.",
            email
        });

    } catch (err) {
        console.error("Forgot password error:", err);
        return res.status(500).json({ 
            status: 500,
            message: "Internal server error" 
        });
    }
};

exports.verifyForgotPasswordOTP = async (req, res) => {
    try {
        const { email,otp, newPassword, confirmPassword } = req.body;
       
        
        if (!email || !otp || !newPassword || !confirmPassword) {
            return res.status(400).json({ 
                status: 400,
                message: "All fields are required" 
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ 
                status: 400,
                message: "Password and confirm password do not match" 
            });
        }

        const user = await userAuthCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                status: 404,
                message: "User not found" 
            });
        }

        // Check if OTP matches and is not expired
        if (user?.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ 
                status: 400,
                message: "Invalid or expired OTP" 
            });
        }

        // Update password
        const hash = await bcrypt.hash(newPassword, 10);
        user.password = hash;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ 
            status: 200,
            message: "Password reset successfully",
            email
        });

    } catch (err) {
        console.error("Forgot password OTP verification error:", err);
        return res.status(500).json({ 
            status: 500,
            message: "Internal server error" 
        });
    }
};


// exports.createGuestUser = async (req, res) => {

//     try {
//         // Generate a unique guest identifier
//         const guestToken = require('crypto').randomBytes(32).toString('hex');
        
//         // Create guest user in database
//         const guestUser = new userAuthCollection({
//             isGuest: true,
//             guestToken: guestToken,
//             guestExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
//             // You can add other default fields if needed
//         });
//    const token = user.generateAuthToken();
//         await guestUser.save();

//         // Return guest token to client
//         res.status(200).json({
//             status: 200,
//             message: "Guest session created",
//             guestToken: token,
//             guestUserId: guestUser._id
//         });

//     } catch (err) {
//         console.error("Guest user creation error:", err);
//         return res.status(500).json({ 
//             status: 500, 
//             message: "Internal server error" 
//         });
//     }
// };

exports.createGuestUser = async (req, res) => {
    try {
        // Generate a unique guest identifier
        const guestToken = require('crypto').randomBytes(32).toString('hex');
        
        // Create guest user in database
        const guestUser = new userAuthCollection({
            isGuest: true,
            guestToken: guestToken,
            guestExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
            // You can add other default fields if needed
        });

        await guestUser.save();

        // Generate authentication token
        const token = guestUser.generateAuthToken();

        // Return guest token to client
        res.status(200).json({
            status: 200,
            message: "Guest session created",
            token: token,  // Changed from guestToken to token for clarity
            guestUserId: guestUser._id,
            isGuest: true  // Explicitly indicate this is a guest user
        });

    } catch (err) {
        console.error("Guest user creation error:", err);
        return res.status(500).json({ 
            status: 500, 
            message: "Internal server error" 
        });
    }
};