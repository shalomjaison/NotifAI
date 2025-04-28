import React, { useEffect, useState } from 'react';
import ReminderItem from '../ReminderItem/ReminderItem';
import './Reminders.css';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000';
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
const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [page, setPage] = useState(1);
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [uploading, setUploading] = useState(false);

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
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, [page]);

  const fetchReminders = async (page) => {
    try {
      const res = await axios.get(`/api/calendar/reminders?page=${page}&limit=5`, {
        withCredentials: true
      });
      setReminders(res.data.events);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(' Error fetching reminders:', err);
    }
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile || null);
  };

  const handleUpload = async () => {
    console.log("📤 Upload button clicked"); // ✅ Confirm button works
  
    if (!file) return;
    const formData = new FormData();
    formData.append('calendar', file);
  
    try {
      setUploading(true);
      await axios.post('/api/calendar/upload-calendar', formData, {
        withCredentials: true,
      });
      console.log("✅ Upload complete");
  
      setFile(null);
      await fetchReminders(1);
      setPage(1);
    } catch (err) {
      console.error(' Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <div className="reminders-container">
      <h2 className="reminders-title">REMINDERS</h2>

      <input type="file" accept=".ics" onChange={handleFileChange} disabled={uploading} />
      {file && (
        <button className="upload-button" onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Calendar"}
        </button>
      )}

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

      <div className="pagination-controls">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span> Page {page} of {totalPages} </span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
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
