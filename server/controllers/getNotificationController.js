/**
 * Team Data Baes
 * 4/5/2025
 * 
 * Controller for getting a single notification
 * 
 */

const Notification = require('../models/notificationModel');
const NotificationRecipient = require('../models/notificationRecipientModel');
const NewsNotification = require('../models/newsModel');
const PolicyNotification = require('../models/policyModel');
const ClaimNotification = require('../models/claimModel');

/**
 * Currently URL is /notifications/:id with GET request
 * 
 * Gets a single notification by notification id, returns an object with the following properties:
 * from: array of strings, usernames of senders
 * to: array of strings, usernames of receivers
 * notification: object, contains fields of notification info following notificationModel, also contains args field, which is an
 * object containing fields specific to a type of notification (Ex: newsModel)
 * 
 * Returns 200 with JSON if OK, 404 if not found, 500 if server side error
 */

const getNotificationController = async (req, res) => {
    
    try {

        const id = req.params.id; 
        console.log("get request received for /notifications (getting notification by notification id), id is " + id);

        let notification = await Notification.findOne({
            where: { id: id }, // Replace 'id' with the appropriate identifier
            include: [
                { model: NewsNotification},
                { model: ClaimNotification},
                { model: PolicyNotification},
                { 
                    model: NotificationRecipient,
                    attributes: ['recipientid'], // Include only the necessary attributes
                },
            ],
        });

        if (!notification || !notification.dataValues) {
            return res.status(404).json({ message: "Notification not found." });
        }
        // console.log(notification);
        notification = notification.dataValues;

        if("ClaimNotification" in notification && notification.ClaimNotification != null){
            console.log("ClaimNotification is in notification");
            notification.args = notification.ClaimNotification.dataValues;    // put all properties of ClaimNotification into args
            delete notification.ClaimNotification;
        }
        else if("NewsNotification" in notification && notification.NewsNotification != null){
            console.log("NewsNotification is in notification");
            notification.args = notification.NewsNotification.dataValues;    // put all properties of NewsNotification into args
            delete notification.NewsNotification;
        }
        else if("PolicyNotification" in notification && notification.PolicyNotification != null){
            console.log("PolicyNotification is in notification");
            notification.args = notification.PolicyNotification.dataValues;    // put all properties of PolicyNotification into args
            delete notification.PolicyNotification;
        }

        if("ClaimNotification" in notification && notification.ClaimNotification == null){
            delete notification.ClaimNotification;
        }
        if("NewsNotification" in notification && notification.NewsNotification == null){
            delete notification.NewsNotification;
        }
        if("PolicyNotification" in notification && notification.PolicyNotification == null){
            delete notification.PolicyNotification;
        }

        const output = {};
        const from = [];
        const to = [];
        from.push(notification.userid);
        
        notification.NotificationRecipients.forEach((recipient) => {
            to.push(recipient.recipientid);
        });
        delete notification.NotificationRecipients;

        output.from = from;
        output.to = to;
        output.notification = notification;

        console.log("returning notification with id " + id);
        return res.status(200).json(output); 

        // const userWithNotifications = await User.findOne({
        //     where: { username: username }, // Replace 'username' with the appropriate identifier
        //     include: [
        //       {
        //         model: Notification,
        //         include: [
        //             { model: NewsNotification},
        //             { model: ClaimNotification},
        //             { model: PolicyNotification},
        //         ],
        //         through: { attributes: [] }, // Exclude the join table attributes
        //       },
        //     ],
        //   });

        // const userWithNotifications = await User.findOne({
        //     where: { username: username }, // Replace 'username' with the appropriate identifier
        //     include: [
        //       {
        //         model: Notification,
        //         include: [
        //             {
        //                 model: ClaimNotification,
        //             }
        //         ],
        //         through: { attributes: [] }, // Exclude the join table attributes
        //         where: {type: "claim"}, // Filter for notifications of type "CLAIMS"
        //       },
        //     ],
        //   });

    } catch (error) {
        console.error('Error fetching notifications:', error.message);
        return res.status(500).json({ error: 'Failed to retrieve notifications.' });
    }
};

module.exports = { // Export the controller functions with different names.
    getNotification: getNotificationController,
};