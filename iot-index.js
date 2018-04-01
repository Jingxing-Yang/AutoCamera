var iot = require('./iot');


for(var i = 0; i < 5; i++)
{
	var jsonObj = {'data': i};
	var payload = JSON.stringify(jsonObj);
	iot.sendCommandToIot(payload);
}