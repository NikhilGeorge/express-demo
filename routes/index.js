const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    //res.send('Hello World');
    // to use pug as view engine, use render
    res.render('index',{title: 'My express App', message: 'Hello, this is pug'});
});

module.exports = router;