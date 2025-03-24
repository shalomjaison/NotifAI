import React from 'react';
import './NotificationIcon.css';

const NotificationIcon = ({ source }) => {
  let icon;
  let iconClass = "notification-icon-container";

  switch (source.toLowerCase()) {
    case 'slack':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2c-1.1 0-2 .9-2 2v4.5H17c1.1 0 2-.9 2-2v-2.5c0-1.1-.9-2-2-2h-2.5Z" />
          <path d="M4.5 9.5c-1.1 0-2 .9-2 2v2.5c0 1.1.9 2 2 2H7c1.1 0 2-.9 2-2v-4.5H4.5Z" />
          <path d="M9.5 22c1.1 0 2-.9 2-2v-4.5H7c-1.1 0-2 .9-2 2V20c0 1.1.9 2 2 2h2.5Z" />
          <path d="M19.5 14.5c1.1 0 2-.9 2-2v-2.5c0-1.1-.9-2-2-2H17c-1.1 0-2 .9-2 2v4.5h4.5Z" />
        </svg>
      );
      break;
    case 'claims':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
      break;
    default:
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );
  }

  return (
    <div className={iconClass}>
      {icon}
    </div>
  );
};

export default NotificationIcon;

