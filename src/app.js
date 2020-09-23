const express = require('express');
const user_router = require('./routes/UserRouting');
const post_router = require('./routes/PostRouting');
const bodyParser = require("body-parser");
const app = express();
const errorLogger = require("./utilities/errorLogger");
const requestLogger = require("./utilities/requestLogger");
const cors = require('cors') ;
const PORT = process.env.PORT || 1111;


app.use(cors()); 
app.use(bodyParser.json());
app.use(requestLogger);
app.use('/user', user_router);
app.use('/post', post_router);
app.use(errorLogger);
app.listen(PORT, () => console.log(`Listening on port ${ PORT }`))
// app.listen(1111);
// console.log("Server listening in port 1111");

//write in package.json
//"proxy": "http://localhost:8080"