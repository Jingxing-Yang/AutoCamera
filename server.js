var express = require('express');
var bodyParser = require("body-parser");
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


app.use('/test',testRouter);
app.use('/api',router);
app.use('/handMotion',handMotionRouter);


// Start listening for HTTP requests
app.listen(port);
console.log('Server open on port ' + port);