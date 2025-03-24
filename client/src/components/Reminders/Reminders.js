import React from 'react';
import ReminderItem from '../ReminderItem/ReminderItem';
import './Reminders.css';

const Reminders = ({ reminders }) => {
  return (
    <div className="reminders-container">
      <h2 className="reminders-title">
        REMINDERS
      </h2>

      {reminders.map(reminder => (
        <ReminderItem key={reminder.id} reminder={reminder} />
      ))}
    </div>
  );
};

export default Reminders;
