const express = require('express');
// not a simple expess object, but type of class
const router = express.Router();

const courses =[
    {id: 1, name : 'course1'},
    {id: 2, name : 'course2'},
    {id: 3, name : 'course3'},
];

// since this is a routes file, we dont need to use /api/couses
// insted we can just use /
router.get('/', (req,res) => {
    res.send(courses);
});

router.get('/:id', (req,res) => {
    //find the course using javascript find, which is avaialbe for all arrays
    //use const or let instead of var. use const whenever its static calue and not change
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course not found');
    res.send(course);
});

router.post('/', (req,res) => {
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


router.put('/:id', (req,res) => {
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

router.delete('/:id',(req,res) => {
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

module.exports = router;