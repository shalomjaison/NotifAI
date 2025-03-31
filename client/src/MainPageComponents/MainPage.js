import React from 'react';
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import Search from "./Search/Search";
import NotificationList from "./NotificationList/NotificationList";
import ClaimsAlert from "./ClaimsAlert/ClaimsAlert";
import Reminders from "./Reminders/Reminders";

// Main component to handle routing
function MainPage() {
    // Sample data for notifications - link to API later
    const notifications = [
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
      }
    ];
  
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
    console.log("Main component rendered!")
    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Sidebar component */}
        <Sidebar />
  
        {/* Main content area */}
        <div style={{ flexGrow: 1, padding: '20px', overflow: 'auto' }}>
          {/* Header component */}
          <Header />
  
          <div style={{
            display: 'flex',
            gap: '20px',
            height: 'calc(100vh - 120px)'
          }}>
            {/* Notifications section */}
            <div style={{ flexBasis: '70%' }}>
              {/* Search component */}
              <Search />
  
              {/* Notification list */}
              <NotificationList notifications={notifications} />
            </div>
  
            {/* Right sidebar - claims and reminders */}
            <div style={{ flexBasis: '30%' }}>
              {/* Claims alert */}
              <ClaimsAlert />
  
              {/* Reminders section */}
              <Reminders reminders={reminders} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default MainPage;