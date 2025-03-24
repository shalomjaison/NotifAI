import React from 'react';
import './ReminderItem.css';

const ReminderItem = ({ reminder }) => {
  return (
    <div className="reminder-item-container">
      <div className="reminder-item-header">
        <h3 className="reminder-item-title">
          {reminder.title}
        </h3>
        <div className="reminder-item-icon-container">
          <div className="reminder-item-icon"></div>
        </div>
      </div>

      <p className="reminder-item-location">
        {reminder.location}
      </p>
      <p className="reminder-item-date">
        {reminder.date}
      </p>
    </div>
  );
};

export default ReminderItem;

