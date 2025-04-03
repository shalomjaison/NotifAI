import React, { createElement, useEffect, useState } from 'react';
import './Filter.css';
// import LogoutButton from '../LogoutButton/LogoutButton';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate

// const Filter = ({ userData }) => {

class Filter extends React.Component {
// class Filter {

    constructor(props){
        super(props);    
        // this.state = {
        //     isOpen: false,
        // };
        [this.FilterMenuOpen, this.setFilterMenuOpen] = useState(false);

    }
    test(){
        return <div><p>aksdkadhjsada</p></div>;
    }
    renderButton(){

        const toggleDropdown = () => {
            // this.state.isOpen = !this.state.isOpen;
            this.setFilterMenuOpen(!this.FilterMenuOpen);
            // this.setState({ isOpen: !this.state.isOpen });
            // this.renderFilterSelectScreen();
        };
    
        // if(option == "button"){
            return (
                <div>
                    <header className="filter-container">

            
                        <button onClick={toggleDropdown}>
                            <div className="filter-icon">
                                <span className="filter-text">Filter</span>
                                {/* Filter icon SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                </svg>
                            </div>
                        </button>
            

        
                    </header>
                </div>
            );
    }

    renderFilterMenu(){
        // console.log("Filter select screen");
        // console.log(this.state.isOpen);
        return(
            <div>
                {this.FilterMenuOpen && (
                    <div className="filter-icon">
                        <span className="filter-text">Filter</span>
                        {/* Filter icon SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                    </div>
                )}
            </div>
        ); 
    }

    renderFilterDisplayScreen(){

    }
    
}

// const Filter = (option) => {
//         // const navigate = useNavigate(); // Initialize useNavigate

// //   useEffect(() => {
// //     if (!userData) {
// //       console.log("No user data found, redirecting to login");
// //       window.location.href = "/"; // Redirect to the login page;
// //     }
// //   }, [userData, navigate]);
//     const [isOpen, setIsOpen] = React.useState(false);

//     const toggleDropdown = () => {
//         setIsOpen(!isOpen);
//     };

//     // if(option == "button"){
//         return (
//             <header className="filter-container">
    
//                 <button onClick={toggleDropdown}>
//                     <div className="filter-icon">
//                         <span className="filter-text">Filter</span>
//                         {/* Filter icon SVG */}
//                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
//                         </svg>
//                     </div>
//                 </button>
    
//                 <div>
//                     {isOpen && (
//                         <div className="filter-icon">
//                             <span className="filter-text">Filter</span>
//                             {/* Filter icon SVG */}
//                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                             <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
//                             </svg>
//                         </div>
//                     )}
//                 </div>

//             </header>
//         );
//     // }

//     return (
//         <div>
//             {isOpen && (
//                 <div className="filter-icon">
//                     <span className="filter-text">Filter</span>
//                     {/* Filter icon SVG */}
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
//                     </svg>
//                 </div>
//             )}
//         </div>
//     );
// };

export default Filter;







