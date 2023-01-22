require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
require('./assets/errorHandlers');
require('./assets/client');
//AWS health check
app.get('/isalive', (req, res) => {
	res.send('OK');
});

app.use(require('morgan')('dev'));
app.use(express.json());

app.all('*', (req, res) => {
	res.status(404).send('not found');
});

http.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
