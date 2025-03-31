const User = require('../models/userModel'); // importing user model 
const bcrypt = require('bcrypt');

// creates new user and stores in database
const createUserController = async (req, res) => {
    try {
        const { fname, lname, username, email, password, role } = req.body; 
        // Check if the user already exists by email (or username, if you prefer)
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
        return res.status(400).json({ message: 'A user with this email already exists.' });
        }
        const hashedPassword = password.startsWith("$2b$") ? password : await bcrypt.hash(password, 12);
        const newUser = await User.create({ fname,lname,username, email,password:hashedPassword, role:role ||'customer', }); 
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