const express = require('express');
const fs = require("fs");
const path = require('path');
const { v4: uuidv4 } = require('uuid');
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

// get notes html page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// get notes from db.json
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// post 
app.post('/api/notes', (req, res) => {
  // log that a POST req was received
  console.info(`${req.method} request received to add a new note to db.`)

  // get title and text from the request body
  const { title, text } = req.body;

  // if note has both a title and text
  if (title && text) {
    // create a new note object
    const newNote = {
      title,
      text,
      id: uuidv4()
    }

    // read existing notes from db.json
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // parse notes so we can push new note into it
        let notes = JSON.parse(data);

        // add the new note to the array of notes
        notes.push(newNote);

        // write the updated notes array back to db.json
        fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes, null, 2), (err) => {
          if (err) {
            console.error(err, 'There was a problem when tryiong to write to db.json.');
          }
          console.log('A new note has been written to JSON file');
          res.json(newNote); // respond with the newly created note
        }); 
      }
    }); 
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      let notes = JSON.parse(data);

      // filter out the note with the given id from click
      notes = notes.filter((note) => note.id !== noteId);

      // write the remaining notes back to db.json
      fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes, null, 2), (err) => {
        if (err) {
          console.error(err, 'There was a problem when tryiong to write to db.json.');
        }
        console.log(`Your note with ID ${noteId} has been deleted.`);
        res.json();
      });
    }
  });
});

// wildcard route sends you back to index.html
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

  app.listen(PORT, () => console.log(`App listening on port ${PORT}`));