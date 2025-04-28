const request = require('supertest');
const { app, startServer, stopServer } = require('../../server/server'); 
const sequelize = require('../../server/db/db'); 
const User = require('../../server/models/userModel'); 
const bcrypt = require('bcrypt');

// Before all tests, establish a connection to the database
beforeAll(async () => {
  await startServer();
  try {
    await sequelize.authenticate();
    console.log('Database connection established for tests.');
    // Sync the database 
    await sequelize.sync({ force: true });
    console.log('Database synced for tests.');
  } catch (error) {
    console.error('Failed to connect to database or sync:', error);
  }
});

// After all tests, close the database connection
afterAll(async () => {
  try {
    console.log('Cleaning up database after tests...');
    await sequelize.sync({ force: true }); // Wipes everything
    console.log('Database cleaned.');

    await sequelize.close();
    console.log('Database connection closed after tests.');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    stopServer();
    console.log("server stopped");
  }
});

describe('POST /users/signup', () => {
  
  it('should create a new user with default customer role', async () => {
    const userData = {
      fname: 'Test',
      lname: 'User',
      username: 'testuser1',
      email: 'test1@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/users/signup')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Sign up successful');
    // Check all the user fields individually
    expect(response.body.user.fname).toBe(userData.fname);
    expect(response.body.user.lname).toBe(userData.lname);
    expect(response.body.user.username).toBe(userData.username);
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.user.role).toBe('customer'); // Default role
  });

  it('should create a user with a specified role', async () => {
    const userData = {
      fname: 'Admin',
      lname: 'User',
      username: 'adminuser',
      email: 'admin@example.com',
      password: 'adminpass',
      role: 'employee'
    };

    const response = await request(app)
      .post('/users/signup')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Sign up successful');
    expect(response.body.user.fname).toBe(userData.fname);
    expect(response.body.user.lname).toBe(userData.lname);
    expect(response.body.user.username).toBe(userData.username);
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.user.role).toBe('employee');
  });

  it('should return 400 if a user with the email already exists', async () => {
    // Create a user with a unique email for this test
    const userData = {
      fname: 'Existing',
      lname: 'User',
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'password123'
    };

    // First request to create the user
    await request(app)
      .post('/users/signup')
      .send(userData);

    // Second request with the same email should fail
    const response = await request(app)
      .post('/users/signup')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('A user with this email already exists.');
  });
});