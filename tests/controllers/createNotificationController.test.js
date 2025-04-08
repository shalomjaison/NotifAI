const request = require('supertest');
const { app, startServer } = require('../../server/server'); 
const sequelize = require('../../server/db/db'); 
const User = require('../../server/models/userModel'); 
const Notification = require('../../server/models/notificationModel'); 
const NewsNotification = require('../../server/models/newsModel'); 
const NotificationRecipient = require('../../server/models/notificationRecipientModel'); 
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

    const newsNotificationData = {
      userid: 'testuser',
      type: 'news',
      title: 'Test News Notification',
      body: 'This is a test news notification.',
      recipients: ['testuser2'],
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

    // Verify that the notification recipient was created
    const notificationRecipient = await NotificationRecipient.findOne({
      where: { notificationid: notification.id, recipientid: 'testuser2' },
    });
    expect(notificationRecipient).not.toBeNull();
  });
});







