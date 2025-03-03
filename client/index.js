/*
    Data Baes
    2/28/2025

    Entry point of front end React application
*/

import React from "react";
import  { createRoot, reactDom }  from 'react-dom/client';
import App from "./src/App"

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App/>);
