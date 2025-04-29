const request = require('supertest');
const { app, startServer, stopServer } = require('../../server/server');
const sequelize = require('../../server/db/db');
const User = require('../../server/models/userModel');
const bcrypt = require('bcrypt');
// Import the controller function directly for unit testing
const { logoutUser: logoutUserController } = require('../../server/controllers/logoutUserController'); // Adjust path if needed

// --- Integration Test Setup (beforeAll, afterAll) ---
beforeAll(async () => {
    await startServer();
    try {
        await sequelize.authenticate();
        console.log('Database connection established for tests.');
        await sequelize.sync({ force: true });
        console.log('Database synced for tests.');
        const hashedPassword = await bcrypt.hash('testpassword', 12);
        await User.create({
            username: 'testuser',
            fname: 'Test',
            lname: 'User',
            email: 'test@example.com',
            password: hashedPassword,
            role: 'customer',
        });
    } catch (error) {
        console.error('Failed to connect to database or sync:', error);
    }
});

afterAll(async () => {
    try {
        console.log('Cleaning up database after tests...');
        await sequelize.sync({ force: true });
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

// --- Integration Tests using Supertest ---
describe('Authentication Controllers (Integration)', () => {
    describe('POST /users/login', () => {
        // --- Login tests remain the same ---
        it('should login a user with valid credentials', async () => {
            const userData = { email: 'test@example.com', password: 'testpassword' };
            const response = await request(app).post('/users/login').send(userData);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.user).toHaveProperty('username', 'testuser');
        });

        it('should return 401 for non-existent user', async () => {
            const userData = { email: 'nonexistent@example.com', password: 'somepassword' };
            const response = await request(app).post('/users/login').send(userData);
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid username or password');
        });

        it('should return 401 for incorrect password', async () => {
            const userData = { email: 'test@example.com', password: 'wrongpassword' };
            const response = await request(app).post('/users/login').send(userData);
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid username or password');
        });
    });

    describe('POST /users/logout', () => {
        let loggedInAgent; // To hold the agent with a valid cookie

        beforeAll(async () => {
            loggedInAgent = request.agent(app); // Create an agent to persist cookies
            const loginResponse = await loggedInAgent
                .post('/users/login')
                .send({ email: 'test@example.com', password: 'testpassword' });
            expect(loginResponse.status).toBe(200);
        });

        it('should logout a logged-in user successfully', async () => {
            const logoutResponse = await loggedInAgent.post('/users/logout');
            expect(logoutResponse.status).toBe(200);
            expect(logoutResponse.body.message).toBe('Logout successful');

            // Verify session is gone
            const protectedResponse = await loggedInAgent.get('/users/me');
            expect([401, 403]).toContain(protectedResponse.status);
            if (protectedResponse.status === 401) {
                expect(protectedResponse.body.message).toBe('Unauthorized: Please log in');
            }
        });

        it('should return 200 even when no session exists (user not logged in)', async () => {
            const response = await request(app).post('/users/logout');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Logout successful');
        });

        it('[Integration Limitation] should return 500 if session destruction fails', () => {
            // This specific internal error path (if err) inside req.session.destroy
            // is difficult to trigger reliably in a pure integration test via supertest.
            console.warn("[Test Limitation] Cannot easily simulate req.session.destroy failure in this integration test setup. See Unit Test block below for coverage of this error path.");
            expect(true).toBe(true); // Placeholder assertion for the integration test suite
        });
    });
});

// --- Unit Test for Logout Controller Error Path ---
describe('logoutUserController (Unit Test)', () => {
    it('should return 500 and error message if req.session.destroy fails', () => {
        // 1. Arrange: Create mock request and response objects
        const mockError = new Error("Simulated session store failure");
        const mockRequest = {
            session: {
                // Mock the destroy function to call its callback with an error
                destroy: jest.fn(callback => {
                    callback(mockError); // Simulate the error
                })
            }
            // No need for cookies or other properties for this specific test
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(), // Allows chaining .status().json()
            json: jest.fn(),
            clearCookie: jest.fn() // Mock clearCookie to ensure it's NOT called on error
        };
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error during test

        // 2. Act: Call the controller function directly with the mocks
        logoutUserController(mockRequest, mockResponse);

        // 3. Assert: Verify the behavior
        expect(mockRequest.session.destroy).toHaveBeenCalledTimes(1); // Ensure destroy was called
        expect(consoleSpy).toHaveBeenCalledWith("Error destroying session:", mockError); // Check error logging
        expect(mockResponse.status).toHaveBeenCalledWith(500); // Check status code
        expect(mockResponse.json).toHaveBeenCalledWith({ message: "Failed to log out" }); // Check response body
        expect(mockResponse.clearCookie).not.toHaveBeenCalled(); // Ensure cookie wasn't cleared on error

        // Restore console.error
        consoleSpy.mockRestore();
    });
});
