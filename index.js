const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const { createTables } = require('./models');
const userController = require('./controllers/userController');
const exerciseController = require('./controllers/exerciseController');
const logsController = require('./controllers/logsController');

require('dotenv').config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.use('/api/users', userController);
app.use('/api/users/:userId/exercises', exerciseController);
app.use('/api/users/:_id/logs', logsController);

const listener = app.listen(PORT, () => {
  console.log(`Your app is listening on port http://localhost:${PORT}`);
});

createTables();