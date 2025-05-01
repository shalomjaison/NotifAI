import React from 'react';
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import Filter from "./NotificationFilter/Filter";
import Search from "./Search/Search";
import NotificationList from "./NotificationList/NotificationList";
import ClaimsAlert from "./ClaimsAlert/ClaimsAlert";
import Reminders from "./Reminders/Reminders";
import GenAI from "./genAI/genAI"
import axios from 'axios';
import EmailPopup from '../EmailPopupComponent/EmailPopup/EmailPopup'; 
import { useState, useEffect } from 'react';

// Main component to handle routing
function MainPage() { 

  const filter = new Filter();
  filter.addSubscriber(x => {console.log("hi, notifications retrieved after updating filter is"); console.log(x); });

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenAIVisible, setIsGenAIVisible] = useState(false); // state for Gemini visibility
  const [selectedNotificationWrapper, setSelectedNotificationWrapper] = useState(null); // track emailPopup visibility


  const toggleGenAI = () => {
    setIsGenAIVisible(prevState => !prevState);
    console.log(isGenAIVisible)
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/me', {
          withCredentials: true,
        });
        setUserData(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Sample data for notifications - link to API later
  const allNotifications = [
    {
      id: 1,
      source: "Slack",
      sender: "Sahana Satish",
      message: "Hey! the UI mock-up is up",
      time: "1 hour ago",
      icon: "slack"
    },
    {
      id: 2,
      source: "Claims",
      sender: "Claims Department",
      message: "Your payment of $50 is due tommorrow",
      time: "1 hour ago",
      details: "Hello this is to inform you....."
    },
    {
      id: 3,
      source: "Slack",
      sender: "Gin Park",
      message: "Your payment of $300 is due tommorrow",
      time: "1 hour ago",
      icon: "slack"
    },
    {
      id: 4,
      source: "Claims",
      sender: "Claims Department",
      message: "We are contacting you about your car's extended...",
      time: "1 hour ago",
      details: "Hello this is to inform you....."
    }
  ];

  // State for filtered notifications
  // filteredNotifications and notifications are each a list of objects, each object contains three fields: from, to, and notification
  // from: is array of strings, usernames of senders
  // to: is array of strings, usernames of receivers
  // notification: is object, contains fields of notification info following ER diagram, also contains args field, which is an 
  // object containing fields specific to a type of notification (duedate, priority) following ER diagram

  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  filter.addSubscriber(notificationList => {

    setNotifications(notificationList);

    if(searchTerm != ""){
      setFilteredNotifications(getFilteredNotifications(searchTerm, notificationList));
    }
    else{
      setFilteredNotifications(notificationList);
    }
  });

  const getFilteredNotifications = (searchTerm, notifList) => {

    return notifList.filter(notificationWrapper => 
      {
        let senders = "";
        let receivers = "";
        notificationWrapper.from.forEach((username) => {
          senders += username;
        });
        notificationWrapper.to.forEach((username) => {
          receivers += username;
        });
        let source = "";
        if("source" in notificationWrapper.notification){
          source = notificationWrapper.notification.source;
        }

        return  (notificationWrapper.notification.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notificationWrapper.notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        senders.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receivers.toLowerCase().includes(searchTerm.toLowerCase())) ||
        source.toLowerCase().includes(searchTerm.toLowerCase());
      }
    );
  }

  // Handle search functionality
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);

    if (searchTerm == "" || !searchTerm.trim()) {
      // If search is empty, show all notifications
      setFilteredNotifications(notifications);
    } else {
      // Filter notifications that contain the search term (case-insensitive)
      const filtered = getFilteredNotifications(searchTerm, notifications);
      setFilteredNotifications(filtered);
    }
  };

  const handleNotificationSelect = async (notificationWrapper) => {

    try {
      // Marking notif as read
      let id = notificationWrapper.notification.id;
      await axios.post("http://localhost:3000/notifications/claims/" + id + "/mark-read", { withCredentials: true }); // send cookies with request

    } catch (error) {
      console.error("Mark notification as read error:" + error);
    }

    setSelectedNotificationWrapper(notificationWrapper);
  };

  const handleBackFromPopup = () => {
    setSelectedNotificationWrapper(null); // Clear the selected notification to hide popup
  };

  // Sample reminders - link to API later
  const reminders = [
    {
      id: 1,
      title: "Meeting",
      location: "ILC S121",
      date: "March 4th, 2025 at 4 pm"
    },
    {
      id: 2,
      title: "Lunch",
      location: "ILC S121",
      date: "March 4th, 2025 at 4 pm"
    }
  ];
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar component */}
      <Sidebar />

      {/* Main content area */}
      <div style={{ flexGrow: 1, padding: '20px', overflow: 'auto' }}>
        {/* Header component */}
        <Header userData={userData} onGenAIClick={toggleGenAI} />

        <div style={{
          display: 'flex',
          gap: '20px',
          height: 'calc(100vh - 120px)'
        }}>
          {/* Notifications section */}
          <div style={{ flexBasis: '70%' }}>

            {/* Search and Filter */}
            <div  className="search-filter-wrapper" style={{position: 'relative'}}>
              {/* Search component with onSearch handler */}
                <Search onSearch={handleSearch} />
                {filter.renderButton()}
            </div>

            {/*Filter Bubbles and Filter Select */}
            <div style={{flexBasis: '70%'}}>
              
              <div style={{zIndex: 1, position: 'absolute'}}>
                  { filter.renderFilterMenu()}
              </div>

            </div>

            {/* Notification list with filtered notifications */}
            {/* Conditionally render NotificationList or EmailPopup */}
            {selectedNotificationWrapper ? (
              <EmailPopup 
                subject={selectedNotificationWrapper.notification.title} 
                fromEmail={selectedNotificationWrapper.from.join(', ')} // Format array to string
                toEmail={selectedNotificationWrapper.to.join(', ')}     // Format array to string
                content={selectedNotificationWrapper.notification.body}
                onBack={handleBackFromPopup}
                onDelete={() => { /* TBD */ }}
              />
            ) : (
              <NotificationList 
                notifications={filteredNotifications} 
                onNotificationSelect={handleNotificationSelect} 
              />
            )}
          </div>

          {/* Right sidebar - claims and reminders */}
          <div style={{ flexBasis: '30%'}}>
            {/* Claims alert */}
            <ClaimsAlert selectNotifFunc = {(notificationWrapper) => handleNotificationSelect(notificationWrapper)}/>
            {/* Reminders section */}
            <Reminders reminders={reminders} />
          </div>
        </div>
      </div>
      {isGenAIVisible && <GenAI />}
    </div>
  );
}

export default MainPage;