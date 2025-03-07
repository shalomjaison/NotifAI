const User = require('../models/userModel'); // importing user model 

// creates new user and stores in database
const createUserController = async (req, res) => {
    try {
        const { username, email } = req.body; 
        const newUser = await User.create({ username, email }); 
        console.log("User created and stored via createUserController wahoo!")
    } catch (error) {
        console.error('Error creating user:', error.message);

    }
};

// fetches all users from database
const getAllUsersController = async (req, res) => {
    try {
        const users = await User.findAll(); 
        res.status(200).json(users); 
    } catch (error) {
        console.error('Error fetching users:', error.message);
    }
};


module.exports = { // Export the controller functions with different names.
    createUser: createUserController,
    getAllUsers: getAllUsersController,
};