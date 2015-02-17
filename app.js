// app.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Steganography API!' });   
});

// req.params.extraThing to access :extraThing
// req.body gives key=>value pairs in JSON

router.route('/encrypt')
    .post(function(req, res) {
		// Has parameters cover, embed, and [password]
		// returns ID for encrypted file                
    });
router.route('/encrypt/:filetype')
    .post(function(req, res) {
    	// req.params.filetype
    });

router.route('/encrypted/:id')
	.get(function(req,res){
		// Return object with req.params.id
	})
	.delete(function(req,res){
		// Delete image with req.params.id
	});

router.route('/decrypt')
	.post(function(req,res){
		// has parameter {encrypt}, returns embedded file
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/steganography', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);