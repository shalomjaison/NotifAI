/**
 * Team Data Baes
 * 4/5/2025
 * 
 * Controller for fetching notifications
 * 
 */

/**
 * Returns "OK" if request valid, otherwise returns error message
 */
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const NotificationRecipient = require('../models/notificationRecipientModel');
const NewsNotification = require('../models/newsModel');
const PolicyNotification = require('../models/policyModel');

const verifyValidRequest = (body) => {

    if(typeof body !== 'object' || body === null){
        return "Request body is not a valid JSON object";
    }
    if(!body.hasOwnProperty('filters')){
        return "Request body does not have filters property";
    }
    if(typeof body.filters !== 'object' || body.filters === null){
        return "Request body filters property is not a valid JSON object";
    }
    if(!body.filters.hasOwnProperty('sent')){
        return "Request body does not have send property";
    }
    if(typeof body.filters.sent !== 'boolean'){
        return "Request body filters property's sent property (req.body.filters.sent) is not a boolean";
    }
    if(!body.filters.hasOwnProperty("args")){
        return "Request body does not have args property inside filters property";
    }
    if(typeof body.filters.args !== 'object' || body.filters.args === null){
        return "Request body filters property's args property (req.body.filters.args) is not a valid JSON object";
    }
    return "OK";
};

/**
 * Assumes body is valid json object matching the API data model
 * 
 * returns a comparator that takes in a and b, which are two notification objects matching database schema in JSON format
 */
const getComparator = (body) => {
    if("due_earliest_first" in body.filters.args && body.filters.args.due_earliest_first){
        return (a, b) => {
            if("expirationdate" in a.args){
                a = Date.parse(a.args.expirationdate);
            }
            else if("duedate" in a.args){
                a = Date.parse(a.args.duedate);
            }
            if("expirationdate" in b.args){
                b = Date.parse(b.args.expirationdate);
            }
            else if("duedate" in b.args){
                b = Date.parse(b.args.duedate);
            }

            return a - b;
        }
    }
    if("due_earliest_first" in body.filters.args && !body.filters.args.due_earliest_first){
        return (a, b) => {
            if("expirationdate" in a.args){
                a = Date.parse(a.args.expirationdate);
            }
            else if("duedate" in a.args){
                a = Date.parse(a.args.duedate);
            }
            if("expirationdate" in b.args){
                b = Date.parse(b.args.expirationdate);
            }
            else if("duedate" in b.args){
                b = Date.parse(b.args.duedate);
            }

            return b - a;
        }
    }
    if("most_recent_first" in body.filters.args && !body.filters.args.most_recent_first){
        return (a, b) => {
            a = Date.parse(a.datecreated);
            b = Date.parse(b.datecreated);
            return b - a;
        }
    }
    if("most_recent_first" in body.filters.args && !body.filters.args.most_recent_first){
        return (a, b) => {
            a = Date.parse(a.datecreated);
            b = Date.parse(b.datecreated);
            return a - b;
        }
    }

    return (a, b) => {return 0;}; // default comparator, no sorting
}

/**
 * Returns array of functions, each function takes in a notification object matching database schema in json and returns true/false
 * 
 */
