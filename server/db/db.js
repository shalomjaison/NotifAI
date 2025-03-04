// Importing node-postgres library. 
// The pg library is the bridge that allows your Node.js code to "talk" to the PostgreSQL server
// It sends commands to the database and receives results back.
const { Pool } = require('pg');


const pool = new Pool({ // establishes new connection pool to the postgreSQL database
    host: "localhost", 
    user: "postgres", 
    port: 5432,
    password: "256325", // replace with your password that you set during postgreSQL installation
    database: "users"
});

// Optional: Test the connection (can be removed later)
pool.connect()
    .then(() => console.log('Connected to database successfully!'))
    .catch(err => console.error('Error connecting to database:', err.message));

module.exports = pool; // Export the pool directly