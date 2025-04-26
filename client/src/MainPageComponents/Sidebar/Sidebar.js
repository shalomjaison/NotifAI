import React, { useState } from 'react';
import {
  Inbox,
  Star,
  Send,
  FileText,
  Trash2,
  Folder,
  Mail,
  Users,
  MessageCircle,
  Pencil,
  Bell
} from 'lucide-react';
import './Sidebar.css';
import NewMessage from '../ComposeNewMessage/NewMessage';


const sidebarItems = [
  { id: 'inbox', label: 'Inbox', icon: <Inbox size={20} /> },
  { id: 'important', label: 'Important', icon: <Star size={20} /> },
  { id: 'sent', label: 'Sent', icon: <Send size={20} /> },
  { id: 'drafts', label: 'Drafts', icon: <FileText size={20} /> },
  { id: 'trash', label: 'Trash', icon: <Trash2 size={20} /> },
  {
    id: 'categories',
    label: 'Categories',
    icon: <Folder size={20} />,
    children: [
      { id: 'mail', label: 'Mail', icon: <Mail size={20} /> },
      { id: 'teams', label: 'Teams', icon: <Users size={20} /> },
      { id: 'slack', label: 'Slack', icon: <MessageCircle size={20}/> }
    ]
  }
];

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('inbox');
  /*
  const [activeItem, setActiveItem] = useState('messages');

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const [PopUpOpen, setPopUpOpen] = useState(false);

  const togglePopUp = () => {
    setPopUpOpen(!PopUpOpen);
  };
  */
  return (
    <div className="sidebar-container">
      <div className="sidebar-logo-container">
        <div className="sidebar-logo">
          <Bell />
        </div>
        <span>NOTIFAI</span>
      </div>

      {/* <button className="sidebar-edit-button" onClick={togglePopUp}> */}

      {/* {PopUpOpen && (
        <div className="popup-container">
          <div className="popup-content">
            <NewMessage />
          </div>
        </div>
      )} */}
       

      <div className="sidebar-components">
        {sidebarItems.map((item) => {
          if (!item.children) {
            return (
              <button 
                key={item.id} 
                className={`sidebar-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => setActiveItem(item.id)}
                >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          }
          return null; // Categories stretch goal
        })}
      </div>
    </div>
  );
};

export default Sidebar;
