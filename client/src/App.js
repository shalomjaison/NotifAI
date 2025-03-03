/*
    Data Baes
    2/28/2025

    Main component of React App. Handles UI, React components, and underlying logic of frontend
*/

import React, {useState, useEffect} from "react";

const App = () =>{
    const [data, setData] = useState([]);    

    const fetchHelloWorld = async () => {
        const response = await fetch('http://localhost:3000/hello-world-demo');

        const json = await response.json();
        setData(json);
    }
    
    useEffect(() => {
        fetchHelloWorld();
      }, []);

    return (
        <div className="mainBody">
            <h1> 
                Whats up data baes 
            </h1>

            {data ? (
                <h1>{data.text}</h1>
            ) : (
                <p>No data fetched.</p>
            )}

        </div>
    )
}

export default App