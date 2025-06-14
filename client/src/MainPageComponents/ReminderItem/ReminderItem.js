import React from 'react';
import './ReminderItem.css';

const ReminderItem = ({ reminder }) => {
  const {
    title,
    location,
    date,
    members=[],
  } = reminder;
  return (
    <div className="reminder-item-container">
      <div className="reminder-item-header">
        <h3 className="reminder-item-title">
          {title}
        </h3>
        <div className="reminder-item-icon-container">
          <div className="reminder-item-icon"></div>
        </div>
      </div>

      <p className="reminder-item-tag">
        Productivity
      </p>
      <p className="reminder-item-date">
        {date}
      </p>
      {members.length > 0 && (
        <div className="reminder-item-members">
          <strong>Members:</strong>
          <ul>
            {members.map((m, i) => (
              <li key={i}>{m.replace(/^mailto:/i, '')}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReminderItem;

