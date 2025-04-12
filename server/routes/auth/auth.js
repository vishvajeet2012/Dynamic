const Router = require('express').Router();
const { userRegister, userLogin } = require('../../controler/authControler');
const { CreateCategory } = require('../../controler/categoryControler');
Router.post('/userSignup', userRegister);
Router.post('/userFound', userLogin);

module.exports = Router;