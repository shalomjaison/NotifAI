const request = require('supertest');
const { app, startServer, stopServer } = require('../../server/server');
const sequelize = require('../../server/db/db');
const User = require('../../server/models/userModel');
// const Notification = require('../../server/models/notificationModel'); // Keep commented if not directly used
// const NewsNotification = require('../../server/models/newsModel'); // Keep commented if not directly used
// const NotificationRecipient = require('../../server/models/notificationRecipientModel'); // Keep commented if not directly used
// const PolicyNotification = require('../../server/models/policyModel'); // Keep commented if not directly used
// const ClaimNotification = require('../../server/models/claimModel'); // Keep commented if not directly used
const bcrypt = require('bcrypt');
// const { experiments } = require('webpack'); // Commented out unused import
// const { use } = require('react'); // Commented out unused import


// Before all tests, establish a connection to the database
beforeAll(async () => {
    await startServer();
    await sequelize.authenticate();

    console.log('Database connection established for tests.');
    // Sync the database
    await sequelize.sync({ force: true });
    console.log('Database synced for tests.');

    // Create test users
    const hashedPassword = await bcrypt.hash('testpassword', 12);
    await User.create({
        username: 'testemployee',
        fname: 'test0',
        lname: 'employee',
        email: 'testemployee@example.com',
        password: hashedPassword,
        role: 'employee',
    });
    await User.create({
        username: 'testuser1',
        fname: 'test1',
        lname: 'user1',
        email: 'testuser1@example.com',
        password: hashedPassword,
        role: 'customer',
    });
    await User.create({
        username: 'testuser2',
        fname: 'test2',
        lname: 'user2',
        email: 'testuser2@example.com',
        password: hashedPassword,
        role: 'customer',
    });
});

// After all tests, close the database connection
afterAll(async () => {
    console.log('Cleaning up database after tests...');
    await sequelize.sync({ force: true }); // Wipes everything
    console.log('Database cleaned.');
    await sequelize.close();
    console.log('Database connection closed after tests.');
    stopServer();
    console.log("server stopped");
});


