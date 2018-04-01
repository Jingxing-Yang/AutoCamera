var express = require('express');
var bodyParser = require("body-parser");
var cv = require('./cv');
var fs = require('fs');// test
var iot = require('./iot'); // test
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var width = 640;
var height = 480;

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
		code = '01';
	}
	else if(dir=="backward")
	{
		code = '02';
	}
	var command = {'command': code};
	//var jsonObj = {'data': command};
	var payload = JSON.stringify(command);
	iot.sendCommandToIot(payload);
	/*
	setTimeout(function()
	{
		var stopCommand = {'command': '00'};
		iot.sendCommandToIot(JSON.stringify(stopCommand));
	},500);
	*/
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
picRouter.post('/',function(req,res){
/*
	var path = "face.jpg";

	var imageFile = fs.readFileSync(path);

	// Covert the image data to a Buffer and base64 encode it.
	var inputFile = new Buffer(imageFile).toString('base64');
	*/
	var inputFile = req.body.pic;
	
	cv.detectFaces(inputFile, (err, faces) => {
		if (err) {
		  return callback(err);
		}
		else
		{
			var code = "00";
			if(faces.length>0)
			{
				//console.log(faces[0].boundingPoly.vertices);
				code = traceFaceMovement(faces[0].boundingPoly.vertices);
			}
			var command = {'command': code};
			var payload = JSON.stringify(command);
			iot.sendCommandToIot(payload);
			console.log("movement code: "+code);
			res.send(code);
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

function traceFaceMovement(points)
{
	var maxX = points[0].x;
	var maxY = points[0].y;
	var minX = points[0].x;
	var minY = points[0].y;

	for(var i = 0; i < points.length; i++)
	{
		maxX = points[i].x > maxX ? points[i].x : maxX;
		maxY = points[i].y > maxY ? points[i].y : maxY;
		minX = points[i].x < minX ? points[i].x : minX;
		minY = points[i].y < minY ? points[i].y : minY;
	}


	var command = "00";
	var faceMid = (maxX + minX)/2.0;
	var mid = width/2.0;
	var y = maxY - minY;
	//face on the right, turn left
	if(faceMid>mid && (faceMid-mid)*1.0/mid > 0.2)
	{
		command = "05";
	}

	//face on the left, turn right
	else if(faceMid<mid && (mid-faceMid)*1.0/mid > 0.2)
	{
		command = "06";
	}

	//face too far, move forward
	else if(y*1.0/height < 0.4)
	{
		command = "01";
	}

	//face too close, move backward
	else if(y*1.0/height > 0.8)
	{
		command = "02";
	}
	else
	{
		command = "00";
	}
	console.log(y*1.0/height);
	return command;
}


// Start listening for HTTP requests
app.listen(port);
console.log('Server open on port ' + port);