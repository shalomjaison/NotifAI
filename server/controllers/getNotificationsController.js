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
            a = Date.parse(a.args.due_date);
            b = Date.parse(b.args.due_date);
            return new Date(a.args.due_date) - new Date(b.args.due_date);
        }
    }
    if("due_earliest_first" in body.filters.args && !body.filters.args.due_earliest_first){
        return (a, b) => {
            a = Date.parse(a.args.due_date);
            b = Date.parse(b.args.due_date);
            return new Date(b.args.due_date) - new Date(a.args.due_date);
        }
    }
    if("most_recent_first" in body.filters.args && !body.filters.args.most_recent_first){
        return (a, b) => {
            a = Date.parse(a.date_created);
            b = Date.parse(b.date_created);
            return new Date(b.date_created) - new Date(a.date_created);
        }
    }
    if("most_recent_first" in body.filters.args && !body.filters.args.most_recent_first){
        return (a, b) => {
            a = Date.parse(a.date_created);
            b = Date.parse(b.date_created);
            return new Date(a.date_created) - new Date(b.date_created);
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
            if(key == "sent"){
                if(body.filters.sent){
                    output.push((notification) => (notification.user_id == user_id));
                }
                else{
                    output.push((notification) => (notification.user_id != user_id));
                }
            }
            else if(key == "type"){
                if(body.filters.type == "CLAIMS"){
                    output.push((notification) => (notification.type == "CLAIMS"));
                }
                else if(body.filters.type == "NEWS"){
                    output.push((notification) => (notification.type == "NEWS"));
                }
                else{   // POLICY
                    output.push((notification) => (notification.type == "POLICY"));
                }
            }
            else if(key == "text"){

            }
            else if(key == "read"){
                if(body.filters.read){
                    output.push((notification) => (notification.is_read));
                }
                else{
                    output.push((notification) => (!notification.is_read));
                }
            }
            else if(key == "archived"){
                if(body.filters.archived){
                    output.push((notification) => (notification.is_archived));
                }
                else{
                    output.push((notification) => (!notification.is_archived));
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
                    output.push((notification) => (notification.args.priority == "HIGH_PRIORITY"));
                }
                else if(body.filters.args.priority == "MEDIUM_PRIORITY"){
                    output.push((notification) => (notification.args.priority == "MEDIUM_PRIORITY"));
                }
                else{   // LOW_PRIORITY
                    output.push((notification) => (notification.args.priority == "LOW_PRIORITY"));
                }
            }
        }
    }

    return output;
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
        const username = req.session.username;
        const id = req.session.id;
        const email = req.session.email;

        // CODE FOR GET NOTIFICATIONS FROM DATABASE HERE

        let notifications = [];   // I ASSUME NOTIFICATIONS IS AN ARRAY OF NOTIFICATION OBJECTS FOLLOWING THE API DATA MODEL BUT IN JSON FORMAT

        const validRequest = verifyValidRequest(req.body);
        if(validRequest != "OK"){
            return res.status(400).json({ reason: validRequest });
        }

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

        return res.status(200).json({notifications: notifications}); 
    } catch (error) {
        console.error('Error fetching notifications:', error.message);
        return res.status(500).json({ error: 'Failed to retrieve notifications.' });
    }
};

module.exports = { // Export the controller functions with different names.
    getNotifications: getNotificationsController,
};