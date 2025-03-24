import React from 'react';
import NotificationIcon from '../NotificationIcon/NotificationIcon';

const NotificationItem = ({ notification }) => {
  return (
    <div style={{
      backgroundColor: '#f3f4f6',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      display: 'flex',
      gap: '16px'
    }}>
      <NotificationIcon source={notification.source} />

      <div style={{ flexGrow: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '4px'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            {notification.sender} {notification.source === 'Slack' ? '(from Slack)' : ''}
          </h3>
          <span style={{
            color: '#6b7280',
            fontSize: '14px'
          }}>
            {notification.time}
          </span>
        </div>

        <p style={{
          margin: '0',
          fontSize: '14px'
        }}>
          {notification.message}
        </p>

        {notification.details && (
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            {notification.details}
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
