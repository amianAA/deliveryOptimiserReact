// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
var modelConstructor = require('./lp_model/createModel').modelConstructor;
// Running Express
const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'build')));

// Catch all get calls and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
})

app.post('/api/solve', (req, res) => {
   var data = modelConstructor(req.body.value)
   console.log(data)
   res.status(200).json(data)
   //console.log(res)
  //res.send('datos recibidos: ') // Con esto se devuelve el resultado
  // res.status(req.status).send('datos recibidos: '+ results) // Con esto se devuelve el resultado
})

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';
app.set('port', port)

// Create HTTP server.
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port, () => console.log(`Server running on localhost:${port}`));
