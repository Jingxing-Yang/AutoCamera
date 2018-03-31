var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

var initRouter = express.Router();
initRouter.get('/',function(req,res){
	console.log("Request Received"); 
	res.json({message: 'Hello World'});
});

var router = express.Router();
router.get('/:id',function(req,res){
	console.log("Request Received"); 
	var id = req.params.id;
	res.json({message: id});
});

app.use('/test',initRouter);
app.use('/api',router);


// Start listening for HTTP requests
app.listen(port);
console.log('Server open on port ' + port);