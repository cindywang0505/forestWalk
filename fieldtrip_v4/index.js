const express = require('express');
const Datastore = require('nedb');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Initialize NeDB
const db = new Datastore({ filename: 'basket.db', autoload: true });

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' directory

// POST endpoint
app.post('/saveBasket', (req, res) => {
  const data = req.body;
  db.insert(data, (err, newDoc) => {
    if (err) {
      res.status(500).send('Database error');
      return;
    }
    res.json(newDoc);
  });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));






// GET 
app.get('/allBaskets', (req, res) => {
    db.find({}, (err, docs) => {
      if (err) {
        res.status(500).send('Database error');
        return;
      }
      res.json(docs);
    });
  });