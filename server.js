var express = require('express');
var bodyParser = require("body-parser");
var cv = require('./cv');
var fs = require('fs');// test
var iot = require('./iot'); // test
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
	var dir = req.body.direction;
	var code = '00';
	if(dir=="left")
	{
		code = '03';
	}
	else if(dir=="right")
	{
		code = '04';
	}
	else if(dir=="forward")
	{
		code = '02';
	}
	else if(dir=="backward")
	{
		code = '01';
	}
	var command = {'command': code};
	var jsonObj = {'data': command};
	var payload = JSON.stringify(jsonObj);
	//iot.sendCommandToIot(payload);
	//console.log("Command Sent");
	console.log("Moving "+dir);
	console.log(payload);
	//var text = req.body.message
	res.send("move code "+ code +'\n');
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

var num = 1024;
///////////////////





var iotRouter = express.Router();
iotRouter.get('/',function(req,res){
	var jsonObj = {'data': num};
	var payload = JSON.stringify(jsonObj);
	num++;
	iot.sendCommandToIot(payload);
	res.send(payload);
});

app.use('/test',testRouter);
app.use('/api',router);
app.use('/handMotion',handMotionRouter);
app.use('/temp',tempMotionRouter);
app.use('/pic',picRouter); //test only
app.use('/iot',iotRouter); //test only



// Start listening for HTTP requests
app.listen(port);
console.log('Server open on port ' + port);