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
    username: 'testuser',
    fname: 'Test',
    lname: 'User',
    email: 'test@example.com',
    password: hashedPassword,
    role: 'customer',
  });

  await User.create({
    username: 'testuser2',
    fname: 'Test2',
    lname: 'User2',
    email: 'test2@example.com',
    password: hashedPassword,
    role: 'customer',
  });

  await User.create({
    username: 'testuser3',
    fname: 'Test3',
    lname: 'User3',
    email: 'test3@example.com',
    password: hashedPassword,
    role: 'customer',
  });
});

// After all tests, close the database connection
afterAll(async () => {
  await sequelize.close();
  console.log('Database connection closed after tests.');
});

describe('POST /notifications/create', () => {
  it('should create a news notification and store it in the database', async () => {
    // Create a test user and get the session cookie
    const loginResponse = await request(app)
      .post('/users/login')
      .send({ email: 'test@example.com', password: 'testpassword' });
    const cookie = loginResponse.headers['set-cookie'];

    const newsNotificationData = { // this data would be gathered from the form inputs on the compose box
      userid: 'testuser',
      type: 'news',
      title: 'Test News Notification',
      body: 'This is a test news notification.',
      recipients: ['testuser2', 'testuser3'],
      newsDetails: {
        expirationdate: '2024-12-31',
        type: 'breaking',
        details: 'This is a test news detail.',
      },
    };

    const response = await request(app)
      .post('/notifications/create')
      .set('Cookie', cookie) // Set the session cookie
      .send(newsNotificationData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Notification created and set successfully.');

    // Verify that the notification was created in the database
    const notification = await Notification.findOne({
      where: { title: 'Test News Notification' },
    });
    expect(notification).not.toBeNull();
    expect(notification.type).toBe('news');

    // Verify that the news details were created
    const newsDetails = await NewsNotification.findOne({
      where: { notificationid: notification.id },
    });
    expect(newsDetails).not.toBeNull();
    expect(newsDetails.type).toBe('breaking');

    // Verify that the notification recipients were created
    const notificationRecipient = await NotificationRecipient.findOne({
      where: { notificationid: notification.id, recipientid: 'testuser2' },
    });
    expect(notificationRecipient).not.toBeNull();

    const notificationRecipient2 = await NotificationRecipient.findOne({
      where: { notificationid: notification.id, recipientid: 'testuser3' },
    });
    expect(notificationRecipient).not.toBeNull();
  });

  it('should create a policy notification and store it in the database', async () => {
    // Create a test user and get the session cookie
    const loginResponse = await request(app)
      .post('/users/login')
      .send({ email: 'test@example.com', password: 'testpassword' });
    const cookie = loginResponse.headers['set-cookie'];

    const policyNotificationData = { // this data would be gathered from the form inputs on the compose box
      userid: 'testuser',
      type: 'policy',
      title: 'Test policy Notification',
      body: 'This is a test policy notification.',
      recipients: ['testuser2', 'testuser3'],
      policyDetails: {
        policyid: 123,
        changestopremium: 'changes to premium test',
        billingreminderdate: '2024-12-31',
      },
    };

    const response = await request(app)
      .post('/notifications/create')
      .set('Cookie', cookie) // Set the session cookie
      .send(policyNotificationData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Notification created and set successfully.');

    // Verify that the notification was created in the database
    const notification = await Notification.findOne({
      where: { title: 'Test policy Notification' },
    });
    expect(notification).not.toBeNull();
    expect(notification.type).toBe('policy');

    // Verify that the news details were created
    const policyDetails = await PolicyNotification.findOne({
      where: { notificationid: notification.id },
    });
    expect(policyDetails).not.toBeNull();
    expect(policyDetails.changestopremium).toBe('changes to premium test');

    // Verify that the notification recipients were created
    const notificationRecipient = await NotificationRecipient.findOne({
      where: { notificationid: notification.id, recipientid: 'testuser2' },
    });
    expect(notificationRecipient).not.toBeNull();

    const notificationRecipient2 = await NotificationRecipient.findOne({
      where: { notificationid: notification.id, recipientid: 'testuser3' },
    });
    expect(notificationRecipient2).not.toBeNull();
  });

  it('should create a claims notification and store it in the database', async () => {
    // Create a test user and get the session cookie
    const loginResponse = await request(app)
      .post('/users/login')
      .send({ email: 'test@example.com', password: 'testpassword' });
    const cookie = loginResponse.headers['set-cookie'];

    const claimNotificationData = { // this data would be gathered from the form inputs on the compose box
      userid: 'testuser',
      type: 'claim',
      title: 'Test claim Notification',
      body: 'This is a test claim notification.',
      recipients: ['testuser2', 'testuser3'],
      claimDetails: {
        insuredname: 'bob',
        claimantname: 'joe',
        tasktype: 'test task type for claim notification',
        duedate: '2024-12-31',
        lineofbusiness: 'test line of business for claim notification',
        description: 'test description for claim notification',
        priority: 'test priority for claim notification',
        iscompleted: true,
      },
    };

    const response = await request(app)
      .post('/notifications/create')
      .set('Cookie', cookie) // Set the session cookie
      .send(claimNotificationData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Notification created and set successfully.');

    // Verify that the notification was created in the database
    const notification = await Notification.findOne({
      where: { title: 'Test claim Notification' },
    });
    expect(notification).not.toBeNull();
    expect(notification.type).toBe('claim');

    // Verify that the claim details were created
    const claimDetails = await ClaimNotification.findOne({
      where: { notificationid: notification.id },
    });
    expect(claimDetails).not.toBeNull();
    expect(claimDetails.priority).toBe('test priority for claim notification');

    // Verify that the notification recipients were created
    const notificationRecipient = await NotificationRecipient.findOne({
      where: { notificationid: notification.id, recipientid: 'testuser2' },
    });
    expect(notificationRecipient).not.toBeNull();

    const notificationRecipient2 = await NotificationRecipient.findOne({
      where: { notificationid: notification.id, recipientid: 'testuser3' },
    });
    expect(notificationRecipient2).not.toBeNull();
  });
});







