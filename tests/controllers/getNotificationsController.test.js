const request = require('supertest');
const { app, startServer } = require('../../server/server'); 
const sequelize = require('../../server/db/db'); 
const User = require('../../server/models/userModel'); 
const Notification = require('../../server/models/notificationModel'); 
const NewsNotification = require('../../server/models/newsModel'); 
const NotificationRecipient = require('../../server/models/notificationRecipientModel'); 
const PolicyNotification = require('../../server/models/policyModel'); 
const ClaimNotification = require('../../server/models/claimModel'); 
const bcrypt = require('bcrypt');

// Before all tests, establish a connection to the database
beforeAll(async () => {
  await startServer();
  await sequelize.authenticate();
  console.log('Database connection established for tests.');
  // Sync the database 
  await sequelize.sync({ force: true });
  console.log('Database synced for tests.');

  // Create a test user for the notification
  const hashedPassword = await bcrypt.hash('testpassword', 12);
  await User.create({
    username: 'testemployee',
    fname: 'test',
    lname: 'employee',
    email: 'testemployee@example.com',
    password: hashedPassword,
    role: 'employee',
  });

  await User.create({
    username: 'testuser1',
    fname: 'test',
    lname: 'user1',
    email: 'testuser1@example.com',
    password: hashedPassword,
    role: 'customer',
  });

  await User.create({
    username: 'testuser2',
    fname: 'test',
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
});



describe('POST /notifications/', () => {

    // to add time difference between creation date of notifications
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    const defaultRequestBody = {
        // most_recent_first: true,
        filters: {
            sent: false,
            args: {

            }
        }
    };
    const oldestDate = '2023-01-01';
    const middleDate = '2023-06-01';
    const newestDate = '2023-12-31';
    let employee_cookie = {};
    let user1_cookie = {};
    let user2_cookie = {};

    beforeAll(async () => {

    });

    /**
     * THIS TEST ALSO LOGINS FOR THREE ACCOUNTS SO THAT CAN REUSE COOKIES
     */
    it("should return empty list if account has no notifications", async () => {

        /**
         * Get the session cookie for employee, then test on no notifications
         */
        const loginResponse = await request(app)
        .post('/users/login')
        .send({ email: 'testemployee@example.com', password: 'testpassword' });
        const cookie = loginResponse.headers['set-cookie'];

        employee_cookie = cookie;

        const response = await request(app)
            .post('/notifications/')
            .set('Cookie', employee_cookie) // Set the session cookie
            .send(defaultRequestBody);

        expect(response.status).toBe(200);  // response should be {notifications: []}
        expect(response.body.notifications).toEqual([]);

        /**
         * Get the session cookie for user1, then test on no notifications
         */
        const loginResponse_user1 = await request(app)
        .post('/users/login')
        .send({ email: 'testuser1@example.com', password: 'testpassword' });
        const cookie_user1 = loginResponse_user1.headers['set-cookie'];

        user1_cookie = cookie_user1;

        const request1 = structuredClone(defaultRequestBody);
        request1.filters.type = "NEWS";

        const response_user1 = await request(app)
            .post('/notifications/')
            .set('Cookie', user1_cookie) // Set the session cookie
            .send(request1);

        expect(response_user1.status).toBe(200);  // response should be {notifications: []}
        expect(response_user1.body.notifications).toEqual([]);

        /**
         * Get the session cookie for user2, then test on no notifications
         */

        const loginResponse_user2 = await request(app)
        .post('/users/login')
        .send({ email: 'testuser2@example.com', password: 'testpassword' });
        const cookie_user2 = loginResponse_user2.headers['set-cookie'];

        user2_cookie = cookie_user2;
        const request2 = structuredClone(defaultRequestBody);
        request2.filters.type = "POLICY";
        request2.most_recent_first = true;

        const response_user2 = await request(app)
            .post('/notifications/')
            .set('Cookie', user2_cookie) // Set the session cookie
            .send(request2);

        expect(response_user2.status).toBe(200);  // response should be {notifications: []}
        expect(response_user2.body.notifications).toEqual([]);
    });

    it("tests on three notifications", async () => {

        // const { 
        //     userid,
        //     type,
        //     title,
        //     body,
        //     recipients, // Array of recipient usernames
        //     newsDetails,
        //     claimDetails,
        //     policyDetails,
        //  } = req.body

        const notification1 = {     // oldest creation date, newest expiration date
            userid: "testemployee",
            type: "news",               // news, claim, policy
            title: "Test Notification 1",
            body: "This is a test notification.",
            recipients: ["testemployee", "testuser1", "testuser2"],
            newsDetails: {
                expirationdate: newestDate,
                type: "breaking news",
            }
        }
        const response = await request(app)
            .post('/notifications/create')
            .set('Cookie', employee_cookie) // Set the session cookie
            .send(notification1);

        await delay(500);   // notification 1 has oldest creation date

        const notification2 = {    // middle creation date, middle expiration date
            userid: "testuser2",
            type: "claims",               // news, claim, policy
            title: "Test Notification 2",
            body: "This is a claims notification.",
            recipients: ["testuser1", "employee"],

            claimDetails: {
                insuredname: "testuser2",
                claimantname: "testuser2",
                tasktype: "review",
                lineofbusiness: "auto",
                duedate: middleDate,
                priority: "high",
                iscompleted: false,
            }
        }
        const response2 = await request(app)
            .post('/notifications/create')
            .set('Cookie', user2_cookie) // Set the session cookie
            .send(notification2);

        await delay(500);   // notification 2 has middle creation date

        const notification3 = {    // newest creation date, oldest expiration date
            userid: "testuser1",
            type: "policy",               // news, claim, policy
            title: "Test Notification 3",
            body: "This is a policy notification.",
            recipients: ["employee"],
            policyDetails: {
                changestopremium: "none",
                billingreminderdate: oldestDate,
            }
        }

        const response3 = await request(app)
            .post('/notifications/create')
            .set('Cookie', user1_cookie) // Set the session cookie
            .send(notification3);

        await delay(500);   // notification 2 has middle creation date

        /**
         * After creating 3 notifications, right now, employee should have all 3 notifications, user1 should have 2 notifications (notification 1 and 2),
         * and user2 should have 1 notification (notification 1)
         * 
         * employee -> notification1 -> [everyone]
         * user1 -> notification3 -> [employee]
         * user2 -> notification2 -> [employee, user1]
         * 
         * notification1: oldest creation date, newest expiration date
         * notification2: middle creation date, middle expiration date
         * notification3: newest creation date, oldest expiration date
         * 
         * notification 1 should be sent by employee, notification 2 should be sent by user2, and notification 3 should be sent by user1
         * 
         */

        console.log("EVERYTHING WORKS??");

        // BEGIN TESTS RECEIVED
        // BEGIN TESTS SENT
        // BEGIN TESTS DATES
        // BEGIN TESTS TYPES

    });

    
});







