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

const calendarRoutes = require('./routes/calendar');

const app = express();
app.use(
  cors({
    origin: 'http://localhost:9500', // Allow requests from your React app
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure express-session middleware
app.use(
  session({
    secret: 'your_secret_key', // Replace with a strong, random secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Make the cookie only accessible via HTTP(S)
      secure: false, // Set to true in production (when using HTTPS)
      sameSite: 'Strict', // Prevent CSRF attacks
      maxAge: 1000 * 60 * 60 * 24, // Cookie expires after 1 day
    },
  })
);
app.use('/api/calendar', require('./routes/calendar'));

const port = 3000;

app.get('/hello-world-demo', (req, res) => {
  console.log('/hello-world-demo get request received');
  res.send({ text: 'Hello from the backend123!' });
});

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

    const existingEmployee = await User.findOne({
      where: {
        fname: 'Joy',
        lname: 'Smiles',
        username: 'joy_smiles',
        email: 'joy_smiles@gmail.com',
        role: 'employee',
      },
    });
    if (!existingEmployee) {
      const mockRequest = {
        body: {
          fname: 'Joy',
          lname: 'Smiles',
          username: 'joy_smiles',
          email: 'joy_smiles@gmail.com',
          password: '123',
          role: 'employee',
        },
      };
      await createUserController(mockRequest);
      console.log(
        'Mock post request for creating employee sent successfully from server.js wahoo!'
      );
    } else {
      console.log('Employee already exists in the database womp womp.');
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

const startServer = async () => {
  try {
    await await sequelize.sync({ alter: true }); // Sync the database
    console.log('Database synced successfully');
    await createHardcodedUser();
    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
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


