import React from 'react';
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import Search from "./Search/Search";
import NotificationList from "./NotificationList/NotificationList";
import ClaimsAlert from "./ClaimsAlert/ClaimsAlert";
import Reminders from "./Reminders/Reminders";
import axios from 'axios';
import { useState, useEffect } from 'react';

// Main component to handle routing
function MainPage() { 
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
  const [filteredNotifications, setFilteredNotifications] = useState(allNotifications);
  // filter.addSubscriber(notificationList => setFilteredNotifications(notificationList))
  // Handle search functionality
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      // If search is empty, show all notifications
      setFilteredNotifications(filteredNotifications);
    } else {
      // Filter notifications that contain the search term (case-insensitive)
      const filtered = allNotifications.filter(notification => 
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotifications(filtered);
    }
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
        <Header userData={userData} />

        <div style={{
          display: 'flex',
          gap: '20px',
          height: 'calc(100vh - 120px)'
        }}>
          {/* Notifications section */}
          <div style={{ flexBasis: '70%' }}>
            {/* Search component with onSearch handler */}
            <Search onSearch={handleSearch} />

            {/* Notification list with filtered notifications */}
            <NotificationList notifications={filteredNotifications} />
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