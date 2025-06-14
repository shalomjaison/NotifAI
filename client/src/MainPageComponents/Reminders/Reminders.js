import React, { useEffect, useState } from 'react';
import ReminderItem from '../ReminderItem/ReminderItem';
import './Reminders.css';
import axios from 'axios';

import { deploymentMode, backendPort, backendHost, backendBaseURL } from '../../App';

// axios.defaults.baseURL = backendBaseURL;
axios.defaults.withCredentials = true;

function formatDateTime(iso) {
  const d = new Date(iso);
  const datePart = d.toLocaleDateString('en-US', {
    month: 'long',
    day:   'numeric',
    year:  'numeric'
  });
  // "January 1, 2023"
  // "9:15 AM"
  const timePart = d.toLocaleTimeString('en-US', {
    hour:   'numeric',
    minute: '2-digit',
    hour12: true
  });
  return `${datePart}, ${timePart}`;
}

const trimFileName = (name, maxLength = 20) => {
  if (name.length <= maxLength) return name;
  
  const firstPart = name.slice(0, 10);
  const lastPart = name.slice(-5);
  return `${firstPart}...${lastPart}`;
};

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [page, setPage] = useState(1);
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [uploaded, setUploaded] = useState(false);
  const [showNewReminderForm, setShowNewReminderForm] = useState(false);

  const handleNewReminderClick = () => {
    setShowNewReminderForm(true); // later you can toggle this
  };

  const reminderLimit = 7;

  useEffect(() => {
    fetchReminders(page);
    //refetch reminders when an event ends
    const intervalId = setInterval(() => {
      fetchReminders(page);
    }, 60_000);
    // re-fetch reminders every minute if the event is over

    // also re-fetch on tab/window focus
    const handleFocus = () => fetchReminders(page);
    window.addEventListener('focus', handleFocus);
    const savedName = localStorage.getItem("calendarFileName");
    if (savedName) {
      setFile({ name: savedName }); // fake file object just to show name
      setUploaded(true);
      localStorage.removeItem("remindersCleared");
    }
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, [page]);

  const fetchReminders = async (page) => {
    if (localStorage.getItem("remindersCleared") === "true") {
      console.log("Skipping fetch — reminders were cleared locally");
      return;
    }
    try {
      const res = await axios.get(backendBaseURL+ `/api/calendar/reminders?page=${page}&limit=${reminderLimit}`, {
        withCredentials: true
      });
      setReminders(res.data.events);
      setTotalPages(Math.max(1, res.data.totalPages));
    } catch (err) {
      console.error(' Error fetching reminders:', err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setUploaded(false);
    setFile(selectedFile || null);
    if (selectedFile) {
      e.target.value = null;
    }
  };

  const handleUpload = async () => {
    console.log("📤 Upload button clicked"); // ✅ Confirm button works
  
    if (!file) return;
    const formData = new FormData();
    formData.append('calendar', file);
    
    try {
      setUploaded(true);
      localStorage.setItem("calendarFileName", file.name);
      await axios.post(backendBaseURL + '/api/calendar/upload-calendar', formData, {
        withCredentials: true,
      });
      console.log("✅ Upload complete");
  
      // setFile(null);
      localStorage.removeItem("remindersCleared");
      await fetchReminders(1);
      setPage(1);
    } catch (err) {
      console.error(' Upload failed:', err);
    }
  };

  const handleClearFile = () => {
    setFile(null); 
    setReminders([]); 
    setTotalPages(1); 
    setUploaded(false); 
    localStorage.removeItem("calendarFileName");   
    // prevent future fetches
    localStorage.setItem("remindersCleared", "true");
  }
  

  return (
    <div className="reminders-container">
      <div className="reminders-header">
        <h2 className="reminders-title">REMINDERS</h2>
        <button className="new-reminder-btn" onClick={handleNewReminderClick}>
          + New Reminder
        </button>
      </div>
      <div className="upload-container">
        <input
          type="file"
          id="file-upload"
          accept=".ics"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        <label htmlFor="file-upload" className="upload-label">
          {file ? "Replace File" : "Choose .ics File"}
        </label>

        {file && (
          <div className="uploaded-file">
            <span className="uploaded-file-name" title={file.name}>
              {trimFileName(file.name)}
            </span>
            {uploaded && (
            <button onClick={handleClearFile} disabled={!uploaded}className="clear-file-btn"
            >
              ✖
            </button>
            )}
          </div>
        )}

        {file && !uploaded &&(
          <button className="upload-button" onClick={handleUpload} disabled={uploaded}>
            Upload Calendar
          </button>
        )}
      </div>

      {reminders.map((reminder, idx) => (
        <ReminderItem
          key={idx}
          reminder={{
            title: reminder.summary,
            location: reminder.location,
            date: formatDateTime(reminder.start),
            members: Array.isArray(reminder.members)
            ? reminder.members
            : [],
          }}
        />
      ))}

      {uploaded && totalPages >= 1 && reminders.length > 0 && 
      (<div className="pagination-controls " >
        <button className="pagination-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span className="pagination-page"> Page {page} of {totalPages} </span>
        <button className="pagination-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>)}

      {(reminders.length === 0) && (
        <div className="empty-reminders">
          <p className="empty-message">No Reminders Yet</p>
          <p className="empty-subtext">
            Upload a <span>.ics</span> file or 
            <button onClick={handleNewReminderClick} className="inline-link">add one manually</button>.
          </p>
        </div>
      )}
    </div>
  );
};

export default Reminders;
// Note: The above code is a React component that fetches and displays reminders from a user's calendar.
// It allows the user to upload a new calendar file and paginates through the reminders.
// The component uses axios for HTTP requests and manages state with React's useState and useEffect hooks.
// The reminders are displayed using a separate ReminderItem component.
// The component also includes basic error handling and loading states for the file upload process.
// The file upload is handled using FormData to send the file to the server.
// The reminders are fetched from the server using a GET request with pagination parameters.
// The component is styled using a CSS file (Reminders.css) for layout and appearance.
