const { createUser, getAllUsers, getUserById } = require('../models/userModel');

const createUserController = async (req, res) => {
    try {
        const { username, email } = req.body; // Get username and email from the request body
        const newUser = await createUser(username, email); // Call the model function to create the user
        console.log("user created and stored!")
        res.status(201).json(newUser); // 201 Created - Send the created user back in the response
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).send('Error creating user'); // 500 Internal Server Error
    }
};

const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers(); // Call the model function to get all users
        res.status(200).json(users); // 200 OK - Send the users back in the response
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).send('Error fetching users'); // 500 Internal Server Error
    }
};

const getUserByIdController = async (req, res) => {
    const userId = req.params.id; // Get the user ID from the request parameters
    try {
        const user = await getUserById(userId); // Call the model function to get the user by ID
        res.status(200).json(user); // 200 OK - Send the user back in the response
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error.message);
        res.status(500).send(`Error fetching user with ID ${userId}`); // 500 Internal Server Error
    }
};

module.exports = { // Export the controller functions with different names.
    createUser: createUserController,
    getAllUsers: getAllUsersController,
    getUserById: getUserByIdController
};