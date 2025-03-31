// used for authenticating login sessions

const authMiddleware = (req, res, next) => {
    // Check if a session exists
    if (req.session && req.session.user) {
        // User is logged in, attach user data to the request
        req.user = req.session.user;
        console.log("User is logged in:", req.user.fname);
        next(); // Proceed to the next middleware or route handler
    } else {
        // No session found, user is not logged in
        console.log("User is not logged in");
        // Explicitly set the status to 401 and send a JSON response
        return res.status(401).json({ message: "Unauthorized: Please log in" });
    }
};

module.exports = authMiddleware;


