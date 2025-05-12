const express = require('express');

const router = express.Router();

//  new router object to hold routes related to users.
const { getAllUsers, checkUsername } = require('../controllers/userController');
const{loginUser}=require('../controllers/loginUserController');
const {logoutUser} = require('../controllers/logoutUserController'); // Import the logout controller
const authMiddleware = require('../middleware/authMiddleware');
const { meUser } = require('../controllers/meUserController'); // Import the meUserController
const { getUserProfile } = require('../controllers/profileUserController');

const { signupUserController } = require('../controllers/signupUserController');

// POST /users/signup -> handle user sign-up
router.post('/signup', signupUserController);
//get all users
router.get('/', authMiddleware, getAllUsers); // auth middleware executed before getAllUsers
//login logic from user
router.post('/login', loginUser);
//logout logic from user
router.post('/logout', logoutUser); // Add the logout route
//get current user
router.get('/me', authMiddleware, meUser); 
// Get Current User Profile
router.get('/profile', getUserProfile);
// Check if the username exists
router.get('/exists/:username', checkUsername);

module.exports = router;
