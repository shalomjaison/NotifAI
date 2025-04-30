// tests/controllers/getNotificationController.test.js

const request = require('supertest');
const { app, startServer, stopServer } = require('../../server/server'); // Adjust path as needed
const sequelize = require('../../server/db/db'); // Adjust path as needed
const bcrypt = require('bcrypt');

// Import Models
const User = require('../../server/models/userModel'); // Adjust path as needed
const Notification = require('../../server/models/notificationModel'); // Adjust path as needed
const NotificationRecipient = require('../../server/models/notificationRecipientModel'); // Adjust path as needed
const NewsNotification = require('../../server/models/newsModel'); // Adjust path as needed
const PolicyNotification = require('../../server/models/policyModel'); // Adjust path as needed
const ClaimNotification = require('../../server/models/claimModel'); // Adjust path as needed

// Store IDs of created test data
let senderUser, recipientUser1, recipientUser2;
let newsNotification, policyNotification, claimNotification;
let newsNotificationId, policyNotificationId, claimNotificationId;
let cookie; // Session cookie

// --- Test Data Details ---
const senderUsername = 'notifSender';
const recipient1Username = 'notifRecip1';
const recipient2Username = 'notifRecip2';
const password = 'password123';

const newsDetailsData = {
    expirationdate: '2025-12-31T23:59:59.000Z', // Use ISO format or ensure DB compatibility
    type: 'urgent',
    // Add other fields from newsModel if necessary
};

const policyDetailsData = {
    policyid: 789,
    changestopremium: 'Increase due to risk assessment',
    billingreminderdate: '2025-05-15T00:00:00.000Z',
     // Add other fields from policyModel if necessary
};

const claimDetailsData = {
    insuredname: 'Claim Insured',
    claimantname: 'Claim Claimant',
    tasktype: 'Initial Review',
    duedate: '2025-05-10T00:00:00.000Z',
    lineofbusiness: 'Auto',
    priority: 'High',
    iscompleted: false,
    // Add other fields from claimModel if necessary
};
// --- End Test Data Details ---


// Before all tests, establish connection, sync DB, create users and notifications
beforeAll(async () => {
    await startServer();
    await sequelize.authenticate();
    console.log('Database connection established for getNotificationController tests.');
    await sequelize.sync({ force: true });
    console.log('Database synced for getNotificationController tests.');

    // --- Create Test Users ---
    const hashedPassword = await bcrypt.hash(password, 12);
    senderUser = await User.create({
        username: senderUsername, fname: 'Sender', lname: 'User', email: 'sender@test.com', password: hashedPassword, role: 'agent'
    });
    recipientUser1 = await User.create({
        username: recipient1Username, fname: 'Recip1', lname: 'User', email: 'recip1@test.com', password: hashedPassword, role: 'customer'
    });
     recipientUser2 = await User.create({
        username: recipient2Username, fname: 'Recip2', lname: 'User', email: 'recip2@test.com', password: hashedPassword, role: 'customer'
    });
    console.log('Test users created.');

     // --- Log in a user to get cookie ---
     const loginResponse = await request(app)
     .post('/users/login') // Adjust login route if needed
     .send({ email: senderUser.email, password: password });
     expect(loginResponse.status).toBe(200);
     cookie = loginResponse.headers['set-cookie'];
     expect(cookie).toBeDefined();
     console.log('Test user logged in, cookie obtained.');

    // --- Create News Notification ---
    newsNotification = await Notification.create({
        userid: senderUser.username, // Sender's username
        type: 'news',
        title: 'Test News Notification',
        body: 'Body of the news notification.'
    });
    newsNotificationId = newsNotification.id;
    await NewsNotification.create({
        notificationid: newsNotificationId,
        ...newsDetailsData
    });
    await NotificationRecipient.create({
        notificationid: newsNotificationId,
        recipientid: recipient1Username // Recipient's username
    });
    console.log(`News Notification created with ID: ${newsNotificationId}`);

    // --- Create Policy Notification ---
    policyNotification = await Notification.create({
        userid: senderUser.username,
        type: 'policy',
        title: 'Test Policy Notification',
        body: 'Body of the policy notification.'
    });
    policyNotificationId = policyNotification.id;
    await PolicyNotification.create({
        notificationid: policyNotificationId,
        ...policyDetailsData
    });
    await NotificationRecipient.create({
        notificationid: policyNotificationId,
        recipientid: recipient1Username
    });
     await NotificationRecipient.create({ // Add second recipient for multi-recipient test
        notificationid: policyNotificationId,
        recipientid: recipient2Username
    });
    console.log(`Policy Notification created with ID: ${policyNotificationId}`);

    // --- Create Claim Notification ---
    claimNotification = await Notification.create({
        userid: senderUser.username,
        type: 'claim',
        title: 'Test Claim Notification',
        body: 'Body of the claim notification.'
    });
    claimNotificationId = claimNotification.id;
    await ClaimNotification.create({
        notificationid: claimNotificationId,
        ...claimDetailsData
    });
     await NotificationRecipient.create({
        notificationid: claimNotificationId,
        recipientid: recipient2Username
    });
    console.log(`Claim Notification created with ID: ${claimNotificationId}`);

});

