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
  // { id: 'compose', label: 'Compose', icon: <Mail size={20} /> },
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

  const [PopUpOpen, setPopUpOpen] = useState(false);

  // const togglePopUp = () => {
  //   setPopUpOpen(!PopUpOpen);
  // };

  const handleItemClick = (item_id) => {
    setActiveItem(item_id);
    if(item_id == "compose"){
      setPopUpOpen(true);
    }
    else{
      setPopUpOpen(false);
    }
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo-container">
        <div className="sidebar-logo">
          <Bell />
        </div>
        <span>NOTIFAI</span>
      </div>

      <div className="sidebar-components">

        {/* Popup with NewMessage.js containing code for constructing notification */}
        {PopUpOpen && (
          <div className="popup-container">
            <div className="popup-content">
              <NewMessage />
            </div>
          </div>
        )}

        <button 
          key={"compose"} 
          className={`sidebar-item-compose ${PopUpOpen ? 'active' : ''}`}
          onClick={() => handleItemClick("compose")}
          >
          <div className="icon-container">
            {<Pencil/>}
          </div>
          <span>{"Compose"}</span>
        </button>
        
        {sidebarItems.map((item) => {
          if (!item.children) {
            return (
              <button 
                key={item.id} 
                className={`sidebar-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => handleItemClick(item.id)}
                >
                <div className="icon-container">
                  {item.icon}
                </div>
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
