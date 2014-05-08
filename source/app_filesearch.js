

var readdir = require('fs').readdir;

readdir("c:\\", function(err, files) {
	console.log(files);
});




