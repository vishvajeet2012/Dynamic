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
exports.updateUserData = async (req, res) => {
    const { firstName, lastName, email, city, state, address, pincode, profilePicture,mobileNumber,gender } = req.body;
    const userId = req.user._id;

    // Basic validation
    if (!userId) {
        return res.status(400).send({
            status: false, 
            message: "User ID is required"
        });
    }

    try {
        // Create update object with only the fields that are provided
        const updateFields = {};
        if (firstName !== undefined) updateFields.firstName = firstName;
        if (lastName !== undefined) updateFields.lastName = lastName;
        if (email !== undefined) updateFields.email = email;
        if (city !== undefined) updateFields.city = city;
        if (state !== undefined) updateFields.state = state;
        if (address !== undefined) updateFields.address = address;
        if (pincode !== undefined) updateFields.pincode = pincode;
        if (profilePicture !== undefined) updateFields.profilePicture = profilePicture;
        if (mobileNumber !== undefined) updateFields.mobileNumber = mobileNumber;
            if (gender !== undefined) updateFields.gender = gender;
        // If no valid fields to update
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).send({
                status: false, 
                message: "No valid fields provided for update"
            });
        }

        const updatedUser = await userAuthCollection.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        if (updatedUser) {
            res.status(200).send({
                data: updatedUser,
                status: true,
                message: "User data updated successfully"
            });
        } else {
            res.status(404).send({
                status: false, 
                message: "User not found"
            });
        }
    } catch (error) {
        console.error("Update error:", error);
        
        let errorMessage = "Server Error";
        if (error.name === 'ValidationError') {
            errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
            return res.status(400).send({
                status: false, 
                message: errorMessage
            });
        }
        
        res.status(500).send({
            status: false, 
            message: errorMessage
        });
    }
};


exports.updateUserProfilePicture = async(req,res)=>{
    const {profilePicture,publicId} =req.body
const userData = req.user._id
if(!profilePicture){
    res.status(400).send({
        status:false,
        message:"Profile picture is required "
    })
}
            try{
                const updateProfile  = await userAuthCollection.findByIdAndUpdate(userData,{profilePicture,originalId:publicId},{new:true}) 
                        if(updateProfile){
                            res.status(200).send({
                                data:updateProfile,
                                status:true,
                                message:"Profile picture updated successfully"
                            })
                        }else{
                            res.status(400).send({
                                status:false,
                                message:"User not found or update failed"
                            })
                        }
          
            }catch(error){
                res.status(500).send({
                    message:"server error",status:false
                })
            }
}