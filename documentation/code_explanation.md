# HOW IT WORKS

Once the app launches, you should see the list of users in the database being displayed. 
I added a mock post request to store a single user in the database, so only 1 user should be displaying “john_doe”, unless you added other users to your table previously.


If you open the server directory, you’ll notice 4 new folders: controllers, db, models, and routes. These 4 folders contain the architecture of our backend and it follows a [Model-View-Controller](https://developer.mozilla.org/en-US/docs/Glossary/MVC) design pattern for separation of concerns. We haven’t discussed our backend architecture, but feel free to introduce any alternatives. 

1. The db directory contains the db.js file which establishes the connection to your PostgreSQL database using [Sequelize](https://sequelize.org/) as our ORM (object-relational-mapper).  Sequelize just simplifies our interactions with the database, making it easier to store and retrieve data. It writes all of the SQL queries for us.

2. The models directory contains the files that will define the structure of any of our data types. It’s essentially defining a table in our database. For testing, I just defined a user model with a username and email. 

3. The routes directory defines the API endpoints that our backend server will listen to. Here we will define our HTTP methods like (GET, POST, PUT, DELETE) and the URL paths for each route.
    For example, in userRoutes.js:
    ```js
    router.post('/', createUser);
    ```
    When our browser sends a POST request, it's routed to the router.post() endpoint where it calls the createUser function. 
    ```js
    const router = express.Router()
    ```
    Above is a crucial  line: express.Router() creates a modular, mountable route handler. You use this to define a set of related routes in a separate file. In this case, it's for user-related routes in userRoutes.js

    Once you've defined your routes on a router object, you "mount" it onto the main app object using app.use().
    This connects the routes from the router directory to the main application, making them accessible.

    In server.js:
    ```js
    app.use(`/users`, userRoutes);
    ```
    The line above mounts the userRoutes router under the /users path.
    All routes defined in the user router will now be prefixed with /users


4. The controllers directory contains the controller files relating to our data types that utilize the CRUD functions (create, retrieve, update, delete) to interact with the database. It is responsible for handling the actual requests from our routes defined in the routes directory and sends out responses.

For example, in userController.js:
```js
const createUserController = async (req, res) => {
    try {
        const { username, email } = req.body; 
        const newUser = await User.create({ username, email }); 
        console.log("User created and stored via createUserController wahoo!")
    } catch (error) {
        console.error('Error creating user:', error.message);

    }
};
```
This function takes in a request, extracts the username and email, and then calls sequelize’s create() method to automatically store a user with the passed in username and email in our database.

In summary: 
- The model defines the data type we are storing in the database as well as its methods that interact with the database (through sequelize)
- The View is essentially our frontend (app.js for our demo) that renders any received data as HTML
- The router just directs any requests to the specified controller (our API endpoints)
- The controller receives the requests and handles them using the model

Example Summary: We want to display all the registered users on our home page.
1. The client sends a fetch request to the router (our API endpoints in userRoutes.js)
2. The router routes the request to the corresponding controller (userController.js)
3. The controller asks the model to retrieve all the registered users from the database (Model defined in (userModel.js))
4. The model sends SQL queries to the postgres database
5. The database sends back all the registered users to the model
6. The model returns the data to the controller
7. The controller returns the data to the router
8. The router sends the response back to the client (our frontend or app.js) in the form of JSON.
9. The client (or view) renders the JSON as HTML and displays all registered users.

## TO DO:
1. Create our actual data models to be stored in the database along with their corresponding routes, and controllers


## Further Reading:
[Overview](../README.md#overview)                                   
[Setup and Installation](./setup.md)