const getFilters = (body, user_id) => {
    const output = [];

    for(const [key, value] of Object.entries(body.filters)){
        if(typeof key !== 'object'){
            // if(key == "method"){
            // WE ARE DOING IN APP NOW, WE CAN DO IT HERE LATER FOR SMS EMAIL
            // }
            if(key == "read"){
                if(body.filters.read){
                    output.push((notification) => (notification.isread));
                }
                else{
                    output.push((notification) => (!notification.isread));
                }
            }
            else if(key == "archived"){
                if(body.filters.archived){
                    output.push((notification) => (notification.isarchived));
                }
                else{
                    output.push((notification) => (!notification.isarchived));
                }
            }
        }
    }

    for(const [key, value] of Object.entries(body.filters.args)){
        if(typeof key !== 'object'){

            if(key == "is_completed"){
                if(body.filters.args.is_completed){
                    output.push((notification) => ("is_completed" in notification.args && notification.args.is_completed));
                }
                else{
                    output.push((notification) => (!("is_completed" in notification.args) || !notification.args.is_completed));
                }
            }
            else if(key == "is_overdue"){
                if(body.filters.args.is_overdue){
                    output.push((notification) => ("is_overdue" in notification.args && notification.args.is_overdue));
                }
                else{
                    output.push((notification) => (!("is_overdue" in notification.args) || !notification.args.is_overdue));
                }
            }
            else if(key == "priority"){
                if(body.filters.args.priority == "HIGH_PRIORITY"){
                    output.push((notification) => (("priority" in notification.args) && notification.args.priority == "HIGH_PRIORITY"));
                }
                else if(body.filters.args.priority == "MEDIUM_PRIORITY"){
                    output.push((notification) => (("priority" in notification.args) && notification.args.priority == "MEDIUM_PRIORITY"));
                }
                else{   // LOW_PRIORITY
                    output.push((notification) => (("priority" in notification.args) && notification.args.priority == "LOW_PRIORITY"));
                }
            }
        }
    }

    return output;
};

/**
 * Does nothing for now
 * 
 */
const getNotificationsSent = async (username) => {
    return [];
}

/**
 * Gets all notifications that a user received by type
 * 
 * Returns a list of json objects. The immediate keys inside each json object are properties of the Notification data model.
 * Each json object also has a property called args, which is a json object that contains all the properties of the notification type data model, 
 * such as ClaimsNotification, NewsNotification, PolicyNotification
 * 
 */
const getNotificationsReceived = async (username, body) => {
    let type = "ALL";
    if("type" in body.filters){
        type = body.filters.type;
    }
    if(type == "ALL"){

        const userWithNotifications = await User.findOne({
            where: { username: username }, // Replace 'username' with the appropriate identifier
            include: [
              {
                model: Notification,
                include: [
                    { model: NewsNotification},
                    // { model: ClaimsNotification},
                    // { model: PolicyNotification},
                ],
                through: { attributes: [] }, // Exclude the join table attributes
              },
            ],
          });
        
        const notif_list = userWithNotifications.Notifications.map((obj) => {
            const notification = obj.dataValues;
            // if("ClaimsNotification" in notification){
            //     delete notification.ClaimsNotification;
            //     notification.args = obj.ClaimsNotification.dataValues;    // put all properties of ClaimsNotification into args
            // }
            if("NewsNotification" in notification){
                delete notification.NewsNotification;
                notification.args = obj.NewsNotification.dataValues;    // put all properties of NewsNotification into args
            }
            // if("PolicyNotification" in notification){
            //     delete notification.PolicyNotification;
            //     notification.args = obj.PolicyNotification.dataValues;    // put all properties of PolicyNotification into args
            // }
            return notification;
        });
        return notif_list;
    }
    else if(type == "CLAIMS"){

        // const userWithNotifications = await User.findOne({
        //     where: { username: username }, // Replace 'username' with the appropriate identifier
        //     include: [
        //       {
        //         model: Notification,
        //         include: [
        //             {
        //                 model: ClaimsNotification,
        //             }
        //         ],
        //         through: { attributes: [] }, // Exclude the join table attributes
        //       },
        //     ],
        //   });
        
        // const notif_list = userWithNotifications.Notifications.map((obj) => {
        //     const notification = obj.dataValues;
        //     delete notification.ClaimsNotification;
        //     notification.args = obj.ClaimsNotification.dataValues;    // put all properties of NewsNotification into args
        //     return notification;
        // });
        // return notif_list;
    }
    else if(type == "NEWS"){
        const userWithNotifications = await User.findOne({
            where: { username: username }, // Replace 'username' with the appropriate identifier
            include: [
              {
                model: Notification,
                include: [
                    {
                        model: NewsNotification,
                    }
                ],
                through: { attributes: [] }, // Exclude the join table attributes
              },
            ],
          });

        const notif_list = userWithNotifications.Notifications.map((obj) => {
            const notification = obj.dataValues;
            delete notification.NewsNotification;
            notification.args = obj.NewsNotification.dataValues;    // put all properties of NewsNotification into args
            return notification;
        });

        return notif_list;
    }
    else if(type == "POLICY"){   // POLICY

        // const userWithNotifications = await User.findOne({
        //     where: { username: username }, // Replace 'username' with the appropriate identifier
        //     include: [
        //       {
        //         model: Notification,
        //         include: [
        //             {
        //                 model: PolicyNotification,
        //             }
        //         ],
        //         through: { attributes: [] }, // Exclude the join table attributes
        //       },
        //     ],
        //   });
        
        // const notif_list = userWithNotifications.Notifications.map((obj) => {
        //     const notification = obj.dataValues;
        //     delete notification.PolicyNotification;
        //     notification.args = obj.PolicyNotification.dataValues;    // put all properties of NewsNotification into args
        //     return notification;
        // });

        // return notif_list;

    }
    return [];
};

