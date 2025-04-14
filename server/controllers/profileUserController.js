const User = require('../models/userModel');

const getUserProfileController = async(req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: Please log in" });
        }
        const { email } = req.session.user;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { username, fname, lname, role } = user;
        return res.status(200).json({
            username,
            fname,
            lname,
            email,
            role
          });
    } catch (err) {
        console.error("Failed to get profile:", err);
        res.status(500).json({ message: "Server error" });
      }
};


module.exports = {
    getUserProfile: getUserProfileController
};