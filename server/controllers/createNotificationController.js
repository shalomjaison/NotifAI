const Notification = require('../models/notificationModel');
const NotificationRecipient = require('../models/notificationRecipientModel');
const User = require('../models/userModel');
const NewsNotification = require('../models/newsModel');
const ClaimNotification = require('../models/claimModel');
const PolicyNotification = require('../models/policyModel');


const createNotificationController = async (req, res) => {
    try {
        const { 
            userid,
            type,
            title,
            body,
            recipients, // Array of recipient usernames
            newsDetails,
            claimDetails,
            policyDetails,
         } = req.body
         console.log("Create notification request received:", req.body);

         // Validate required fields
        if (!userid || !type || !title || !body || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({ message: "Missing required fields: userid, type, title, body, and at least one recipient are required." });
        }

        // Validating that the sender exists
        const sender = await User.findByPk(userid);
        if (!sender) {
            return res.status(400).json({ message: "Invalid sender ID." });
        }

        // Validating that all recipients exist
        const recipientUsers = await User.findAll({
            where: {
                username: recipients,
            },
        })

        if (recipientUsers.length !== recipients.length) {
            return res.status(400).json({ message: "One or more recipient usernames are invalid." });
        }

        // Creating the main notification
        const newNotification = await Notification.create({
            userid,
            type,
            title,
            body,
        });
        console.log("Main notification created:", newNotification.toJSON());

        // Creating entries in NotificationRecipient for each recipient
        const notificationRecipientPromises = recipients.map(async (recipientid) => {
            return NotificationRecipient.create({
                notificationid: newNotification.id,
                recipientid,
            });
        });

        await Promise.all(notificationRecipientPromises);
        console.log("Notification recipients created.");

        // Creating specific notification details based on type (news, claim, or policy)
        switch (type) {
            case 'news':
                if (!newsDetails) {
                    return res.status(400).json({ message: "News details are required for news notifications."});
                }
                await NewsNotification.create({
                    notificationid: newNotification.id,
                    ...newsDetails,
                });
                console.log("News notification details created.");
                break;
            case 'claim':
                if (!claimDetails) {
                    return res.status(400).json({ message: "Claim details are required for claim notifications."});
                }
                await ClaimNotification.create({
                    notificationid: newNotification.id,
                    ...claimDetails,
                });
                console.log("Claim notification details created.");
                break;
            case 'policy':
                if (!policyDetails) {
                    return res.status(400).json({ message: "Policy details are required for policy notifications."});
                }
                await PolicyNotification.create({
                    notificationid: newNotification.id,
                    ...policyDetails,
                });
                console.log("Policy notification details created.");
                break;
            default:
                console.log("No specific notification details needed for this type.");
                break;
        }
        return res.status(201).json({
            message: "Notification created and set successfully.",
            notification: newNotification,
        });
    }
    catch (error) {
        console.error("Error creating notification:", error);
        return res.status(500).json({ error: "Failed to create notification." });
    }

}

module.exports = {
    createNotification: createNotificationController,
};