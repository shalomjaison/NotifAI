/*
    Data Baes
    2/28/2025

    Entry point of backend server. Establishes API endpoints, [fill in more here]
*/

const express = require('express');
const cors = require('cors')
// import  { express }  from 'express';

const app = express();
app.use(cors());    // important: 

const port = 3000;

app.get('/hello-world-demo', (req, res, next) => {

    console.log("/hello-world-demo get request received");

    res.send({text: 'Hello from the backend!'});
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});