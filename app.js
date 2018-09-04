// Setup
const express = require('express');
const app = express();

app.set('view engine', 'pug');

// Routes
app.get('/', (req, res) => {
  console.log('in index route');
  res.render('index');
});

// Listening
app.listen(3000, () => {
  console.log('Server listening on 3000');
});
