const express = require('express');
const app = express();
// the joi module returns a class, hence the casing for Joi
const Joi = require('joi');
const logger = require('./logger');
const auther = require('./authenticator');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
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

const courses =[
    {id: 1, name : 'course1'},
    {id: 2, name : 'course2'},
    {id: 3, name : 'course3'},
];

app.get('/', (req,res) => {
    //res.send('Hello World');
    // to use pug as view engine, use render
    res.render('index',{title: 'My express App', message: 'Hello, this is pug'});
});

app.get('/api/courses', (req,res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req,res) => {
    //find the course using javascript find, which is avaialbe for all arrays
    //use const or let instead of var. use const whenever its static calue and not change
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course not found');
    res.send(course);
});

app.post('/api/courses', (req,res) => {
    // input validation, we replace this with scheme
    // if (!req.body.name || req.body.name.length < 3) {
    //     // 400 Bad Request
    //     res.status(400).send('Name is invalid');
    //     return;
        
    // }
    //use JOi to validate
    // define the schema

    //object restructuring used instead of result.error
    const { error } = validateCourse(req.body);
    //console.log(result);
    if (error) {
        // 400 
        return res.status(400).send(error.details[0].message);
        
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});


app.put('/api/courses/:id', (req,res) => {
    // check if id course exist
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send('Course not found');
    }

    //validate if the input is correct
    //const result = validateCourse(req.body);
    // object destructuring instead of the above line
    // use { error } instead of result.error
    const { error } = validateCourse(req.body); 
    if (error) {
        // 400 
        res.status(400).send(error.details[0].message);
    }

    //update course - if all ok
    course.name = req.body.name 
    //return the couse
    res.send(course);
});

app.delete('/api/courses/:id',(req,res) => {
    //check if course exist
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send('Course not found');
    }

    //Delete
    const index = courses.indexOf(course);
    courses.splice(index,1);
    res.send(course);

});

//validation using function
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return result = Joi.validate(course, schema);
}

// PORT
//getting the port form environment var
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));