/**
 * Used to get notifications from the database with some filters/sorting done on it
 * 
 * req body is a json object, refer to the API documentation for the format
 * 
 * RETURNS a json object with notifications property. notifications property is an array of objects Z.
 * Each Z object has the following properties:
 * - from: array of strings, represents senders
 * - to : array of strings, represents receivers
 * 
 * - notification: of the Notification data model from database schema in some json format, the json format is probably similar to database schema
 * 
 * NOTE: RIGHT NOW, IMPLEMENTATION IS A BIT INEFFICIENT. I AM SURE PROPER WAY IS TO QUERY DATABASE WITH THE FILTERS. RIGHT NOW
 * I WILL JUST GET ALL NOTIFICATIONS FOR USER FROM DATABASE, AND THEN FILTER THEM AFTER THAT. WE CAN FOCUS ON EFFICIENCY AFTER MVP.
 * ALSO, WE CAN LEARN ABOUT HOW EFFICIENT BACKEND IS WITH TESTS, MAYBE THIS IS FAST ENOUGH EVEN IF INEFFICIENT.
 * 
 */
const getNotificationsController = async (req, res) => {
    console.log("post request received for /notifications (getting notifications with sort and filters), req body is");
    console.log(req.body);
    try {
        const username = req.session.user.username;
        const id = req.session.id;
        const email = req.session.email;

        const validRequest = verifyValidRequest(req.body);
        if(validRequest != "OK"){
            return res.status(400).json({ reason: validRequest });
        }

        let notifications = (req.body.filters.sent) ? (await getNotificationsSent(username)) : (await getNotificationsReceived(username, req.body));   
 
        const comparator = getComparator(req.body);

        const filters = getFilters(req.body, id);   // array of functions

        filters.forEach((fil) => {
            notifications = notifications.filter(fil);
        });

        notifications.sort(comparator);

        //check max notifications
        if("max_notifications" in req.body && typeof req.body.max_notifications == "number"){
            notifications = notifications.slice(0, req.body.max_notifications);
        }

        // formatting list of notifications to include send and receiver names
        if(req.body.filters.sent){
            notifications = notifications.map((x) => {
                return {
                    from: [username],
                    to: [],
                    notification: x,
                };
            });
        }
        else{
            notifications = notifications.map((x) => {
                return {
                    from: [],
                    to: [username],
                    notification: x,
                };
            });
        }

        console.log("returning notifications list of size " + notifications.length);
        return res.status(200).json({notifications: notifications}); 
    } catch (error) {
        console.error('Error fetching notifications:', error.message);
        return res.status(500).json({ error: 'Failed to retrieve notifications.' });
    }
};

module.exports = { // Export the controller functions with different names.
    getNotifications: getNotificationsController,
};