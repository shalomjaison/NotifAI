import React, { useEffect, useState } from 'react';
import ReminderItem from '../ReminderItem/ReminderItem';
import './Reminders.css';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [page, setPage] = useState(1);
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchReminders(page);
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
            date: new Date(reminder.start).toLocaleString(),
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
