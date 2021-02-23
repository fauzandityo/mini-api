require('dotenv').config();
const app = require('express')();
const http = require('http').Server(app);
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = "9000";
let apiRouter = require('./route');
app.use('/api/v1', apiRouter);

http.listen(port, function () {
   console.log("Listening on localhost: "+port); 
});