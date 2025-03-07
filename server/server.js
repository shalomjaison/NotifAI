/*
    Data Baes
    2/28/2025

    Entry point of backend server. Establishes API endpoints, [fill in more here]
*/


const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const { Sequelize } = require('sequelize');
const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

app.get('/hello-world-demo', (req, res) => {
    console.log("/hello-world-demo get request received");
    res.send({ text: 'Hello from the backend123!' });
});


app.use('/users', userRoutes);

// asynchronous syncing for the database (sequelize does it for more than one database) creates one if we don't have one
await Sequelize.sync({ force: true });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




