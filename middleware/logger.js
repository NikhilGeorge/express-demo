//simple middle ware function
//accepts req, resp and pass control to 'next' middleware function
function logger(req,res,next) {
    console.log('Logging...');
    next();
}

module.exports = logger;