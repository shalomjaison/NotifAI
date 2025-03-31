const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const signupUserController = async (req, res) => {
  try {
    const {
      fname,
      lname,
      username,
      email,
      password,
      role, // optional defaults to being a customer otherwise
    } = req.body;

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    // If the password is not hashed yet, hash it
    const hashedPassword = password.startsWith('$2b$')
      ? password
      : await bcrypt.hash(password, 12);

    // Create a new user record
    const newUser = await User.create({
      fname,
      lname,
      username,
      email,
      password: hashedPassword,
      role: role || 'customer', // default to 'user' if no role specified
    });

    console.log('New user created via signupUserController!', newUser.toJSON());
    
    

    // Respond with some basic user info (excluding the password hash)
    return res.status(201).json({
      message: 'Sign up successful',
      user: {
        id: newUser.id,
        fname: newUser.fname,
        lname: newUser.lname,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Error signing up user:', error);
    return res.status(500).json({ error: 'Failed to sign up user.' });
  }
};

module.exports = { signupUserController };