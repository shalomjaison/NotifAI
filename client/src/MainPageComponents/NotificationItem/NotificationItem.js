import React from 'react';
import NotificationIcon from '../NotificationIcon/NotificationIcon';
import './NotificationItem.css';

/**
 * NotificationWrapper is an object, with from (String[]), to (String[]), and notification (Object) properties.
 * 
 * from: is array of strings, usernames of senders
 * to: is array of strings, usernames of receivers
 * notification: is object, contains fields of notification info following ER diagram, also contains args field, which is an 
 * object containing fields specific to a type of notification (duedate, priority) following ER diagram
 * 
 */
const NotificationItem = ({ notificationWrapper, onNotificationSelect }) => {


  const notification = notificationWrapper.notification;
  let source = "";
  if("source" in notification){
    source = notification.source;
  }

  const formattedDate = new Date(notification.datecreated).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const contentPreview = notification.body ? 
    (notification.body.length > 80 ? notification.body.substring(0, 80) + '...' : notification.body) : '';
  

  let senders = "From: ";
  notificationWrapper.from.forEach((username) => {
    senders += username + ", ";
  });
  let receivers = "To: ";
  notificationWrapper.to.forEach((username) => {
    receivers += username + ", ";
  });

  return (
      <div 
        className="notification-item-container" 
        onClick={() => onNotificationSelect(notificationWrapper)} // Call the passed function
        style={{ cursor: 'pointer' }} // Add cursor style for better UX
      >
      <div className="notif-icon-container">
        <NotificationIcon source={source} />
      </div>

      <div className="notification-item-content">
        <div className="notification-item-header">
          <h3 className="notification-item-title">
          {notification.title}
          {source === 'Slack' && <span className="notification-source"> (from Slack)</span>}
          </h3>
          <span className="notification-item-time">
            {formattedDate}
          </span>
        </div>

        {contentPreview && (
          <p className="notification-item-preview">
            {contentPreview}
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;

