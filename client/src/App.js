/*
    Data Baes
    2/28/2025

    Main component of React App. Handles UI, React components, and underlying logic of frontend
*/

import React, {useState, useEffect} from "react";

    function App() {
        const [users, setUsers] = useState([]);
        const [data, setData] = useState([]);    

        const fetchHelloWorld = async () => {
            const response = await fetch('http://localhost:3000/hello-world-demo');
            const json = await response.json();
            setData(json);
        }
    
        useEffect(() => {
            fetchHelloWorld();
          }, []);

        useEffect(() => {
          const fetchUsers = async () => {
            try {
              const response = await fetch('http://localhost:3000/users'); // Replace with your API URL
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              setUsers(data);
            } catch (error) {
              console.error('Error fetching users:', error);
            }
          };

          fetchUsers();
        }, []); 

        return (
            <div>
                <h1> 
                  Whats up data baes 
                </h1>
                {data ? (
                 <h1>{data.text}</h1>
                    ) : (
                <p>No data fetched.</p>
                )}

                <h1>Users in database:</h1>
                <ul>
                    {users.map((user, i) => (
                        <li key={i}>
                        {user.username} - {user.email}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    export default App;