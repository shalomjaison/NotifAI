// this controller is responsible for deleting the login session when the user clicks "sign out" button

const logoutUserController = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ message: "Failed to log out" });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: "Logout successful" });
    });
};

module.exports = {
    logoutUser: logoutUserController,
};
