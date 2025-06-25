const userAuthCollection = require("../models/authModel");
const bcrypt = require('bcryptjs');




exports.getUser= async (req, res) => {
    
        try {
            const user = await userAuthCollection.findById(req.user._id).select("-password");   /// select is use for hide key from data retrive 
            res.json(user);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    };