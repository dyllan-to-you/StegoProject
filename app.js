// app.js

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');	// import bodyParser to parse the body of API requests
var multer = require('multer');				// File upload support
var checksum = require('checksum');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer({ dest: './uploads/'})); // Set upload directory to /uploads


var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
    // do logging
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    var result = { "message": 'Steganography API!' };
    res.json(result); 
});

// req.params.extraThing to access :extraThing
// req.body gives key=>value pairs in JSON

router.route('/encrypt')
    .post(function(req, res) {
		// Has parameters cover, embed, [password], and [filetype]
		// returns ID for encrypted file
		console.log("Time to encrypt!");
		res.json(encrypt(req.files.cover, req.files.embed, req.body.password, req.body.filetype));
    });

router.route('/encrypted/:id')
	.get(function(req,res){
		// Return object with req.params.id
	})
	.delete(function(req,res){
		// Delete image with req.params.idM
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

function encrypt(cover, embed, password, filetype){
	var result;
	password = "\"" + password + "\"" || "\"\"";
	filetype = filetype || cover.extension;
	console.log("Filetype: " + filetype);
	if(/^jpe?g|au|bmp|wav$/i.test(filetype)){
		// Use Steghide
		console.log("Calling Steghide");
		var id = cover.name.split(".")[0] + ".";
		var output = "output/" + id + filetype;
		var command = "steghide embed -cf " + cover.path + " -ef " + embed.path + " -sf " + output + " -p " + password;
		var exec = require('child_process').exec;
		exec(command, function (error, stdout, stderr) {
			if(error){
				console.log(error);
				result = {"error":true};
				result.message = error;
				return result;
			}
			checksum.file(output, function (err, sum) {
				if(err){
					console.log(err);
					result = {"error":true};
					result.message = err;
					return result;
				}
				console.log(id);
				console.log(sum);
				result = {};
				result.id = id;
				result.checksum_sha1 = sum;
				return result;	 
			});
		});
	} else if(/^png$/i.test(filetype)){
		// Use Stega
		console.log("Calling Stega");
	} else {
		console.log("Invalid Filetype!");
		return {"error": true, "message":"Invalid Filetype"};
	}
	console.log("This Shouldn't happen!");
}