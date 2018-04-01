var fs = require('fs');
var cv = require('./cv');

var path = "face.jpg";

var imageFile = fs.readFileSync(path);

// Covert the image data to a Buffer and base64 encode it.
var inputFile = new Buffer(imageFile).toString('base64');

cv.detectFaces(inputFile, (err, faces) => {
if (err) {
  return callback(err);
}

console.log(faces[0].boundingPoly.vertices);
});
