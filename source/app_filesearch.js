

var fs = require('fs');
var util = require('util');

fs.readdir("C:\\Filme (Original Eingang)", function(err, files) {
	files.forEach(function(item) {
		if (item.substr(-3) !== "mkv") {
			return;
		}
		if (item.substr(-13) === "converted.mkv") {
			return;
		}
		console.log(item)
		var exists = fs.existsSync("C:\\Filme (Original Eingang)\\" + item + '.converted.mkv');
		util.debug(exists ? "it's there" : "no!");

	});
});




