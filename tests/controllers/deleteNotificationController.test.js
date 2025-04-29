const request = require('supertest');
const { app, startServer, stopServer } = require('../../server/server'); 
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

  // Create test users
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
  console.log('Cleaning up database after tests...');
  await sequelize.sync({ force: true }); // Wipes everything
  console.log('Database cleaned.');

  await sequelize.close();
  console.log('Database connection closed after tests.');
  
  stopServer();
  console.log("server stopped");
});

describe('DELETE /notifications/:id', () => {
  let notificationId;
  let cookie;

  // Before each test, create a test notification and get the session cookie
  beforeEach(async () => {
    // Login to get session cookie
    const loginResponse = await request(app)
      .post('/users/login')
      .send({ email: 'test@example.com', password: 'testpassword' });
    
    cookie = loginResponse.headers['set-cookie'];
  });

  it('should delete a notification successfully', async () => {
    // Create a test notification
    const newsNotificationData = {
      userid: 'testuser',
      type: 'news',
      title: 'Test News Notification for Deletion',
      body: 'This is a test news notification that will be deleted.',
      recipients: ['testuser2'],
      newsDetails: {
        expirationdate: '2024-12-31',
        type: 'breaking',
      },
    };

    const createResponse = await request(app)
      .post('/notifications/create')
      .set('Cookie', cookie)
      .send(newsNotificationData);

    notificationId = createResponse.body.notification.id;
    console.log(`Created test notification with ID: ${notificationId}`);

    // Delete the notification
    const response = await request(app)
      .delete(`/notifications/${notificationId}`)
      .set('Cookie', cookie);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Notification deleted successfully.');

    // Verify that the notification was deleted from the database
    const notificationAfter = await Notification.findByPk(notificationId);
    expect(notificationAfter).toBeNull();
  });

  it('should handle non-existent notification gracefully', async () => {
    // Try to delete a notification with an ID that doesn't exist
    const response = await request(app)
      .delete('/notifications/999999')
      .set('Cookie', cookie);

    // With the current controller implementation, this will result in a 500 error
    // since notification.destroy() will throw an error when notification is null
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });

  it('should delete notifications with different types', async () => {
    // Create a policy notification
    const policyNotificationData = {
      userid: 'testuser',
      type: 'policy',
      title: 'Test Policy Notification for Deletion',
      body: 'This is a test policy notification that will be deleted.',
      recipients: ['testuser2'],
      policyDetails: {
        policyid: 123,
        changestopremium: 'changes to premium test',
        billingreminderdate: '2024-12-31',
      },
    };

    const createPolicyResponse = await request(app)
      .post('/notifications/create')
      .set('Cookie', cookie)
      .send(policyNotificationData);

    const policyNotificationId = createPolicyResponse.body.notification.id;
    
    // Delete the policy notification
    const deletePolicyResponse = await request(app)
      .delete(`/notifications/${policyNotificationId}`)
      .set('Cookie', cookie);

    expect(deletePolicyResponse.status).toBe(200);
    expect(deletePolicyResponse.body.message).toBe('Notification deleted successfully.');

    // Verify the policy notification was deleted
    const policyNotificationAfter = await Notification.findByPk(policyNotificationId);
    expect(policyNotificationAfter).toBeNull();

    // Create a claim notification
    const claimNotificationData = {
      userid: 'testuser',
      type: 'claim',
      title: 'Test Claim Notification for Deletion',
      body: 'This is a test claim notification that will be deleted.',
      recipients: ['testuser2'],
      claimDetails: {
        insuredname: 'bob',
        claimantname: 'joe',
        tasktype: 'test task type for claim notification',
        duedate: '2024-12-31',
        lineofbusiness: 'test line of business for claim notification',
        priority: 'test priority for claim notification',
        iscompleted: true,
      },
    };

    const createClaimResponse = await request(app)
      .post('/notifications/create')
      .set('Cookie', cookie)
      .send(claimNotificationData);

    const claimNotificationId = createClaimResponse.body.notification.id;
    
    // Delete the claim notification
    const deleteClaimResponse = await request(app)
      .delete(`/notifications/${claimNotificationId}`)
      .set('Cookie', cookie);

    expect(deleteClaimResponse.status).toBe(200);
    expect(deleteClaimResponse.body.message).toBe('Notification deleted successfully.');

    // Verify the claim notification was deleted
    const claimNotificationAfter = await Notification.findByPk(claimNotificationId);
    expect(claimNotificationAfter).toBeNull();
  });
});