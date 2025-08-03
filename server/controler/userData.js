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
    const {
        addressId,
        firstName,
        lastName,
        email,
        city,
        state,
        address,
        pincode,
        profilePicture,
        mobileNumber,
        gender
    } = req.body;

    const userId = req.user._id;

    if (!userId) {
        return res.status(400).send({
            status: false,
            message: "User ID is required"
        });
    }

    try {
        const user = await userAuthCollection.findById(userId);
        if (!user) {
            return res.status(404).send({
                status: false,
                message: "User not found"
            });
        }

        // Prepare update fields
        const updateFields = {};
        if (firstName !== undefined) updateFields.firstName = firstName;
        if (lastName !== undefined) updateFields.lastName = lastName;
        if (email !== undefined) updateFields.email = email;
        if (profilePicture !== undefined) updateFields.profilePicture = profilePicture;
        if (mobileNumber !== undefined) updateFields.mobileNumber = mobileNumber;
        if (gender !== undefined) updateFields.gender = gender;

        // Handle address update
        if (address || city || state || pincode) {
            const addressObj = {
                fullAddress: address || '',
                city: city || '',
                state: state || '',
                pincode: pincode || '',
                label: 'home',
                isDefault: false
            };

            if (addressId) {
                // ✅ Update existing address
                const index = user.addresses.findIndex(addr => addr._id.toString() === addressId);
                if (index === -1) {
                    return res.status(404).send({
                        status: false,
                        message: `No address found with ID: ${addressId}`
                    });
                }

                // Replace only specific fields
                user.addresses[index].fullAddress = addressObj.fullAddress;
                user.addresses[index].city = addressObj.city;
                user.addresses[index].state = addressObj.state;
                user.addresses[index].pincode = addressObj.pincode;
            } else {
                // ✅ Add new address
                if (!user.addresses || user.addresses.length === 0) {
                    addressObj.isDefault = true;
                } else {
                    user.addresses.forEach(addr => (addr.isDefault = false));
                    addressObj.isDefault = true;
                }
                user.addresses.push(addressObj);
            }
        }

        // Apply profile updates
        Object.assign(user, updateFields);

        const updatedUser = await user.save();

        return res.status(200).send({
            status: true,
            message: "User data updated successfully",
            data: updatedUser
        });
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



// exports.updateUserData = async (req, res) => {
//     const {  addressId, firstName, lastName, email, city, state, address, pincode, profilePicture, mobileNumber, gender } = req.body;
//     const userId = req.user._id;
    
//     if (!userId) {
//         return res.status(400).send({
//             status: false,
//             message: "User ID is required"
//         });
//     }




//     try {
// if(addressId){

//     const user  = await userAuthCollection.findById(userId)
//           if (!user) {
//             return res.status(404).send({
//                 status: false,
//                 message: "User not found"
//             });
        
//         const addressUpdate = await userAuthCollection.findByIdAndUpdate({addresses:addressId})
//         if(!addressUpdate){
//             return res.status(404).send({status:false,message:`not address found from this is ${addressId}`})
//         }
                
//     }

// }else{



//         const updateFields = {};
//         if (firstName !== undefined) updateFields.firstName = firstName;
//         if (lastName !== undefined) updateFields.lastName = lastName;
//         if (email !== undefined) updateFields.email = email;
//         if (profilePicture !== undefined) updateFields.profilePicture = profilePicture;
//         if (mobileNumber !== undefined) updateFields.mobileNumber = mobileNumber;
//         if (gender !== undefined) updateFields.gender = gender;

//         const user = await userAuthCollection.findById(userId);
//         if (!user) {
//             return res.status(404).send({
//                 status: false,
//                 message: "User not found"
//             });
//         }

//         // Handle address
//         if (city || state || address || pincode) {
//             const addressObj = {
//                 fullAddress: address || '',
//                 city: city || '',
//                 state: state || '',
//                 pincode: pincode || '',
//                 label: 'home',
//                 isDefault: false // will update below
//             };

//             if (!Array.isArray(user.addresses) || user.addresses.length === 0) {
//                 user.addresses = [];
//                 addressObj.isDefault = true;
//             } else {
//                 // Unset previous default
//                 user.addresses.forEach(addr => (addr.isDefault = false));
//                 addressObj.isDefault = true;
//             }

//             user.addresses.push(addressObj);
//         }

//         // Update remaining fields
//         Object.assign(user, updateFields);

//         const updatedUser = await user.save();

//         return res.status(200).send({
//             data: updatedUser,
//             status: true,
//             message: "User data updated successfully"
//         });}
//     } catch (error) {
//         console.error("Update error:", error);

//         let errorMessage = "Server Error";
//         if (error.name === 'ValidationError') {
//             errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
//             return res.status(400).send({
//                 status: false,
//                 message: errorMessage
//             });
//         }

//         res.status(500).send({
//             status: false,
//             message: errorMessage
//         });
//     }
// };




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