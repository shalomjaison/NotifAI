import React from 'react';
import NotificationIcon from '../NotificationIcon/NotificationIcon';
import './NotificationItem.css';

const NotificationItem = ({ notification }) => {
  return (
    <div className="notification-item-container">
      <NotificationIcon source={notification.source} />

      <div className="notification-item-content">
        <div className="notification-item-header">
          <h3 className="notification-item-sender">
            {notification.sender} {notification.source === 'Slack' ? '(from Slack)' : ''}
          </h3>
          <span className="notification-item-time">
            {notification.time}
          </span>
        </div>

        <p className="notification-item-message">
          {notification.message}
        </p>

        {notification.details && (
          <p className="notification-item-details">
            {notification.details}
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;

