/*
this file is responsible for launching our express server
and mounting our router to the server to direct
the HTTP requests to the API endpoints in the routes directory
*/

const express = require('express');
const cors = require('cors');
const session = require('express-session'); // Import express-session
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const genAIRoutes = require('./routes/genAIRoutes');
const { createUser: createUserController } = require('./controllers/userController'); // importing for mock post request
const sequelize = require('./db/db');
const User = require('./models/userModel');
require('dotenv').config();

const deploymentMode = process.env.DEPLOYMENT_MODE || 0;  // 1 for deployment, 0 for development
const frontendHost = process.env.FRONTEND_HOST || "localhost";  
const frontendPort = process.env.FRONTEND_PORT || "9500";
const USING_DOCKER = process.env.USING_DOCKER || 0;   // exported inside start_container_backend.sh

let backendHost = process.env.BACKEND_HOST || "localhost";  
const backendPort = process.env.BACKEND_PORT || "3000";

if(USING_DOCKER == 1 || deploymentMode == 1){
  backendHost = "0.0.0.0"
}

const clientURL = 'http://' + frontendHost + ':' + frontendPort;
console.log("client url: ", clientURL);

const app = express();
app.use(
  cors({
    origin: clientURL, // Allow requests from your React app
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());

// Configure express-session middleware
app.use(
  session({
    secret: 'your_secret_key', // Replace with a strong, random secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Make the cookie only accessible via HTTP(S)
      secure: false, // Set to true in production (when using HTTPS)
      // sameSite: 'Strict', // Prevent CSRF attacks
      sameSite: 'Lax', // Allow cookies in cross-origin requests
      maxAge: 1000 * 60 * 60 * 24, // Cookie expires after 1 day
    },
  })
);

// const port = 3000;

if(deploymentMode == 0){
  app.get('/hello-world-demo', (req, res) => {
    console.log('/hello-world-demo get request received');
    res.send({ text: 'Hello from the backend123!' });
  });
}

app.use('/users', userRoutes);
app.use('/notifications', notificationRoutes);
app.use('/genAI', genAIRoutes)

const createHardcodedUser = async () => {
  try {
    const existingUser = await User.findOne({
      where: {
        fname: 'John',
        lname: 'Doe',
        username: 'john_doe',
        email: 'hello@gmail.com',
        role: 'customer',
      },
    });
    if (!existingUser) {
      const mockRequest = {
        body: {
          fname: 'John',
          lname: 'Doe',
          username: 'john_doe',
          email: 'test@gmail.com',
          password: '123',
          role: 'customer',
        },
      };
      await createUserController(mockRequest);
      console.log(
        'Mock post request for creating user sent successfully from server.js wahoo!'
      );
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
    console.log('📌 Current Users in Database:', JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

let server = null;
console.log(`Server is running on port ${backendPort}, on host ${backendHost}, deployment mode is ${deploymentMode} (1 for deployment, 0 for development)`);

const startServer = async () => {
  try {
    const force = (deploymentMode == 1) ? (false) : (true);
    await sequelize.sync({ force: force });

    if(deploymentMode == 0){
      await createHardcodedUser();
    }

    server = app.listen(backendPort, backendHost, () => {
    // server = app.listen(port, () => {
        console.log(`Server is running on port ${backendPort}, on host ${backendHost}, deployment mode is ${deploymentMode} (1 for deployment, 0 for development)`);
    });
    await viewUsers();
  } catch (error) {
    console.error('Error during server startup:', error);
  }
};

const stopServer = async () => {
  if (server != null) {
      server.close(() => {
          console.log('Server stopped.');
      });
  }
};

module.exports = { app, startServer, stopServer }; // exporting for testing with jest


/*  ensures that startServer() is 
    only called when server.js is the entry point of your application, 
    not when it's imported as a dependency.
    used for testing controllers that involve starting the server (jest)
*/
if (require.main === module) {
    startServer();
}


