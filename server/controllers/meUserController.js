// this controller is responsible for sending data of the currently logged in user

const meUserController = (req, res) => {
    if (req.session && req.session.user) {
        // User is logged in, send back user data
        return res.status(200).json({ user: req.session.user });
    } else {
        // No session found, user is not logged in
        return res.status(401).json({ message: "Unauthorized: Please log in" });
    }
};

module.exports = {
    meUser: meUserController,
};
