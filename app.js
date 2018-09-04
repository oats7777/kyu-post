// Setup
const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/kyu-post');
const Post = mongoose.model('Post', { body: String });
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');

// Routes
app.get('/', (req, res) => {
  const query = req.query;
  console.log('query', query);
  Post.find({}, (err, results) => {
    res.render('index', { results: results });
  });
});

app.post('/addpost', (req, res) => {
  const post = new Post(req.body);
  post
    .save()
    .then(aa => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(`Error in save`);
    });
});

// Listening
app.listen(3000, () => {
  console.log('Server listening on 3000');
});
