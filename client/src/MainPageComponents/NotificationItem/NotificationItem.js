import React from 'react';
import NotificationIcon from '../NotificationIcon/NotificationIcon';
import './NotificationItem.css';
import EmailPage from '../../EmailPopupComponent/EmailPage';  
import { useNavigate } from 'react-router-dom'; // Import useNavigate

/**
 * NotificationWrapper is an object, with from (String[]), to (String[]), and notification (Object) properties.
 * 
 * from: is array of strings, usernames of senders
 * to: is array of strings, usernames of receivers
 * notification: is object, contains fields of notification info following ER diagram, also contains args field, which is an 
 * object containing fields specific to a type of notification (duedate, priority) following ER diagram
 * 
 */
const NotificationItem = ({ notificationWrapper }) => {

  const navigate = useNavigate(); // Initialize useNavigate

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
    <div className="notification-item-container" button onClick={() =>{
      window.location.href= "/main/email/" + notification.id;
    }}>
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

