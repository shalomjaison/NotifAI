import React from 'react';
import ReminderItem from '../ReminderItem/ReminderItem';

const Reminders = ({ reminders }) => {
  return (
    <div>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '16px'
      }}>
        REMINDERS
      </h2>

      {reminders.map(reminder => (
        <ReminderItem key={reminder.id} reminder={reminder} />
      ))}
    </div>
  );
};

export default Reminders;
