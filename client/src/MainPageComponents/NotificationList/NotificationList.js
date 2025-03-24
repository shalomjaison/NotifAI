import React from 'react';
import NotificationItem from '../NotificationItem/NotificationItem';
import './NotificationList.css';

const NotificationList = ({ notifications }) => {
  return (
    <div>
      {notifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
      {/* Pagination */}
      <div className="notification-list-pagination">
        <button className="notification-list-pagination-button">
          ←
        </button>
        <span className="notification-list-pagination-text">Page 1 of 10</span>
        <button className="notification-list-pagination-button">
          →
        </button>
      </div>
    </div>
  );
};

export default NotificationList;

