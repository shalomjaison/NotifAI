const express = require('express');

const router = express.Router();

//  new router object to hold routes related to users.
const { createUser, getAllUsers, getUserById } = require('../controllers/userController');

//create a user
router.post('/', createUser);

//get all users
router.get('/', getAllUsers);

//get a user by id
router.get('/:id', getUserById);

module.exports = router;