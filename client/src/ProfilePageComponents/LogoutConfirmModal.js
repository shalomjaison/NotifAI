import React, {useState, useEffect} from 'react';
import useModalAnimation from '../hooks/useModalAnimation';
import './LogoutConfirmModal.css';

const LogoutConfirmModal = ({handleModalClose, onConfirm}) => {
    let {animationClassNames, handleAnimatedClose} = useModalAnimation(handleModalClose);
    const handleModalClick = (e) => {
        e.stopPropagation();
    };
    console.log(animationClassNames.overlayClass);
    return (
        <div className={animationClassNames.overlayClass} onClick={handleAnimatedClose}>
            <div className={`${animationClassNames.containerClass} logout-confirm-container`} onClick={handleModalClick}>

            </div>
        </div>    
    );
};


export default LogoutConfirmModal;