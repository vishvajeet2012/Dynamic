const Router = require('express').Router();
const { userRegister, userLogin } = require('../../controler/authControler');
const { CreateCategory } = require('../../controler/categoryControler');
const auth = require('../../middleware/authmiddleware');

const { getUser, updateUserProfilePicture, updateUserData } = require('../../controler/userData');
Router.post('/userSignup', userRegister);
Router.post('/userFound', userLogin);
Router.get('/getsingleuser',auth,getUser)

Router.post('/updateprofile',auth,updateUserProfilePicture)
Router.post('/userdataupdate',auth,updateUserData)

module.exports = Router;