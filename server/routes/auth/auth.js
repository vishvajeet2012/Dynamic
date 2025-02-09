const Router = require('express').Router();
const { userRegister, userLogin } = require('../../controler/authControler');

Router.post('/register', userRegister);
Router.post('/userFound', userLogin)
module.exports = Router;