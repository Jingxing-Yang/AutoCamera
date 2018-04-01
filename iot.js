const fs = require('fs');
const jwt = require('jsonwebtoken');
const mqtt = require('mqtt');

let argv = {
	//device configuration
	projectId: 'imagecapture-199717',  
	cloudRegion: 'us-central1',      	   
	registryId: 'lahacks',
	deviceId: 'my-raspberrypi',     
	privateKeyFile: 'rsa_private.pem',     
	algorithm: 'RS256',

	//some default setting
	numMessages: 100,

    tokenExpMins: 20,

    mqttBridgeHostname: 'mqtt.googleapis.com',

    mqttBridgePort: 8883,
    messageType: 'events',
}


const mqttTopic = `/devices/${argv.deviceId}/${argv.messageType}`;
const mqttClientId = `projects/${argv.projectId}/locations/${argv.cloudRegion}/registries/${argv.registryId}/devices/${argv.deviceId}`;

let connectionArgs = {
  host: argv.mqttBridgeHostname,
  port: argv.mqttBridgePort,
  clientId: mqttClientId,
  username: 'unused',
  password: createJwt(argv.projectId, argv.privateKeyFile, argv.algorithm),
  protocol: 'mqtts',
  secureProtocol: 'TLSv1_2_method'
};




function createJwt (projectId, privateKeyFile, algorithm) {
  // Create a JWT to authenticate this device. The device will be disconnected
  // after the token expires, and will have to reconnect with a new token. The
  // audience field should always be set to the GCP project id.
  const token = {
    'iat': parseInt(Date.now() / 1000),
    'exp': parseInt(Date.now() / 1000) + 20 * 60, // 20 minutes
    'aud': projectId
  };
  const privateKey = fs.readFileSync(privateKeyFile);
  return jwt.sign(token, privateKey, { algorithm: algorithm });
}



//var jsonObj = {'data': 666};
//var payload = JSON.stringify(jsonObj);

module.exports =
{
	sendCommandToIot: function(payload){
		let client = mqtt.connect(connectionArgs);

		client.subscribe(`/devices/${argv.deviceId}/config`);
		client.on('connect', (success) => {
			console.log('connect');
			if (!success) {
			   console.log('Client not connected...');
			} else {
			    client.publish(mqttTopic, payload, { qos: 1 }, function (err) {
			      if (!err) {
			      	console.log(payload+ " sent");
			      	client.end();
			      }

			    });
			  }
			});
	}
}