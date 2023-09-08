const express = require('express');
const fs = require("fs");
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express()

// middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware to serve up static assets from the public folder
app.use(express.static('public'));


// get home page
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// get notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// post 

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