describe('POST /notifications/', () => {

    // Helper function to add time difference between creation date of notifications
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    // Default request body structure
    const defaultRequestBody = () => ({
        // No default sorting specified here
        filters: {
            sent: false, // Default to received
            args: {}
        }
    });

    // Define dates used in tests
    const oldestDate = '2023-01-01T00:00:00.000Z'; // Use ISO format
    const middleDate = '2023-06-01T00:00:00.000Z';
    const newestDate = '2023-12-31T00:00:00.000Z';

    // Store cookies
    let employee_cookie = {};
    let user1_cookie = {};
    let user2_cookie = {};

    // Log in users and create notifications once before all tests in this block
    beforeAll(async () => {
        // --- Log in users ---
        const loginResponse = await request(app)
            .post('/users/login')
            .send({ email: 'testemployee@example.com', password: 'testpassword' });
        employee_cookie = loginResponse.headers['set-cookie'];

        const loginResponse_user1 = await request(app)
            .post('/users/login')
            .send({ email: 'testuser1@example.com', password: 'testpassword' });
        user1_cookie = loginResponse_user1.headers['set-cookie'];

        const loginResponse_user2 = await request(app)
            .post('/users/login')
            .send({ email: 'testuser2@example.com', password: 'testpassword' });
        user2_cookie = loginResponse_user2.headers['set-cookie'];

        // --- Create Notifications (used by multiple tests) ---
        console.log("Creating notifications for tests...");
        // Notification 1 (News, Oldest Created, Newest Expiry) - Sent BY Employee, Employee IS a recipient
        const notification1 = {
            userid: "testemployee", type: "news", title: "Test Notification 1", body: "Body 1",
            recipients: ["testemployee", "testuser1", "testuser2"], // Employee receives their own notification
            newsDetails: { expirationdate: newestDate, type: "breaking news" }
        };
        await request(app).post('/notifications/create').set('Cookie', employee_cookie).send(notification1);
        await delay(150); // Slightly longer delay

        // Notification 2 (Claim, Middle Created, Middle Due, High Priority) - Sent by User2
        const notification2 = {
            userid: "testuser2", type: "claim", title: "Test Notification 2", body: "Body 2",
            recipients: ["testuser1", "testemployee"],
            claimDetails: {
                insuredname: "testuser2", claimantname: "testuser2", tasktype: "review",
                duedate: middleDate, lineofbusiness: "auto", priority: "HIGH_PRIORITY", // Use specific priority value
                iscompleted: false
            }
        };
        await request(app).post('/notifications/create').set('Cookie', user2_cookie).send(notification2);
        await delay(150); // Slightly longer delay

        // Notification 3 (Policy, Middle+ Created, Oldest Reminder) - Sent by User1
        const notification3 = {
            userid: "testuser1", type: "policy", title: "Test Notification 3", body: "Body 3",
            recipients: ["testemployee"],
            policyDetails: { policyid: 0, changestopremium: "none", billingreminderdate: oldestDate }
        };
        await request(app).post('/notifications/create').set('Cookie', user1_cookie).send(notification3);
        await delay(150); // Slightly longer delay

         // Notification 4 (News, Newest Created, Oldest Expiry) - Sent by user2
         const notification4 = {
            userid: "testuser2", type: "news", title: "Test Notification 4", body: "Body 4",
            recipients: ["testemployee"],
            newsDetails: { expirationdate: oldestDate, type: "update" }
        };
        await request(app).post('/notifications/create').set('Cookie', user2_cookie).send(notification4);
        await delay(150); // Slightly longer delay

        // Notification 5 (Claim, Newest++ Created, Middle Due, Medium Priority) - Sent by User1
        const notification5 = {
            userid: "testuser1", type: "claim", title: "Test Notification 5", body: "Body 5",
            recipients: ["testemployee"], // Employee receives this
            claimDetails: {
                insuredname: "testuser1", claimantname: "somebody", tasktype: "follow-up",
                duedate: middleDate, lineofbusiness: "property", priority: "MEDIUM_PRIORITY", // Medium priority
                iscompleted: false
            }
        };
        await request(app).post('/notifications/create').set('Cookie', user1_cookie).send(notification5);

        console.log("Notifications created.");
    });

    it("should return 401/403 if account has no session initially", async () => {
        console.log("TESTING request without session cookie");
        const tempAgent = request.agent(app);
        const response = await tempAgent
            .post('/notifications/')
            .send(defaultRequestBody());

        expect([401, 403]).toContain(response.status);
    });

    it("should filter received notifications by type", async () => {
        console.log("TESTING received notifications filtering by type");
        const requestBody = defaultRequestBody();
        requestBody.filters.sent = false;

        // Employee received: 1(N), 2(C), 3(P), 4(N), 5(C)
        requestBody.filters.type = "POLICY";
        let response = await request(app).post('/notifications/').set('Cookie', employee_cookie).send(requestBody);
        expect(response.status).toBe(200);
        expect(response.body.notifications.length).toEqual(1);
        expect(response.body.notifications[0].notification.title).toEqual("Test Notification 3");

        requestBody.filters.type = "CLAIMS";
        response = await request(app).post('/notifications/').set('Cookie', employee_cookie).send(requestBody);
        expect(response.status).toBe(200);
        expect(response.body.notifications.length).toEqual(2);
        // Default sort likely oldest first (assuming controller fix): 2 then 5
        expect(response.body.notifications[0].notification.title).toEqual("Test Notification 2");
        expect(response.body.notifications[1].notification.title).toEqual("Test Notification 5");


        requestBody.filters.type = "NEWS";
        response = await request(app).post('/notifications/').set('Cookie', employee_cookie).send(requestBody);
        expect(response.status).toBe(200);
        expect(response.body.notifications.length).toEqual(2);
        // Default sort likely oldest first (assuming controller fix): 1 then 4
        expect(response.body.notifications[0].notification.title).toEqual("Test Notification 1");
        expect(response.body.notifications[1].notification.title).toEqual("Test Notification 4");
    });

    it("should sort received notifications by due/expiry/reminder date", async () => {
        console.log("TESTING received notifications sorting by due date");
        const requestBody = defaultRequestBody();
        requestBody.filters.sent = false;

        // Employee receives 1(N,newest), 2(C,middle), 3(P,oldest), 4(N,oldest), 5(C, middle)
        requestBody.filters.args.due_earliest_first = true; // Sort oldest date first
        let response = await request(app).post('/notifications/').set('Cookie', employee_cookie).send(requestBody);
        expect(response.status).toBe(200);
        expect(response.body.notifications.length).toEqual(5);
        // Order: 3(P,oldest), 4(N,oldest), 2(C,middle), 5(C,middle), 1(N,newest)
        expect(['Test Notification 3', 'Test Notification 4']).toContain(response.body.notifications[0].notification.title);
        expect(['Test Notification 3', 'Test Notification 4']).toContain(response.body.notifications[1].notification.title);
        expect(['Test Notification 2', 'Test Notification 5']).toContain(response.body.notifications[2].notification.title);
        expect(['Test Notification 2', 'Test Notification 5']).toContain(response.body.notifications[3].notification.title);
        expect(response.body.notifications[4].notification.title).toEqual("Test Notification 1");


        requestBody.filters.args.due_earliest_first = false; // Sort newest date first
        response = await request(app).post('/notifications/').set('Cookie', employee_cookie).send(requestBody);
        expect(response.status).toBe(200);
        expect(response.body.notifications.length).toEqual(5);
        // Order: 1(N,newest), 2(C,middle), 5(C,middle), 3(P,oldest), 4(N,oldest)
        expect(response.body.notifications[0].notification.title).toEqual("Test Notification 1");
        expect(['Test Notification 2', 'Test Notification 5']).toContain(response.body.notifications[1].notification.title);
        expect(['Test Notification 2', 'Test Notification 5']).toContain(response.body.notifications[2].notification.title);
        expect(['Test Notification 3', 'Test Notification 4']).toContain(response.body.notifications[3].notification.title);
        expect(['Test Notification 3', 'Test Notification 4']).toContain(response.body.notifications[4].notification.title);
    });

    it("should retrieve and filter sent notifications correctly", async () => {
        console.log("TESTING sent notifications retrieval and filtering");
        const request_sent = defaultRequestBody();
        request_sent.filters.sent = true; // Filter for sent

        // Employee sent 1 (news)
        let response = await request(app).post('/notifications/').set('Cookie', employee_cookie).send(request_sent);
        expect(response.status).toBe(200);
        expect(response.body.notifications.length).toEqual(1);
        expect(response.body.notifications[0].notification.title).toEqual("Test Notification 1");

        // User1 sent 3 (policy) and 5 (claim)
        response = await request(app).post('/notifications/').set('Cookie', user1_cookie).send(request_sent);
        expect(response.status).toBe(200);
        expect(response.body.notifications.length).toEqual(2); // Sent 3 and 5

        // User2 sent 2 (claim) and 4 (news)
        response = await request(app).post('/notifications/').set('Cookie', user2_cookie).send(request_sent);
        expect(response.status).toBe(200);
        expect(response.body.notifications.length).toEqual(2); // Sent 2 and 4

        // User2 sent, filtered by type CLAIMS
        request_sent.filters.type = "CLAIMS";
        response = await request(app).post('/notifications/').set('Cookie', user2_cookie).send(request_sent);
        expect(response.status).toBe(200);
        expect(response.body.notifications.length).toEqual(1);
        expect(response.body.notifications[0].notification.title).toEqual("Test Notification 2");

        // User2 sent, filtered by type POLICY (should be empty)
        request_sent.filters.type = "POLICY";
        response = await request(app).post('/notifications/').set('Cookie', user2_cookie).send(request_sent);
        expect(response.status).toBe(200);
        expect(response.body.notifications).toEqual([]);
    });

    // --- Test for Combined Filters & Limit ---
    it('should filter by read, completed, priority and apply max_notifications limit', async () => {
        console.log("TESTING combined filters (read, completed, priority) and limit");

        // Employee receives 1, 2, 3, 4, 5. Let's focus on #2 (claim, high prio, incomplete)
        const requestBody = defaultRequestBody();
        requestBody.filters.sent = false; // Received
        requestBody.filters.read = false; // Assume unread
        requestBody.filters.type = "CLAIMS";
        requestBody.filters.args.is_completed = false;
        requestBody.filters.args.priority = "HIGH_PRIORITY";
        requestBody.max_notifications = 1;

        const response = await request(app)
            .post('/notifications/')
            .set('Cookie', employee_cookie)
            .send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body.notifications.length).toEqual(1);
        expect(response.body.notifications[0].notification.title).toEqual("Test Notification 2");
        expect(response.body.notifications[0].notification.type).toEqual("claim");
        expect(response.body.notifications[0].notification.args.priority).toEqual("HIGH_PRIORITY");
        expect(response.body.notifications[0].notification.args.iscompleted).toBe(false);

         // Test with a priority that doesn't match
         requestBody.filters.args.priority = "LOW_PRIORITY"; // Assume LOW_PRIORITY is a valid enum/string
         const responseLowPrio = await request(app)
             .post('/notifications/')
             .set('Cookie', employee_cookie)
             .send(requestBody);
         expect(responseLowPrio.status).toBe(200);
         expect(responseLowPrio.body.notifications.length).toEqual(0);

         // Test filtering for completed (should find none initially)
         delete requestBody.filters.args.priority; // Remove priority filter
         requestBody.filters.args.is_completed = true; // Filter for completed
         const responseCompleted = await request(app)
             .post('/notifications/')
             .set('Cookie', employee_cookie)
             .send(requestBody);
         expect(responseCompleted.status).toBe(200);
         expect(responseCompleted.body.notifications.length).toEqual(0);
    });

    // --- Test for Medium Priority & Other Filters ---
    it('should filter for medium priority, unarchived, and not overdue claims', async () => {
        console.log("TESTING combined filters (medium priority, unarchived, not overdue)");

        // Employee received notification 5 (claim, medium priority, incomplete)
        // Assume it's unread, unarchived, and not overdue initially.

        const requestBody = defaultRequestBody();
        requestBody.filters.sent = false; // Received
        requestBody.filters.type = "CLAIMS"; // Focus on claims
        requestBody.filters.args.priority = "MEDIUM_PRIORITY"; // Filter for medium priority
        requestBody.filters.archived = false; // Filter for NOT archived
        requestBody.filters.args.is_overdue = false; // Filter for NOT overdue

        const response = await request(app)
            .post('/notifications/')
            .set('Cookie', employee_cookie)
            .send(requestBody);

        expect(response.status).toBe(200);
        // Should find only notification 5 which matches all criteria
        expect(response.body.notifications.length).toEqual(1);
        expect(response.body.notifications[0].notification.title).toEqual("Test Notification 5");
        expect(response.body.notifications[0].notification.type).toEqual("claim");
        expect(response.body.notifications[0].notification.args.priority).toEqual("MEDIUM_PRIORITY");
        // Cannot directly verify archived/overdue status without update mechanism/test data

        // Test filtering for archived (should find none)
        requestBody.filters.archived = true;
        const responseArchived = await request(app)
            .post('/notifications/')
            .set('Cookie', employee_cookie)
            .send(requestBody);
        expect(responseArchived.status).toBe(200);
        expect(responseArchived.body.notifications.length).toEqual(0);

        // Test filtering for overdue (should find none)
        requestBody.filters.archived = false; // Reset archived
        requestBody.filters.args.is_overdue = true;
        const responseOverdue = await request(app)
            .post('/notifications/')
            .set('Cookie', employee_cookie)
            .send(requestBody);
        expect(responseOverdue.status).toBe(200);
        expect(responseOverdue.body.notifications.length).toEqual(0);
    });


    // --- Test for Invalid Request Body ---
    it('should return 400 for an invalid request body structure', async () => {
        console.log("TESTING invalid request body");

        // Missing 'filters' property entirely
        const invalidBody1 = { most_recent_first: true };
        const response1 = await request(app).post('/notifications/').set('Cookie', employee_cookie).send(invalidBody1);
        expect(response1.status).toBe(400);
        expect(response1.body.reason).toEqual("Request body does not have filters property");

        // Missing 'sent' property within 'filters'
        const invalidBody2 = { filters: { args: {} } };
        const response2 = await request(app).post('/notifications/').set('Cookie', employee_cookie).send(invalidBody2);
        expect(response2.status).toBe(400);
        // ** CHECK CONTROLLER TYPO: Should likely be 'sent' **
        expect(response2.body.reason).toEqual("Request body does not have send property");

        // 'sent' property is not a boolean
        const invalidBody3 = { filters: { sent: "yes", args: {} } };
        const response3 = await request(app).post('/notifications/').set('Cookie', employee_cookie).send(invalidBody3);
        expect(response3.status).toBe(400);
        expect(response3.body.reason).toEqual("Request body filters property's sent property (req.body.filters.sent) is not a boolean");

         // Missing 'args' property within 'filters'
         const invalidBody4 = { filters: { sent: false } };
        const response4 = await request(app).post('/notifications/').set('Cookie', employee_cookie).send(invalidBody4);
        expect(response4.status).toBe(400);
        expect(response4.body.reason).toEqual("Request body does not have args property inside filters property");
    });

    // --- Test for Invalid Filter/Args Object Types ---
     it('should return 400 if filters or args are not objects', async () => {
        console.log("TESTING invalid filters/args object types");

        // filters is null
        const invalidBody5 = { filters: null };
        const response5 = await request(app)
            .post('/notifications/')
            .set('Cookie', employee_cookie)
            .send(invalidBody5);
        expect(response5.status).toBe(400);
        expect(response5.body.reason).toEqual("Request body filters property is not a valid JSON object");

        // filters.args is null
        const invalidBody6 = {
            filters: {
                sent: false,
                args: null // Invalid type for args
            }
        };
        const response6 = await request(app)
            .post('/notifications/')
            .set('Cookie', employee_cookie)
            .send(invalidBody6);
        expect(response6.status).toBe(400);
        expect(response6.body.reason).toEqual("Request body filters property's args property (req.body.filters.args) is not a valid JSON object");

        // filters is a string (invalid type)
        const invalidBody7 = { filters: "invalid" };
         const response7 = await request(app)
             .post('/notifications/')
             .set('Cookie', employee_cookie)
             .send(invalidBody7);
         expect(response7.status).toBe(400);
         expect(response7.body.reason).toEqual("Request body filters property is not a valid JSON object");
    });

    // --- Test for Default Sorting ---
    it('should return notifications without specific sorting if no sort option is provided', async () => {
        console.log("TESTING default sorting (no sort options specified)");

        // Employee receives 5 notifications (1, 2, 3, 4, 5)
        const requestBody = defaultRequestBody(); // No most_recent_first or due_earliest_first
        requestBody.filters.sent = false;

        const response = await request(app)
            .post('/notifications/')
            .set('Cookie', employee_cookie)
            .send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body.notifications.length).toEqual(5);
        // We don't assert strict order here, as default DB order can vary,
        // but this ensures the code path for the default comparator is hit.
        // A basic check: ensure all expected titles are present
        const receivedTitles = response.body.notifications.map(n => n.notification.title);
        expect(receivedTitles).toEqual(expect.arrayContaining([
            "Test Notification 1",
            "Test Notification 2",
            "Test Notification 3",
            "Test Notification 4",
            "Test Notification 5"
        ]));
    });

    // --- Test for Read Filter ---
    it('should filter by read status', async () => {
        console.log("TESTING filter by read status");

        // Test filtering for read = true (expect none initially)
        const requestBodyRead = defaultRequestBody();
        requestBodyRead.filters.sent = false;
        requestBodyRead.filters.read = true; // Filter for read notifications

        const responseRead = await request(app)
            .post('/notifications/')
            .set('Cookie', employee_cookie) // Test with employee who received all
            .send(requestBodyRead);

        expect(responseRead.status).toBe(200);
        // Assuming no notifications are marked as read by default in this test setup
        expect(responseRead.body.notifications.length).toEqual(0);

        // Test filtering for read = false (expect all initially)
        const requestBodyUnread = defaultRequestBody();
        requestBodyUnread.filters.sent = false;
        requestBodyUnread.filters.read = false; // Filter for unread notifications

        const responseUnread = await request(app)
            .post('/notifications/')
            .set('Cookie', employee_cookie)
            .send(requestBodyUnread);

        expect(responseUnread.status).toBe(200);
        // Should get all 5 received notifications as none are marked read
        expect(responseUnread.body.notifications.length).toEqual(5);
    });

    // --- Test for Non-Object Body ---
    it('should return 400 if request body is not a JSON object', async () => {
        console.log("TESTING non-object request body");

        const response = await request(app)
            .post('/notifications/')
            .set('Cookie', employee_cookie)
            .set('Content-Type', 'application/json') // Set content type
            .send("this is not json"); // Send a string instead of an object

        expect(response.status).toBe(400);
    });

});
