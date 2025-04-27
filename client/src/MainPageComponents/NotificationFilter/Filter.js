/**
 * Team Data Baes
 * 4/3/2025
 * 
 * Filter is a React class component that returns 2 UI through methods: UI for filter button and UI for filter menu.
 * Both UI's depend on shared data in constructor, most important data in Filter object is currentFilterRequest, 
 * which is the request body to be sent to the backend server at /notifications. 
 * 
 * The currentFilterRequest is always up to date
 * whenever a button is pressed in the filter menu. Whenever currentFilterRequest is updated, a POST request is sent to get array of 
 * notifications, after that all callbacks are called, add a callback using addSubscriber(fxn)
 * 
 */

import React, { createElement, useEffect, useState } from 'react';
import './Filter.css';
import axios from 'axios';

class Filter extends React.Component {

    constructor(props){
        super(props);    

        [this.FilterMenuOpen, this.setFilterMenuOpen] = useState(false);

        // although this seems like copy pasta from getDefaultFilterRequest, this is needed for initial render of UI
        this.currentFilterRequest = {
            most_recent_first: true,
            // max_notifications: 50,
            filters: {
                sent: false,
                args: {

                }
            }
        };
        [this.currentFilterRequest, this.setCurrentFilterRequest] = useState(this.getDefaultFilterRequest());

        [this.isLoading, this.setIsLoading] = useState(true);

        useEffect(() => {
            // Send POST request to backend server at /notifications with currentFilterRequest as request body whenever currentFilterRequest is updated
            const fetchUserNotifications = async () => {
                try {
                    const response = await axios.post('http://localhost:3000/notifications', this.currentFilterRequest, { withCredentials: true});
                    const notifications = response.data.notifications;

                    this.subscribers.forEach(fxn => {
                        fxn(notifications);
                    });
                } catch (error) {
                console.error('Error fetching notifications:', error);
                } finally {
                    this.setIsLoading(false);
                }
            }

            fetchUserNotifications();

        }, [this.currentFilterRequest]);

        this.subscribers = [];
    }
    test(){
        return <div><p>aksdkadhjsada</p></div>;
    }

    // Default filter request to pass as request body in HTTP request to backend server at /notifications POST
    getDefaultFilterRequest(){
        const output = {
            most_recent_first: true,
            // max_notifications: 50,
            filters: {
                sent: false,
                args: {

                }
            }
        };
        // Do not reset text when adjusting other filters (selecting notification type resets filter)
        if(this.currentFilterRequest && "filters" in this.currentFilterRequest && "text" in this.currentFilterRequest.filters){
            if(this.currentFilterRequest.filters.text == "" || this.currentFilterRequest.filters.text == undefined){
                delete this.currentFilterRequest.filters.text;
            }
            else{
                output.filters.text = this.currentFilterRequest.filters.text;
            }
        }
        return output;
    }

    getCurrentFilterRequest(){
        return this.currentFilterRequest;
    }

   /**
    * Adds fxn to subscribers list
    * 
    * Whenever the filter is updated, send POST request to backend server at /notifications, 
    * if success and return array of objects, call all subscribers with the array of objects
    * 
    * USAGE EXAMPLE: [notifications, setNotifications] = useState([]);
    *                const filter = new Filter();
    *               filter.addSubscriber(x => {setNotifications(x);});  // notifications will now have x, which is the array of notification objects
    * 
    * (Object[] => *) fxn: any function that takes in array of objects Z, each object Z contains three fields: from, to, and notification
    * from: is array of strings, usernames of senders
    * to: is array of strings, usernames of receivers
    * notification: is object, contains fields of notification info following ER diagram, also contains args field, which is an 
    * object containing fields specific to a type of notification (duedate, priority) following ER diagram
    */
    addSubscriber(fxn){
        this.subscribers.push(fxn);
    }

    updateTextFilter(str){
        const temp = Object.assign({}, this.currentFilterRequest);
        temp.filters.text = str;
        this.setCurrentFilterRequest(temp);
    }

