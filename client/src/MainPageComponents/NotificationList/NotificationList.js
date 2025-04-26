  import React, { useState, useEffect } from 'react';
  import NotificationItem from '../NotificationItem/NotificationItem';
  import './NotificationList.css';

  // notifications is a list of objects, each object contains three fields: from, to, and notification
  // from: is array of strings, usernames of senders
  // to: is array of strings, usernames of receivers
  // notification: is object, contains fields of notification info following ER diagram, also contains args field, which is an 
  // object containing fields specific to a type of notification (duedate, priority) following ER diagram

  const NotificationList = ({ notifications = [], onNotificationSelect }) => {
    
    const [currentPage, setCurrentPage] = useState(1);
    // Setting a smaller number to make pagination visible with fewer items
    const [itemsPerPage] = useState(10);
    
    // Calculate total pages
    const totalPages = Math.ceil(notifications.length / itemsPerPage);
    
    // Get current notifications
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNotifications = notifications.slice(indexOfFirstItem, indexOfLastItem);
    
    // Handle page navigation
    const goToPreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };
    
    const goToNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };

    // Reset to first page when notifications change
    useEffect(() => {
      setCurrentPage(1);
    }, [notifications.length]);

    return (
      <div className="notification-list">
        {currentNotifications.length > 0 ? (
          currentNotifications.map(notificationWrapper => (
            <NotificationItem 
              key={notificationWrapper.notification.id} 
              notificationWrapper={notificationWrapper} 
              onNotificationSelect={onNotificationSelect} 
            />
          ))
        ) : (
          <div className="notification-empty">No notifications to display</div>
        )}
        
        {/* Always show pagination regardless of page count */}
        <div className="notification-list-pagination">
          <button 
            className="notification-list-pagination-button"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            style={{ visibility: currentPage === 1 ? 'hidden' : 'visible' }}
          >
            ←
          </button>
          <span className="notification-list-pagination-text">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button 
            className="notification-list-pagination-button"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            style={{ visibility: currentPage === totalPages || totalPages === 0 ? 'hidden' : 'visible' }}
          >
            →
          </button>
        </div>
      </div>
    );
  };

  export default NotificationList;