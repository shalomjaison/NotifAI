import React from 'react';

const ReminderItem = ({ reminder }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
      }}>
        <h3 style={{
          margin: '0',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          {reminder.title}
        </h3>
        <div style={{
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#818cf8',
            borderRadius: '4px',
            transform: 'rotate(12deg)'
          }}></div>
        </div>
      </div>

      <p style={{
        margin: '0 0 4px 0',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        {reminder.location}
      </p>
      <p style={{
        margin: '0',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        {reminder.date}
      </p>
    </div>
  );
};

export default ReminderItem;
