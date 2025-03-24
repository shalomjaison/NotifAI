import React from 'react';
import NotificationItem from '../NotificationItem/NotificationItem';

const NotificationList = ({ notifications }) => {
  return (
    <div>
      {notifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
      {/* Pagination */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        padding: '12px',
        marginTop: '20px'
      }}>
        <button style={{
          backgroundColor: 'transparent',
          border: 'none',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          ←
        </button>
        <span style={{ margin: '0 16px' }}>Page 1 of 10</span>
        <button style={{
          backgroundColor: 'transparent',
          border: 'none',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          →
        </button>
      </div>
    </div>
  );
};

export default NotificationList;
