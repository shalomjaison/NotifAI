// tests/claimMarkRead.test.js
const request   = require("supertest");
const bcrypt    = require("bcrypt");
const { app, startServer, stopServer } = require("../../server/server");
const User                         = require("../../server/models/userModel");
const Notification                 = require("../../server/models/notificationModel");
const NotificationRecipient        = require("../../server/models/notificationRecipientModel");

let cookie;

beforeAll(async () => {
  // 1) start the server & reset the DB
  await startServer();

  // 2) create two users with hashed passwords
  const hash = await bcrypt.hash("irrelevant", 10);
  await User.create({
    username: "tester1",
    fname:    "T1",
    lname:    "One",
    email:    "t1@ex.com",
    password: hash,
    role:     "customer",
  });
  await User.create({
    username: "tester2",
    fname:    "T2",
    lname:    "Two",
    email:    "t2@ex.com",
    password: hash,
    role:     "customer",
  });

  // 3) log in as tester2 to get auth cookie
  const res = await request(app)
    .post("/users/login")
    .send({ email: "t2@ex.com", password: "irrelevant" });
  cookie = res.headers["set-cookie"];
});

afterAll(async () => {
  await stopServer();
});

describe("POST /notifications/claims/:id/mark-read", () => {
  let noteId;

  beforeEach(async () => {
    // ensure a fresh, unread claim notification for tester2
    const note = await Notification.create({
      userid:     "tester1",
      type:       "claims",
      title:      "Unit Test Claim",
      body:       "please review",
      isread:     false,
      isarchived: false,
    });
    noteId = note.id;

    await NotificationRecipient.create({
      notificationid: noteId,
      recipientid:    "tester2",
    });
  });

  afterEach(async () => {
    // wipe out notifications
    await NotificationRecipient.destroy({ where: {} });
    await Notification.destroy({ where: {} });
  });

  it("marks an existing claim as read (204)", async () => {
    // verify it's unread initially
    let before = await Notification.findByPk(noteId);
    expect(before.isread).toBe(false);

    // call mark-read
    await request(app)
      .post(`/notifications/claims/${noteId}/mark-read`)
      .set("Cookie", cookie)
      .expect(204);

    // verify it's now read
    const after = await Notification.findByPk(noteId);
    expect(after.isread).toBe(true);
  });

  it("returns 404 for non-existent id", async () => {
    await request(app)
      .post("/notifications/claims/9999/mark-read")
      .set("Cookie", cookie)
      .expect(404);
  });
});
