const express = require('express');

const router = express.Router();

//  new router object to hold routes related to users.
const { getAllUsers } = require('../controllers/userController');
const{loginUser}=require('../controllers/loginUserController')
const { signupUserController } = require('../controllers/signupUserController');

// POST /users/signup -> handle user sign-up
router.post('/signup', signupUserController);
//get all users
router.get('/', getAllUsers);
//login logic from user
router.post('/login', loginUser);

module.exports = router;