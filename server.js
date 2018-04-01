var express = require('express');
var bodyParser = require("body-parser");
var cv = require('./cv');
var fs = require('fs');// test
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var testRouter = express.Router();
testRouter.get('/',function(req,res){
	console.log("Request Received"); 
	res.send("Hello World");
});

var router = express.Router();
router.get('/:id',function(req,res){
	console.log("Request Received"); 
	var id = req.params.id;
	res.json({message: id});
});


var handMotionRouter = express.Router();
handMotionRouter.post('/',function(req,res){
	console.log(req.body);
	//var text = req.body.message
	res.send("Message received");
});

var tempMotionRouter = express.Router();
tempMotionRouter.post('/',function(req,res){
	console.log(req.body);
	var temperature = req.body.temp;
	//var text = req.body.message
	res.json({temp: temperature*2});
});

var picRouter = express.Router();
picRouter.get('/',function(req,res){

	var path = "face.jpg";

	var imageFile = fs.readFileSync(path);

	// Covert the image data to a Buffer and base64 encode it.
	var inputFile = new Buffer(imageFile).toString('base64');
	cv.detectFaces(inputFile, (err, faces) => {
		if (err) {
		  return callback(err);
		}
		else
		{
			res.send(faces[0].boundingPoly.vertices);
		}
	});
});

app.use('/test',testRouter);
app.use('/api',router);
app.use('/handMotion',handMotionRouter);
app.use('/temp',tempMotionRouter);
app.use('/pic',picRouter); //test only



// Start listening for HTTP requests
app.listen(port);
console.log('Server open on port ' + port);