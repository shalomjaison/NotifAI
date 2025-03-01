import React from "react";
import  { createRoot, reactDom }  from 'react-dom/client';
import App from "./src/App"

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App/>);

// reactDom.render(<App />);
// reactDom.render(<App />, document.getElementById("root"));