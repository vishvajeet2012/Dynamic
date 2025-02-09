const userAuthCollection = require("../models/authModel");
const bcrypt = require('bcryptjs');

exports.userRegister = async (req, res) => {
    try {
        const { firstName, lastName,DOB, email, password, interest } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const existingUser = await userAuthCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        const hash = await bcrypt.hash(password, 10);

        const userReg = new userAuthCollection({
            firstName,
            lastName,
            DOB,
            email,
            password: hash,  // Fixed password assignment
            interest
        });

        await userReg.save();
        res.status(200).json({ 
            message: "User registered successfully", 
          
        });

    } catch (err) {
        console.error("Registration error:", err);
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

        const token = user.genrateAuthToken();
        res.status(200).json({ message: "Login successful", token });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};