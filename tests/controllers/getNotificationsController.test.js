const request = require('supertest');
const { app, startServer, stopServer } = require('../../server/server'); 
const sequelize = require('../../server/db/db'); 
const User = require('../../server/models/userModel'); 
// const Notification = require('../../server/models/notificationModel'); 
// const NewsNotification = require('../../server/models/newsModel'); 
// const NotificationRecipient = require('../../server/models/notificationRecipientModel'); 
// const PolicyNotification = require('../../server/models/policyModel'); 
// const ClaimNotification = require('../../server/models/claimModel'); 
const bcrypt = require('bcrypt');
const { experiments } = require('webpack');
// const { use } = require('react');

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

    // to add time difference between creation date of notifications
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    const defaultRequestBody = () => ({
        // most_recent_first: true,
        filters: {
            sent: false,
            args: {

            }
        }
    });
    const oldestDate = '2023-01-01';
    const middleDate = '2023-06-01';
    const newestDate = '2023-12-31';

    let employee_cookie = {};
    let user1_cookie = {};
    let user2_cookie = {};

    beforeAll(async () => {
        /**
         * LOGGING IN FOR EMPLOYEE AND TWO USERS
         */

        // LOGGING IN EMPLOYEE
        const loginResponse = await request(app)
        .post('/users/login')
        .send({ email: 'testemployee@example.com', password: 'testpassword' });
        const cookie = loginResponse.headers['set-cookie'];

        employee_cookie = cookie;

        // LOGGING IN USER1
        const loginResponse_user1 = await request(app)
        .post('/users/login')
        .send({ email: 'testuser1@example.com', password: 'testpassword' });
        const cookie_user1 = loginResponse_user1.headers['set-cookie'];

        user1_cookie = cookie_user1;

        // LOGGING IN USER2
        const loginResponse_user2 = await request(app)
        .post('/users/login')
        .send({ email: 'testuser2@example.com', password: 'testpassword' });
        const cookie_user2 = loginResponse_user2.headers['set-cookie'];

        user2_cookie = cookie_user2;

    });

    /**
     * THIS TEST ALSO LOGINS FOR THREE ACCOUNTS SO THAT CAN REUSE COOKIES
     */
    // it("should return empty list if account has no notifications", async () => {

    //     console.log("TESTING FOR EMPTY NOTIFICATIONS");

    //     const response = await request(app)
    //         .post('/notifications/')
    //         .set('Cookie', employee_cookie) // Set the session cookie
    //         .send(defaultRequestBody());

    //     expect(response.status).toBe(200);  // response should be {notifications: []}
    //     expect(response.body.notifications).toEqual([]);

    //     const request1 = structuredClone(defaultRequestBody());
    //     request1.filters.type = "NEWS";

    //     const response_user1 = await request(app)
    //         .post('/notifications/')
    //         .set('Cookie', user1_cookie) // Set the session cookie
    //         .send(request1);

    //     expect(response_user1.status).toBe(200);  // response should be {notifications: []}
    //     expect(response_user1.body.notifications).toEqual([]);

    //     const request2 = structuredClone(defaultRequestBody());
    //     request2.filters.type = "POLICY";
    //     request2.most_recent_first = true;

    //     const response_user2 = await request(app)
    //         .post('/notifications/')
    //         .set('Cookie', user2_cookie) // Set the session cookie
    //         .send(request2);

    //     expect(response_user2.status).toBe(200);  // response should be {notifications: []}
    //     expect(response_user2.body.notifications).toEqual([]);
    // });

    it("smoke test on three notifications", async () => {

        console.log("TESTING FOR THREE NOTIFICATIONS ON THREE ACCOUNTS");

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
        let response = await request(app)
            .post('/notifications/create')
            .set('Cookie', employee_cookie) // Set the session cookie
            .send(notification1);

        await delay(1100);   // notification 1 has oldest creation date

        const notification2 = {    // middle creation date, middle expiration date
            userid: "testuser2",
            type: "claim",               // news, claim, policy
            title: "Test Notification 2",
            body: "This is a claims notification.",
            recipients: ["testuser1", "testemployee"],
            claimDetails: {
                insuredname: "testuser2",
                claimantname: "testuser2",
                tasktype: "review",
                duedate: middleDate,
                lineofbusiness: "auto",
                priority: "high",
                iscompleted: false,
            }
        }
        response = await request(app)
            .post('/notifications/create')
            .set('Cookie', user2_cookie) // Set the session cookie
            .send(notification2);

        await delay(1100);   // notification 2 has middle creation date

        const notification3 = {    // newest creation date, oldest expiration date
            userid: "testuser1",
            type: "policy",               // news, claim, policy
            title: "Test Notification 3",
            body: "This is a policy notification.",
            recipients: ["testemployee"],
            policyDetails: {
                policyid: 0,
                changestopremium: "none",
                billingreminderdate: oldestDate,
            }
        }

        response = await request(app)
            .post('/notifications/create')
            .set('Cookie', user1_cookie) // Set the session cookie
            .send(notification3);

        /**
         * After creating 3 notifications, right now, employee should receive all 3 notifications, user1 should receive 2 notifications (notification 1 and 2),
         * and user2 should receive 1 notification (notification 1)
         * 
         * employee -> notification1 -> [everyone]
         * user1 -> notification3 -> [employee]
         * user2 -> notification2 -> [employee, user1]
         * 
         * notification1: oldest creation date, newest expiration date, news type
         * notification2: middle creation date, middle due date, claim type
         * notification3: newest creation date, oldest reminder date, policy type
         * 
         * notification 1 should be sent by employee, notification 2 should be sent by user2, and notification 3 should be sent by user1
         * 
         */

        /**
         * BEGIN TESTS RECEIVED
         */
        const request_received = defaultRequestBody();
        request_received.most_recent_first = true;
        request_received.filters.sent = false;

        // Employee, 3 received notifications
        response = await request(app)
        .post('/notifications/')
        .set('Cookie', employee_cookie) // Set the session cookie
        .send(request_received);

        expect(response.status).toBe(200);  // response should be {notifications: []}
        expect(response.body.notifications.length).toEqual(3);    // should be notif3, notif2, notif1

        // Check order of notifications by most recent first
        expect(response.body.notifications[0].notification.type).toEqual("policy");
        expect(response.body.notifications[1].notification.type).toEqual("claim");
        expect(response.body.notifications[2].notification.type).toEqual("news");

        for (let i = 1; i < 3; i++) {
            const a = Date.parse(response.body.notifications[i - 1].notification.datecreated);
            const b = Date.parse(response.body.notifications[i].notification.datecreated);
            expect(a).toBeGreaterThan(b);
        }

        // Employee, filter for each specific type of notification received
        let requestbody = defaultRequestBody();
        requestbody.filters.type = "POLICY";

        response = await request(app).post('/notifications/').set('Cookie', employee_cookie).send(requestbody);

        expect(response.status).toBe(200);  // response should be {notifications: []}
        expect(response.body.notifications.length).toEqual(1);   // should be notif3
        expect(response.body.notifications[0].notification.type).toEqual("policy");

        requestbody.filters.type = "CLAIMS";
        response = await request(app).post('/notifications/').set('Cookie', employee_cookie).send(requestbody);
        expect(response.status).toBe(200);  // response should be {notifications: []}
        expect(response.body.notifications.length).toEqual(1);   // should be notif2
        expect(response.body.notifications[0].notification.type).toEqual("claim");

        requestbody.filters.type = "NEWS";
        response = await request(app).post('/notifications/').set('Cookie', employee_cookie).send(requestbody);
        expect(response.status).toBe(200);  // response should be {notifications: []}
        expect(response.body.notifications.length).toEqual(1);   // should be notif1
        expect(response.body.notifications[0].notification.type).toEqual("news");

        // Employee, 3 received notifications by due date/expiration date/reminder date
        requestbody = defaultRequestBody();
        requestbody.filters.args.due_earliest_first = true;

        response = await request(app)
        .post('/notifications/')
        .set('Cookie', employee_cookie) // Set the session cookie
        .send(requestbody);

        expect(response.status).toBe(200);  // response should be {notifications: []}
        expect(response.body.notifications.length).toEqual(3);   // should be notif3, notif2, notif1
        expect(response.body.notifications[0].notification.type).toEqual("policy");
        expect(response.body.notifications[1].notification.type).toEqual("claim");
        expect(response.body.notifications[2].notification.type).toEqual("news");

        // User1
        const request_received_oldest_first = defaultRequestBody();
        request_received_oldest_first.most_recent_first = false;
        request_received_oldest_first.filters.sent = false;

        response = await request(app)
        .post('/notifications/')
        .set('Cookie', user1_cookie) // Set the session cookie
        .send(request_received_oldest_first);

        expect(response.status).toBe(200);  // response should be {notifications: []}
        expect(response.body.notifications.length).toEqual(2);   // should be notif1, notif2
        expect(response.body.notifications[0].notification.type).toEqual("news");
        expect(response.body.notifications[1].notification.type).toEqual("claim");
        expect(Date.parse(response.body.notifications[0].notification.datecreated)).toBeLessThan(Date.parse(response.body.notifications[1].notification.datecreated));
        
        // User2
        response = await request(app)
        .post('/notifications/')
        .set('Cookie', user2_cookie) // Set the session cookie
        .send(request_received);

        expect(response.status).toBe(200);  // response should be {notifications: []}
        expect(response.body.notifications.length).toEqual(1);
        expect(response.body.notifications[0].notification.type).toEqual("news");

        /**
         * BEGIN TESTS SENT
         */

        // Employee sent
        console.log("TESTING FOR SENT NOTIFICATIONS EMPLOYEE");
        let request_sent = defaultRequestBody();

        request_sent.most_recent_first = true;
        request_sent.filters.sent = true;

        response = await request(app).post('/notifications/').set('Cookie', employee_cookie).send(request_sent);

        expect(response.status).toBe(200);  // response should be {notifications: []}
        expect(response.body.notifications.length).toEqual(1);    // should be notif1
        expect(response.body.notifications[0].notification.type).toEqual("news");
        console.log(response.body.notifications[0]);
        console.log(response.body.notifications[0].notification);

        // User1 sent
        console.log("TESTING FOR SENT NOTIFICATIONS USER1");

        request_sent = defaultRequestBody();

        // request_sent.most_recent_first = true;
        request_sent.filters.sent = true;

        response = await request(app).post('/notifications/').set('Cookie', user1_cookie).send(request_sent);

        expect(response.status).toBe(200);  // response should be {notifications: []}
        console.log("WHAT???");
        console.log(response.body);
        expect(response.body.notifications.length).toEqual(1);    // should be notif3
        expect(response.body.notifications[0].notification.type).toEqual("policy");

        // User2 sent
        request_sent = defaultRequestBody();

        request_sent.most_recent_first = true;
        request_sent.filters.sent = true;
        request_sent.filters.type = "CLAIMS";

        response = await request(app).post('/notifications/').set('Cookie', user2_cookie).send(request_sent);

        expect(response.status).toBe(200);  // response should be {notifications: []}
        expect(response.body.notifications.length).toEqual(1);    // should be notif2
        expect(response.body.notifications[0].notification.type).toEqual("claim");

        // User2 sent with filter on NEWS
        request_sent.filters.type = "NEWS";

        response = await request(app).post('/notifications/').set('Cookie', user2_cookie).send(request_sent);

        expect(response.status).toBe(200);  // response should be {notifications: []}
        expect(response.body.notifications).toEqual([]);    // should be []

        // User2 sent with filter on POLICY
        request_sent.filters.type = "POLICY";

        response = await request(app).post('/notifications/').set('Cookie', user2_cookie).send(request_sent);

        expect(response.status).toBe(200);  // response should be {notifications: []}
        expect(response.body.notifications).toEqual([]);    // should be []

        /**
         * TEST SENT NOTIFICATION FOR user2, BUT ADD A 4th NOTIFICATION THAT USER2 SENDS
         * 
         * user2 -> notification2 -> [employee, user1]
         * user2 -> notification4 -> [employee]
         * 
         * notification2: middle creation date, middle due date, claim type
         * notification4: newest creation date, oldest expiration date, news type
         *          
         */

        const notification4 = {     // oldest creation date, newest expiration date
            userid: "testuser2",
            type: "news",               // news, claim, policy
            title: "Test Notification 4",
            body: "This is a test notification news.",
            recipients: ["testemployee"],
            newsDetails: {
                expirationdate: oldestDate,
                type: "breaking news",
            }
        }
        response = await request(app)
            .post('/notifications/create')
            .set('Cookie', user2_cookie) // Set the session cookie
            .send(notification4);

        

        // Sort notifications by most recent first
        requestbody = defaultRequestBody();
        requestbody.filters.sent = true;
        requestbody.most_recent_first = true;

        response = await request(app).post('/notifications/').set('Cookie', user2_cookie).send(requestbody);

        expect(response.status).toBe(200);  // response should be {notifications: []}
        expect(response.body.notifications.length).toEqual(2);   // should be notif4, notif2
        expect(response.body.notifications[0].notification.type).toEqual("news");
        expect(response.body.notifications[1].notification.type).toEqual("claim");

        // Sort notifications by due date
        requestbody = defaultRequestBody();
        requestbody.filters.sent = true;
        requestbody.most_recent_first = true;
        requestbody.filters.args.due_earliest_first = false;

        response = await request(app).post('/notifications/').set('Cookie', user2_cookie).send(requestbody);

        expect(response.status).toBe(200);  // response should be {notifications: []}
        expect(response.body.notifications.length).toEqual(2);   // should be notif2, notif4
        expect(response.body.notifications[1].notification.type).toEqual("news");
        expect(response.body.notifications[0].notification.type).toEqual("claim");

        // Get 1 of two notifications sent
        requestbody = defaultRequestBody();
        requestbody.filters.sent = true;
        requestbody.most_recent_first = true;
        requestbody.filters.type = "CLAIMS";

        response = await request(app).post('/notifications/').set('Cookie', user2_cookie).send(requestbody);

        expect(response.status).toBe(200);  // response should be {notifications: []}
        expect(response.body.notifications.length).toEqual(1);   // should be notif2, notif4
        expect(response.body.notifications[0].notification.type).toEqual("claim");
    });

    
});







