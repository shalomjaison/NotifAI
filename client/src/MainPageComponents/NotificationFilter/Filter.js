import React, { createElement, useEffect, useState } from 'react';
import './Filter.css';
// import LogoutButton from '../LogoutButton/LogoutButton';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate

// const Filter = ({ userData }) => {

class Filter extends React.Component {
// class Filter {

    constructor(props){
        super(props);    
        // this.state = {
        //     isOpen: false,
        // };
        [this.FilterMenuOpen, this.setFilterMenuOpen] = useState(false);

        [this.currentFilterRequest, this.setCurrentFilterRequest] = useState(this.getDefaultFilterRequest()
            // most_recent_first: true,
            // max_notifications: 50,
            // filters: {
            //     sent: false,
            // }
        );
    }
    test(){
        return <div><p>aksdkadhjsada</p></div>;
    }

    // Default filter request to pass as request body in HTTP request to backend server at /notifications POST
    getDefaultFilterRequest(){
        return {
            most_recent_first: true,
            max_notifications: 50,
            filters: {
                sent: false,
                args: {

                }
            }
        };
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
                                <span className="filter-text">Filter</span>
                                {/* Filter icon SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
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
            console.log(this.currentFilterRequest);
        };
        const setNews = () => {
            const temp = this.getDefaultFilterRequest();
            temp.filters.type = "NEWS";
            this.setCurrentFilterRequest(temp);
            console.log(this.currentFilterRequest);
        };
        const setPolicy = () => {
            const temp = this.getDefaultFilterRequest();
            temp.filters.type = "POLICY";
            this.setCurrentFilterRequest(temp);
            console.log(this.currentFilterRequest);
        }
        const setAll = () => {
            const temp = this.getDefaultFilterRequest();
            this.setCurrentFilterRequest(temp);
            console.log(this.currentFilterRequest);
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
                        }} className="filter-menu-row" style={{backgroundColor: (!this.currentFilterRequest.filters.sent) ? ('#CBC3E3') : ("white")}}>
                            <p>Received</p>
                        </button>
                    </div>
                );
            };

            const read = () => {

            };
            const unread = () => {

            };

            const completed = () => {

            };
            const overdue = () => {

            };

            if(type == "CLAIMS"){
                return (
                    <div>
                        {/* Buttons to filter by date */}

                        {postedRecentButton()}
                        {postedOldestButton()}

                    </div>
                );
            }
            else if(type == "NEWS"){

            }
            else if(type == "POLICY"){

            }
            // all

        }

        // Returns JSX rows for buttons to press depending on which type is selected
        const getMultipleSelectColumnByType = (type) => {


            const complete = () => {};
            const incomplete = () => {};

            const highPriority = () => {};
            const medPriority = () => {};
            const lowPriority = () => {};

            if(type == "CLAIMS"){

            }
            else if(type == "NEWS"){

            }
            else if(type == "POLICY"){

            }
            // all

        }

        return(
            <div>
                {this.FilterMenuOpen && (
                    <div className="filter-menu-container" style={{ width: "100%"}}>

                        {/* Column for selecting notification type */}
                        <div className="filter-menu-column" style={{ width: "33%", height: "300px"}}>

                            <div>
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