// After all tests, clean up
afterAll(async () => {
    console.log('Cleaning up database after getNotificationController tests...');
    await sequelize.sync({ force: true });
    console.log('Database cleaned.');
    await sequelize.close();
    console.log('Database connection closed.');
    stopServer();
    console.log("Server stopped.");
});

// --- Test Suite ---
describe('GET /notifications/:id', () => {

    it('should return a formatted News Notification with details in args', async () => {
        const response = await request(app)
            .get(`/notifications/${newsNotificationId}`)
            .set('Cookie', cookie); // Include cookie if auth might be added later

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('from');
        expect(response.body).toHaveProperty('to');
        expect(response.body).toHaveProperty('notification');

        // Check 'from' and 'to' arrays
        expect(response.body.from).toEqual([senderUsername]);
        expect(response.body.to).toEqual([recipient1Username]);

        // Check basic notification fields
        const { notification } = response.body;
        expect(notification.id).toBe(newsNotificationId);
        expect(notification.userid).toBe(senderUsername);
        expect(notification.type).toBe('news');
        expect(notification.title).toBe('Test News Notification');
        expect(notification.body).toBe('Body of the news notification.');

        // Check 'args' contains the news details
        expect(notification).toHaveProperty('args');
        expect(notification.args).toMatchObject({
            ...newsDetailsData,
            expirationdate: newsDetailsData.expirationdate, // ISO string comparison
            notificationid: newsNotificationId // Args should also contain the foreign key
        });
        // Ensure original nested keys and recipient key are removed
        expect(notification).not.toHaveProperty('NewsNotification');
        expect(notification).not.toHaveProperty('PolicyNotification');
        expect(notification).not.toHaveProperty('ClaimNotification');
        expect(notification).not.toHaveProperty('NotificationRecipients');
    });

     it('should return a formatted Policy Notification with multiple recipients', async () => {
        const response = await request(app)
            .get(`/notifications/${policyNotificationId}`)
            .set('Cookie', cookie);

        expect(response.status).toBe(200);
        expect(response.body.from).toEqual([senderUsername]);
        // Use arrayContaining to handle potential order differences, though usually consistent
        expect(response.body.to).toEqual(expect.arrayContaining([recipient1Username, recipient2Username]));
        expect(response.body.to.length).toBe(2);


        const { notification } = response.body;
        expect(notification.id).toBe(policyNotificationId);
        expect(notification.type).toBe('policy');
        expect(notification.title).toBe('Test Policy Notification');

        expect(notification).toHaveProperty('args');
        expect(notification.args).toMatchObject({
            ...policyDetailsData,
            billingreminderdate: policyDetailsData.billingreminderdate, // ISO string comparison
            notificationid: policyNotificationId,
            policyid: policyDetailsData.policyid, // Verify specific numeric field
        });

        expect(notification).not.toHaveProperty('NewsNotification');
        expect(notification).not.toHaveProperty('PolicyNotification');
        expect(notification).not.toHaveProperty('ClaimNotification');
        expect(notification).not.toHaveProperty('NotificationRecipients');
    });

    it('should return a formatted Claim Notification with details in args', async () => {
        const response = await request(app)
            .get(`/notifications/${claimNotificationId}`)
            .set('Cookie', cookie);

        expect(response.status).toBe(200);
        expect(response.body.from).toEqual([senderUsername]);
        expect(response.body.to).toEqual([recipient2Username]); // Only one recipient for this one

        const { notification } = response.body;
        expect(notification.id).toBe(claimNotificationId);
        expect(notification.type).toBe('claim');
        expect(notification.title).toBe('Test Claim Notification');

        expect(notification).toHaveProperty('args');
        expect(notification.args).toMatchObject({
            ...claimDetailsData,
            duedate: claimDetailsData.duedate, // ISO string comparison
            notificationid: claimNotificationId,
            iscompleted: claimDetailsData.iscompleted // Verify specific boolean field
        });

        expect(notification).not.toHaveProperty('NewsNotification');
        expect(notification).not.toHaveProperty('PolicyNotification');
        expect(notification).not.toHaveProperty('ClaimNotification');
        expect(notification).not.toHaveProperty('NotificationRecipients');
    });


    it('should return 404 if the notification ID does not exist', async () => {
        const nonExistentId = 999999;
        const response = await request(app)
            .get(`/notifications/${nonExistentId}`)
            .set('Cookie', cookie);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Notification not found." });
    });

    it('should return 500 if the notification ID is invalid (e.g., not an integer/UUID depending on DB)', async () => {
        const invalidId = 'abc'; // Assuming IDs are integers
        const response = await request(app)
            .get(`/notifications/${invalidId}`)
            .set('Cookie', cookie);

        // The specific error might depend on DB/Sequelize config, but 500 is likely for unhandled query errors
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
        // You could check for a more specific error message if known
        expect(response.body.error).toContain('Failed to retrieve notifications.');
    });

});