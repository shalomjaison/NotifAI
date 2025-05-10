-- This data is for testing extraction of news notifications from the database to be displayed in the inbox.
-- TRUNCATE TABLE
--   notificationrecipients,
--   newsnotifications,
--   claimnotifications,
--   notifications
-- RESTART IDENTITY
-- CASCADE;

BEGIN;

INSERT INTO Notifications (userid, type, title, body, isread, isarchived, datecreated) VALUES
('mike_wasabi', 'news', 'Your Tasks This Week:', 'TASKS THIS WEEK:

1. Familiarize yourself with the NotifAI web app and UI.

2. Upload the ics file for the calendar I sent you via gmail. This contains your tasks that are also mentioned in this notification.

3. There has been a change in a policy for one of your customers, and you need to contact them to inform them of the change. Message Mac Cheese with username mac_cheese about policy update #1324 at https://docs.google.com/document/d/17Jl_KZ_kKN5pB9UIcEfYPAvEx2OtPzcEOVotEQh8xHY/edit?tab=t.0

4. There is a claim filed that requires additional information. Please contact the customer and inform them of the next steps. The claim number is 123456, and the customer is Mac Cheese with username mac_cheese. Request that Mac sends Police Verification Report and Medical Records.
', false, false, NOW()),

('mike_wasabi', 'news', 'Welcome to Life Assured!', 'Hi Joy!

Welcome to the team at Life Assured! We are in the middle of transitioning our notification messaging system to the web app NotifAI. You have been selected to try the new messaging system, and you have been assigned a group of customers that also opted in to using NotifAI. To be specific, you will be receiving customers originally assigned to Tiff Taco, but she is retiring. You should expect another notification from me about your tasks this week. 

Mike Wasabi', false, false, NOW());

INSERT INTO NewsNotifications (notificationid, expirationdate, type) VALUES
(1, '2025-05-20', 'urgent'),
(2, '2025-05-20', 'general');

INSERT INTO NotificationRecipients (notificationid, recipientid, datesent) VALUES
(1, 'joy_smiles', NOW()),
(2, 'joy_smiles', NOW());

COMMIT;
