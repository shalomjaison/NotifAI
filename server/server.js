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
const claimNotificationRoutes = require('./routes/claimNotificationRoutes');
const calendarRoutes = require(`./routes/calendar`);


require('dotenv').config();

const deploymentMode = process.env.DEPLOYMENT_MODE || 0;  // 1 for deployment, 0 for development
const frontendHost = process.env.FRONTEND_HOST || "localhost";  
const frontendPort = process.env.FRONTEND_PORT || "9500";
const USING_DOCKER = process.env.USING_DOCKER || 0;   // exported inside start_container_backend.sh
const BACKEND_IN_VIRTUAL_MACHINE = process.env.BACKEND_IN_VIRTUAL_MACHINE || 0;

let backendHost = process.env.BACKEND_HOST || "localhost";  
const backendPort = process.env.BACKEND_PORT || "3000";

if(USING_DOCKER == 1 || BACKEND_IN_VIRTUAL_MACHINE == 1){
  backendHost = "0.0.0.0"
}

const clientURL = 'http://' + frontendHost + ':' + frontendPort;
console.log("client url: ", clientURL);

const calendarRoutes = require('./routes/calendar');

const app = express();

// app.use((req, res, next) => {
//   console.log(`➡️ [APP] ${req.method} ${req.url}`);
//   next();
// }); debug message to check what API is being called by the server

app.use(
  cors({
    origin: clientURL, // Allow requests from your React app
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
      // sameSite: 'Strict', // Prevent CSRF attacks
      sameSite: 'Lax', // Allow cookies in cross-origin requests
      maxAge: 1000 * 60 * 60 * 24, // Cookie expires after 1 day
    },
  })
);
app.use('/api/calendar', require('./routes/calendar'));
app.use('/users', userRoutes);
app.use('/notifications/claims',    claimNotificationRoutes);
app.use('/notifications', notificationRoutes);
app.use('/genAI', genAIRoutes)
// app.use('/api/calendar', calendarRoutes);
// const port = 3000;

if(deploymentMode == 0){
  app.get('/hello-world-demo', (req, res) => {
    console.log('/hello-world-demo get request received');
    res.send({ text: 'Hello from the backend123!' });
  });
}



const createHardcodedUsers = async () => {
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
          password: '123456',
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

    const existingBoss = await User.findOne({
      where: {
        fname: 'Mike',
        lname: 'Wasabi',
        username: 'mike_wasabi',
        email: 'mike_wasabi@gmail.com',
        role: 'employee',
      },
    });
    if (!existingBoss) {
      const mockRequest = {
        body: {
          fname: 'Mike',
          lname: 'Wasabi',
          username: 'mike_wasabi',
          email: 'mike_wasabi@gmail.com',
          password: '123456',
          role: 'employee',
        },
      };
      await createUserController(mockRequest);
      console.log(
        'Mock post request for creating boss sent successfully from server.js wahoo!'
      );
    } else {
      console.log('Boss already exists in the database womp womp.');
    }

    const existingCustomer = await User.findOne({
      where: {
        fname: 'Mac',
        lname: 'Cheese',
        username: 'mac_cheese',
        email: 'mac_cheese@gmail.com',
        role: 'customer',
      },
    });
    if (!existingCustomer) {
      const mockRequest = {
        body: {
          fname: 'Mac',
          lname: 'Cheese',
          username: 'mac_cheese',
          email: 'mac_cheese@gmail.com',
          password: '123456',
          role: 'customer',
        },
      };
      await createUserController(mockRequest);
      console.log(
        'Mock post request for creating customer sent successfully from server.js wahoo!'
      );
    } else {
      console.log('Customer already exists in the database womp womp.');
    }

    const existingEmployee2 = await User.findOne({
      where: {
        fname: 'Tiff',
        lname: 'Taco',
        username: 'tiff_taco',
        email: 'tiff_taco@gmail.com',
        role: 'employee',
      },
    });
    if (!existingEmployee2) {
      const mockRequest = {
        body: {
          fname: 'Tiff',
          lname: 'Taco',
          username: 'tiff_taco',
          email: 'tiff_taco@gmail.com',
          password: '123456',
          role: 'employee',
        },
      };
      await createUserController(mockRequest);
      console.log(
        'Mock post request for creating employee 2 sent successfully from server.js wahoo!'
      );
    } else {
      console.log('Employee 2 already exists in the database womp womp.');
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
    await sequelize.sync({ force: force, alter:true }); // Sync the database
    console.log('Database synced successfully');

    if(deploymentMode == 0){
      await createHardcodedUsers();
    }

    server = app.listen(backendPort, backendHost, () => {
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


