const express = require('express');
const app = express();
// the joi module returns a class, hence the casing for Joi
const Joi = require('joi');
const logger = require('./middleware/logger');
const auther = require('./middleware/authenticator');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
//load the courses
const courses = require('./routes/courses');
const index = require('./routes/index');

// the debug package returns a  function
// we pass a name space as argument to that function
// to us this we set an env varialbe export DEBUG=app:startup
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

//set view engine as pug
// no need of require, node automatically loads
app.set('view engine', 'pug');
//optional, default is ./views
app.set('views','./views');

// console.log(`NODE_ENV is ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')} `);

// use express.json middleware to parse body, 
// populate req.body with req content
app.use(express.json());
//app.use(express.urlencoded());
// servs static content from public dir
app.use(express.static('public'));

//custom middleware functions
app.use(logger);
app.use(auther);

// tell node to use the courses router
app.use('/api/courses', courses);
app.use('/', index);

// third-part middleware
// helment for security
// morgan for logging req time, not used in PROD
app.use(helmet());
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled');
}

//Db work here
dbDebugger('Connected to DB');

//Configuration using the config module
console.log('Application name : ' + config.get('name'));
console.log('Mail server ' + config.get('mail.host'));
console.log('Mail password ' + config.get('mail.password'));



// PORT
//getting the port form environment var
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));