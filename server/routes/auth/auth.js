const Router = require('express').Router();
const { userRegister, userLogin, verifyOTP, resendOTP, forgotPassword, verifyForgotPasswordOTP, createGuestUser } = require('../../controler/authControler');
const { CreateCategory } = require('../../controler/categoryControler');
const auth = require('../../middleware/authmiddleware');

const { getUser, updateUserProfilePicture, updateUserData } = require('../../controler/userData');
const { productDelete } = require('../../controler/Productcontroler');
Router.post('/userSignup', userRegister);
Router.post('/userFound', userLogin);
Router.get('/getsingleuser',auth,getUser)
Router.post('/verifyotp', verifyOTP);
Router.post('/resendotp',resendOTP);
Router.post("/forgetPassword",forgotPassword)
Router.post("/verifyotppass",verifyForgotPasswordOTP)

//s//guest
Router.post("/createGuestUser",createGuestUser)


Router.post('/updateprofile',auth,updateUserProfilePicture)
Router.post('/userdataupdate',auth,updateUserData)


module.exports = Router;