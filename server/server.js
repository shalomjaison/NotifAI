/* 
this file is responsible for launching our express server 
and mounting our router to the server to direct 
the HTTP requests to the API endpoints in the routes directory 
*/

const express = require('express');
const cors = require('cors');
const session = require('express-session'); // Import express-session
const userRoutes = require('./routes/userRoutes');
const { createUser: createUserController } = require('./controllers/userController'); // importing for mock post request
const sequelize = require('./db/db');
const User = require('./models/userModel');
const Notification = require('./models/notificationModel');
const NewsNotification = require('./models/newsModel');
const ClaimNotification = require('./models/claimModel');
const PolicyNotification = require('./models/policyModel');
const NotificationRecipient = require('./models/notificationRecipientModel');

const app = express();
app.use(cors({
    origin: 'http://localhost:9500', // Allow requests from your React app
    credentials: true, // Allow cookies to be sent
}));
app.use(express.json());

// Configure express-session middleware
app.use(session({
    secret: 'your_secret_key', // Replace with a strong, random secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, // Make the cookie only accessible via HTTP(S)
        secure: false, // Set to true in production (when using HTTPS)
        sameSite: 'Strict', // Prevent CSRF attacks
        maxAge: 1000 * 60 * 60 * 24, // Cookie expires after 1 day
    },
}));

const port = 3000;

app.get('/hello-world-demo', (req, res) => {
    console.log("/hello-world-demo get request received");
    res.send({ text: 'Hello from the backend123!' });
});


app.use('/users', userRoutes);


// Define the one-to-one relationships between base Notification and its types
NewsNotification.belongsTo(Notification, { foreignKey: 'notification_id' });
ClaimNotification.belongsTo(Notification, { foreignKey: 'notification_id' });
PolicyNotification.belongsTo(Notification, { foreignKey: 'notification_id' });
Notification.hasOne(NewsNotification, { foreignKey: 'notification_id' });
Notification.hasOne(ClaimNotification, { foreignKey: 'notification_id' });
Notification.hasOne(PolicyNotification, { foreignKey: 'notification_id' });

// Define the many-to-many relationship betw users and notifications using the relationship table
Notification.belongsToMany(User, 
    { through: NotificationRecipient, 
        foreignKey: 'notification_id',
        otherKey: 'recipient_id'
     });
User.belongsToMany(Notification, 
    { through: NotificationRecipient,
        foreignKey: 'recipient_id',
        otherKey: 'notification_id' 
    });

const createHardcodedUser = async () => {
    try {

        const existingUser = await User.findOne({ where: { fname:'John', lname:'Doe',username: 'john_doe', email: 'hello@gmail.com', role:'customer'} });
        if (!existingUser){
            const mockRequest = {
                body: {
                    fname:'John',
                    lname:'Doe',
                    username: 'john_doe',
                    email: 'test@gmail.com',
                    password: '123',
                    role:'customer',
                },
            };
                await createUserController(mockRequest);
                console.log("Mock post request for creating user sent successfully from server.js wahoo!")
            } else {
                console.log('User already exists in the database womp womp.');
            }
    } catch (error) {
        console.error('Error hardcoding user:', error);
    }
};
const viewUsers = async () => {
    try {
        const users = await User.findAll();
        console.log("📌 Current Users in Database:", JSON.stringify(users, null, 2));
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};



const startServer = async () => {
    try {
        await sequelize.sync( { force: true }); 
        await createHardcodedUser();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
        await viewUsers();
    } catch (error) {
        console.error("Error during server startup:", error);
    }
};

startServer();