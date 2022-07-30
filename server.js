const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/socialnetwork',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.set('debug', true);

app.use(require('./routes'));

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });