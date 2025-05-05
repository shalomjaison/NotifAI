import React, {useEffect, useState} from 'react';
import './ProfileModal.css';
import axios from 'axios';
import useModalAnimation from '../hooks/useModalAnimation';
import { SlidersHorizontal, LogOut } from 'lucide-react';
import LogoutConfirmModal from './LogoutConfirmModal';


const ProfileModal = ({handleModalClose}) => {
    const [user, setUser] = useState(null);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogout = async () => {
      try {
          await axios.post('http://localhost:3000/users/logout', {}, { withCredentials: true });
          window.location.href= "/"; // Redirect to the login page using React Router
      } catch (error) {
          console.error("Logout error:", error);
      }
    };

    let {animationClassNames, handleAnimatedClose} = useModalAnimation(handleModalClose);
    
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:3000/users/profile', {
              withCredentials: true,
            });
            console.log("Response status:", response.status);
            console.log("User data:", response.data);
      
            setUser(response.data.user || response.data);
          } catch (err) {
            console.error("Fetch error:", err);
          }
        };
      
        fetchData();
      }, []);
    
    const handleModalClick = (event) => {
      console.log("Clicked inside modal");
      event.stopPropagation();
    };
    
    return (
      <div className={animationClassNames.overlayClass} onClick={handleAnimatedClose}>
          <div className={animationClassNames.containerClass} onClick={handleModalClick}>
              <div className="modal-body">
                  <div className="modal-sidebar">
                    <div className="sidebar-profile">
                      <div className="sidebar-header">
                        <div className="profile-avatar">{`${user?.fname?.charAt(0).toUpperCase()}`}</div>
                        <div className="profile-greeting">Hello, {user?.fname}!</div>
                      </div>
                    </div>
                    <div className="sidebar-menu">
                      <button 
                        key={"preferences"} 
                        className={`modal-sidebar-item`}
                        onClick={() => handleItemClick("preferences")}
                        aria-label="Preferences" title="Preferences"
                        >
                        <div className="icon-container">
                          {<SlidersHorizontal />}
                        </div>
                        <span>{"Preferences"}</span>
                      </button>
                      <button 
                        key={"logout"} 
                        className={`modal-sidebar-item`}
                        onClick={() => setIsLogoutModalOpen(true)}
                        aria-label="Logout" title="Logout"
                        >
                        <div className="icon-container">
                          {<LogOut />}
                        </div>
                        <span>{"Logout"}</span>
                      </button>
                      {isLogoutModalOpen &&
                      <LogoutConfirmModal 
                        handleModalClose={() => setIsLogoutModalOpen(false)} 
                        onConfirm={handleLogout}
                      />}
                    </div>
                  </div>
                  <div className="modal-content">

                  </div>
              </div>
          </div>
        </div>
    );
};

export default ProfileModal;