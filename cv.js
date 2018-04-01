
var vision = require('@google-cloud/vision');
var client = new vision.ImageAnnotatorClient();
module.exports =
{


	/*
	var fs = require('fs');

	var path = "face.jpg";

	var imageFile = fs.readFileSync(path);

	// Covert the image data to a Buffer and base64 encode it.
	var inputFile = new Buffer(imageFile).toString('base64');
	*/
	/**
	 * Uses the Vision API to detect faces in the given file.
	 */
	detectFaces: function(inputFile, callback) {
	  // Make a call to the Vision API to detect the faces
	  const request = {image: {content: inputFile}};
	  client
	    .faceDetection(request)
	    .then(results => {
	      const faces = results[0].faceAnnotations;
	      var numFaces = faces.length;
	      //console.log('Found ' + numFaces + (numFaces === 1 ? ' face' : ' faces'));
	      callback(null, faces);
	    })
	    .catch(err => {
	      console.error('ERROR:', err);
	      callback(err);
	    });
	}
}
/*
detectFaces(inputFile, (err, faces) => {
    if (err) {
      return callback(err);
    }

    console.log(faces[0].boundingPoly.vertices);
});
*/