    renderButton(){

        const toggleDropdown = () => {
            this.setFilterMenuOpen(!this.FilterMenuOpen);
        };
    
        // if(option == "button"){
            return (
                <div>
                    <header className="filter-container">

            
                        <button onClick={toggleDropdown}>
                            <div className="filter-icon">
                                {/* Filter icon SVG */}
                                <svg width="29px" height="29" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 5L10 5M10 5C10 6.10457 10.8954 7 12 7C13.1046 7 14 6.10457 14 5M10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5M14 5L20 5M4 12L16 12M16 12C16 13.1046 16.8954 14 18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12ZM8 19L20 19M8 19C8 17.8954 7.10457 17 6 17C4.89543 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21C7.10457 21 8 20.1046 8 19Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </div>
                        </button>
            

        
                    </header>
                </div>
            );
    }

    renderFilterMenu(){

        const setClaims = () => {
            // const temp = Object.assign({}, this.currentFilterRequest);
            const temp = this.getDefaultFilterRequest();
            temp.filters.type = "CLAIMS";
            this.setCurrentFilterRequest(temp);
        };
        const setNews = () => {
            const temp = this.getDefaultFilterRequest();
            temp.filters.type = "NEWS";
            this.setCurrentFilterRequest(temp);
        };
        const setPolicy = () => {
            const temp = this.getDefaultFilterRequest();
            temp.filters.type = "POLICY";
            this.setCurrentFilterRequest(temp);
        }
        const setAll = () => {
            const temp = this.getDefaultFilterRequest();
            this.setCurrentFilterRequest(temp);
        }

        // Returns JSX rows for buttons to press in the select one of each category depending on which type is selected
        // NOTE: if none of a group is selected (such as neither sent nor received selected), then the default is to select both sent and received
        // exception is date and due date, if no date sort selected, default is to have most recent first
        const getSingleSelectColumnByType = (type) => {

            const postedOldestButton = () => {
                return (
                    <div>
                        <button onClick={() => {

                            // do stuff
                            const temp = Object.assign({}, this.currentFilterRequest);
                            temp.most_recent_first = false;
                            delete temp.filters.args.due_earliest_first;
                            this.setCurrentFilterRequest(temp);

                        }} className="filter-menu-row" style={{backgroundColor: (("most_recent_first" in this.currentFilterRequest) && !this.currentFilterRequest.most_recent_first) && !("due_earliest_first" in this.currentFilterRequest.filters.args) ? ('#CBC3E3') : ("white")}}>    
                            <p>Posted Oldest</p>
                        </button>
                    </div>
                );
            };
            const postedRecentButton = () => {
                return (
                    <div>
                        <button onClick={() => {

                            // do stuff
                            const temp = Object.assign({}, this.currentFilterRequest);
                            temp.most_recent_first = true;
                            delete temp.filters.args.due_earliest_first;
                            this.setCurrentFilterRequest(temp);

                        }} className="filter-menu-row" style={{backgroundColor: (!("most_recent_first" in this.currentFilterRequest) || this.currentFilterRequest.most_recent_first) && !("due_earliest_first" in this.currentFilterRequest.filters.args) ? ('#CBC3E3') : ("white")}}>
                            <p>Posted Recent</p>
                        </button>
                    </div>
                );
            };
            const dueEarliestButton = () => {
                return (
                    <div>
                        <button onClick={() => {

                            // do stuff
                            const temp = Object.assign({}, this.currentFilterRequest);
                            temp.filters.args.due_earliest_first = true;
                            this.setCurrentFilterRequest(temp);

                        }} className="filter-menu-row" style={{backgroundColor: (("due_earliest_first" in this.currentFilterRequest.filters.args) && this.currentFilterRequest.filters.args.due_earliest_first) ? ('#CBC3E3') : ("white")}}>
                            <p>Due Earliest</p>
                        </button>
                    </div>
                );
            };
            const dueLatestButton = () => {
                return (
                    <div>
                        <button onClick={() => {

                            // do stuff
                            const temp = Object.assign({}, this.currentFilterRequest);
                            temp.filters.args.due_earliest_first = false;
                            this.setCurrentFilterRequest(temp);

                        }} className="filter-menu-row" style={{backgroundColor: (("due_earliest_first" in this.currentFilterRequest.filters.args) && !this.currentFilterRequest.filters.args.due_earliest_first) ? ('#CBC3E3') : ("white")}}>
                            <p>Due Latest</p>
                        </button>
                    </div>
                );
            };

            const sentButton = () => {
                return (
                    <div>
                        <button onClick={() => {

                            // do stuff
                            const temp = Object.assign({}, this.currentFilterRequest);
                            temp.filters.sent = true;
                            this.setCurrentFilterRequest(temp);

                        }} className="filter-menu-row" style={{backgroundColor: (this.currentFilterRequest.filters.sent) ? ('#CBC3E3') : ("white")}}>
                            <p>Sent</p>
                        </button>
                    </div>
                );
            };
            const receivedButton = () => {
                return (
                    <div>
                        <button onClick={() => {

                            // do stuff
                            const temp = Object.assign({}, this.currentFilterRequest);
                            temp.filters.sent = false;
                            this.setCurrentFilterRequest(temp);

                        }} className="filter-menu-row" style={{backgroundColor: (!this.currentFilterRequest.filters.sent) ? ('#CBC3E3') : ("white")}}>
                            <p>Received</p>
                        </button>
                    </div>
                );
            };

            if(type == "CLAIMS"){
                return (
                    <div>
                        {/* Buttons to filter by date */}
                        <p>Select One</p>
                        {postedRecentButton()}
                        {postedOldestButton()}
                        {dueEarliestButton()}
                        {dueLatestButton()}

                        <p>Select One</p>
                        {sentButton()}
                        {receivedButton()}

                    </div>
                );
            }
            else if(type == "NEWS"){
                return (
                    <div>
                        {/* Buttons to filter by date */}
                        <p>Select One</p>
                        {postedRecentButton()}
                        {postedOldestButton()}
                        {dueEarliestButton()}
                        {dueLatestButton()}

                        <p>Select One</p>
                        {sentButton()}
                        {receivedButton()}

                    </div>
                );
            }
            else if(type == "POLICY"){
                return (
                    <div>
                        {/* Buttons to filter by date */}

                        <p>Select One</p>
                        {postedRecentButton()}
                        {postedOldestButton()}

                        <p>Select One</p>
                        {sentButton()}
                        {receivedButton()}

                    </div>
                );
            }
            // all
            return (
                <div>
                    {/* Buttons to filter by date */}

                    <p>Select One</p>
                    {postedRecentButton()}
                    {postedOldestButton()}

                    <p>Select One</p>
                    {sentButton()}
                    {receivedButton()}

                </div>
            );
        }

        // Returns JSX rows for buttons to press depending on which type is selected
        const getMultipleSelectColumnByType = (type) => {

            const highPriority = () => {
                return (
                    <div>
                        <button onClick={() => {

                            // do stuff
                            const temp = Object.assign({}, this.currentFilterRequest);
                            if("priority" in temp.filters.args && temp.filters.args.priority == "HIGH_PRIORITY"){    // click second time to unselect filter, as priority is optional filter
                                delete temp.filters.args.priority;
                            }
                            else{
                                temp.filters.args.priority = "HIGH_PRIORITY";
                            }
                            this.setCurrentFilterRequest(temp);

                        }} className="filter-menu-row" style={{backgroundColor: ("priority" in this.currentFilterRequest.filters.args) && (this.currentFilterRequest.filters.args.priority == "HIGH_PRIORITY") ? ('#CBC3E3') : ("white")}}>
                            <p>High Priority</p>
                        </button>
                    </div>
                );
            };            
            
            const medPriority = () => {
                return (
                    <div>
                        <button onClick={() => {

                            // do stuff
                            const temp = Object.assign({}, this.currentFilterRequest);
                            if("priority" in temp.filters.args && temp.filters.args.priority == "MEDIUM_PRIORITY"){    // click second time to unselect filter, as priority is optional filter
                                delete temp.filters.args.priority;
                            }
                            else{
                                temp.filters.args.priority = "MEDIUM_PRIORITY";
                            }
                            this.setCurrentFilterRequest(temp);

                        }} className="filter-menu-row" style={{backgroundColor: ("priority" in this.currentFilterRequest.filters.args) && (this.currentFilterRequest.filters.args.priority == "MEDIUM_PRIORITY") ? ('#CBC3E3') : ("white")}}>
                            <p>Medium Priority</p>
                        </button>
                    </div>
                );
            };
            
            const lowPriority = () => {
                return (
                    <div>
                        <button onClick={() => {

                            // do stuff
                            const temp = Object.assign({}, this.currentFilterRequest);
                            if("priority" in temp.filters.args && temp.filters.args.priority == "LOW_PRIORITY"){    // click second time to unselect filter, as priority is optional filter
                                delete temp.filters.args.priority;
                            }
                            else{
                                temp.filters.args.priority = "LOW_PRIORITY";
                            }
                            this.setCurrentFilterRequest(temp);

                        }} className="filter-menu-row" style={{backgroundColor: ("priority" in this.currentFilterRequest.filters.args) && (this.currentFilterRequest.filters.args.priority == "LOW_PRIORITY") ? ('#CBC3E3') : ("white")}}>
                            <p>Low Priority</p>
                        </button>
                    </div>
                );
            };

            const readButton = () => {
                return (
                    <div>
                        <button onClick={() => {

                            // do stuff
                            const temp = Object.assign({}, this.currentFilterRequest);
                            if("read" in temp.filters && temp.filters.read){    // click second time to unselect filter, as read is optional filter
                                delete temp.filters.read;
                            }
                            else{
                                temp.filters.read = true;
                            }
                            this.setCurrentFilterRequest(temp);

                        }} className="filter-menu-row" style={{backgroundColor: ("read" in this.currentFilterRequest.filters) && (this.currentFilterRequest.filters.read) ? ('#CBC3E3') : ("white")}}>
                            <p>Read</p>
                        </button>
                    </div>
                );
            };

            const unreadButton = () => {
                return (
                    <div>
                        <button onClick={() => {

                            // do stuff
                            const temp = Object.assign({}, this.currentFilterRequest);
                            if("read" in temp.filters && !temp.filters.read){    // click second time to unselect filter, as read is optional filter
                                delete temp.filters.read;
                            }
                            else{
                                temp.filters.read = false;
                            }
                            this.setCurrentFilterRequest(temp);

                        }} className="filter-menu-row" style={{backgroundColor: ("read" in this.currentFilterRequest.filters) && (!this.currentFilterRequest.filters.read) ? ('#CBC3E3') : ("white")}}>
                            <p>Unread</p>
                        </button>
                    </div>
                );
            };

            const completeButton = () => {
                return (
                    <div>
                        <button onClick={() => {

                            // do stuff
                            const temp = Object.assign({}, this.currentFilterRequest);
                            if("is_completed" in temp.filters.args && temp.filters.args.is_completed){    // click second time to unselect filter, as is_completed is optional filter
                                delete temp.filters.args.is_completed;
                            }
                            else{
                                temp.filters.args.is_completed = true;
                                delete temp.filters.args.is_overdue;
                            }
                            this.setCurrentFilterRequest(temp);

                        }} className="filter-menu-row" style={{backgroundColor: ("is_completed" in this.currentFilterRequest.filters.args) && (this.currentFilterRequest.filters.args.is_completed) ? ('#CBC3E3') : ("white")}}>
                            <p>Complete</p>
                        </button>
                    </div>
                );
            };

            const incompleteButton = () => {
                return (
                    <div>
                        <button onClick={() => {

                            // do stuff
                            const temp = Object.assign({}, this.currentFilterRequest);
                            if("is_completed" in temp.filters.args && !temp.filters.args.is_completed){    // click second time to unselect filter, as is_completed is optional filter
                                delete temp.filters.args.is_completed;
                            }
                            else{
                                temp.filters.args.is_completed = false;
                                delete temp.filters.args.is_overdue;
                            }
                            this.setCurrentFilterRequest(temp);

                        }} className="filter-menu-row" style={{backgroundColor: ("is_completed" in this.currentFilterRequest.filters.args) && (!this.currentFilterRequest.filters.args.is_completed) ? ('#CBC3E3') : ("white")}}>
                            <p>Incomplete</p>
                        </button>
                    </div>
                );
            };

            const overdueButton = () => {
                return (
                    <div>
                        <button onClick={() => {

                            // do stuff
                            const temp = Object.assign({}, this.currentFilterRequest);
                            if("is_overdue" in temp.filters.args && !temp.filters.args.is_completed){    // click second time to unselect filter, as is_completed is optional filter
                                delete temp.filters.args.is_overdue;
                            }
                            else{
                                temp.filters.args.is_overdue = true;
                                delete temp.filters.args.is_completed;
                            }
                            this.setCurrentFilterRequest(temp);

                        }} className="filter-menu-row" style={{backgroundColor: ("is_overdue" in this.currentFilterRequest.filters.args) && (this.currentFilterRequest.filters.args.is_overdue) ? ('#CBC3E3') : ("white")}}>
                            <p>Overdue</p>
                        </button>
                    </div>
                );
            };

            if(type == "CLAIMS"){
                return (
                    <div>
                        {/* Buttons to filter by priority */}
                        <p>Select At Most One</p>
                        {highPriority()}
                        {medPriority()}
                        {lowPriority()}

                        <p>Select At Most One</p>
                        {readButton()}
                        {unreadButton()}

                        <p>Select At Most One</p>
                        {completeButton()}
                        {incompleteButton()}
                        {overdueButton()}
                    </div>
                );
            }
            else if(type == "NEWS"){
                return (
                    <div>
                        <p>Select At Most One</p>
                        {readButton()}
                        {unreadButton()}
                    </div>
                );
            }
            else if(type == "POLICY"){
                return (
                    <div>
                        <p>Select At Most One</p>
                        {readButton()}
                        {unreadButton()}
                    </div>
                );
            }
            // all
            return (
                <div>
                    <p>Select At Most One</p>
                    {readButton()}
                    {unreadButton()}
                </div>
            );
        }

        return(
            <div>
                {this.FilterMenuOpen && (
                    <div className="filter-menu-container" style={{ width: "100%"}}>

                        {/* Column for selecting notification type */}
                        <div className="filter-menu-column" style={{ width: "33%", height: "300px"}}>

                            <div className="menu-item">
                                <button onClick={setClaims} className="filter-menu-row" style={{backgroundColor: (this.currentFilterRequest.filters.type == "CLAIMS") ? ('#CBC3E3') : ("white")}}>
                                    <p>Claims</p>
                                </button>

                                <button onClick={setNews} className="filter-menu-row" style={{backgroundColor: (this.currentFilterRequest.filters.type == "NEWS") ? ('#CBC3E3') : ('white')}}>
                                    <p>News</p>
                                </button>

                                <button onClick={setPolicy} className="filter-menu-row" style={{backgroundColor: (this.currentFilterRequest.filters.type == "POLICY") ? ('#CBC3E3') : ('white')}}>
                                    <p>Policy</p>
                                </button>

                                <button onClick={setAll} className="filter-menu-row" style={{backgroundColor: !("type" in this.currentFilterRequest.filters) ? ('#CBC3E3') : ('white')}}>
                                    <p>All</p>
                                </button>
                            </div>

                        </div>

                        {/* Column for selecting one of each (such as increasing/decreasing date) */}
                        <div className="filter-menu-column" style={{ width: "33%", height: "300px"}}>
                            {getSingleSelectColumnByType(this.currentFilterRequest.filters.type)}
                        </div>

                        {/* Column for selecting all that apply */}
                        <div className="filter-menu-column" style={{ width: "33%", height: "300px"}}>
                            {getMultipleSelectColumnByType(this.currentFilterRequest.filters.type)}
                        </div>
                    </div>
                )}
            </div>
        ); 
    }

    renderFilterDisplayScreen(){

    }
    
}

export default Filter;







