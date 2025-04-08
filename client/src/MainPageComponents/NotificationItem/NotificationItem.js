import React from 'react';
import NotificationIcon from '../NotificationIcon/NotificationIcon';
import './NotificationItem.css';

/**
 * NotificationWrapper is an object, with from (String[]), to (String[]), and notification (Object) properties.
 * 
 */
const NotificationItem = ({ notificationWrapper }) => {

  const notification = notificationWrapper.notification;
  let source = "";
  // notificationWrapper.from.forEach((username) => {sources += username + ", "});
  if("source" in notification){
    source = notification.source;
  }

  let senders = "From: ";
  notificationWrapper.from.forEach((username) => {
    senders += username + ", ";
  });
  let receivers = "To: ";
  notificationWrapper.to.forEach((username) => {
    receivers += username + ", ";
  });

  return (
    <div className="notification-item-container">
      <NotificationIcon source={source} />

      <div className="notification-item-content">
        <div className="notification-item-header">
          <h3 className="notification-item-sender">
            {senders} {notification.source === 'Slack' ? '(from Slack)' : ''}
          </h3>
          <h3 className="notification-item-sender">
            {receivers}
          </h3>
          <span className="notification-item-time">
            {new Date(notification.datecreated).toDateString()}
          </span>
        </div>

        <p className="notification-item-message">
          {notification.title}
        </p>

        {notification.details && (
          <p className="notification-item-details">
            {notification.body}
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;

