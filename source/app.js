

var convert = function(file, callback) {
	var	child_process = require("child_process");
	var description = { file : file, hd : false,
		audio : { de : {surround: 0, surround_hd: 0, stereo : 0}, en : { surround: 0, surround_hd: 0, stereo : 0}},
		subtitle : {de : [], en : [] } };
	var count = 0;
	var type = "";
	var execution = "handbrake64";
	var inform = execution + " -i \"" + description.file + "\" --scan";
	var process = execution + " -i \"" + description.file + "\" -o \"" + description.file + ".converted.mkv" + "\" -f mkv";

	child_process.exec(inform, { encoding: 'utf8', timeout: 0, maxBuffer: 1000*1024, killSignal: 'SIGTERM', cwd: null, env: null }, function (informError, informStdout, informStderr) {

		var informOutput = informStderr;

		informOutput.split("\n").forEach(function(line) {

			line = line.toLowerCase();

			if (line.indexOf("+ size: 1920x1080") !== -1) {
				description.hd = true;
				return;
			};

			if (line.indexOf("audio tracks") !== -1) {
				type = "audio";
				count = 0;
				return;
			};

			if (line.indexOf("subtitle tracks") !== -1) {
				type = "subtitle";
				count = 0;
				return;
			};

			if (type !== "") {
				if (line.match(/    \+ (.*)/)) {
					count++;
					if (type === "audio") {
						console.log('audio: ' + line);
						if (line.indexOf("iso639-2: deu") !== -1) {
							if ((line.indexOf("5.1") !== -1) || (line.indexOf("7.1") !== -1)) {
								if (line.indexOf("dts-hd") !== -1) {
									if (description.audio.de.surround_hd === 0) {
										description.audio.de.surround_hd = count;
									}
								} else {
									if (description.audio.de.surround === 0) {
										description.audio.de.surround = count;
									}
								};
							} else {
								if (description.audio.de.stereo === 0) {
									description.audio.de.stereo = count;
								}
							};
						} else if (line.indexOf("iso639-2: eng") !== -1) {
							if ((line.indexOf("5.1") !== -1) || (line.indexOf("7.1") !== -1)) {
								if (line.indexOf("dts-hd") !== -1) {
									if (description.audio.en.surround_hd === 0) {
										description.audio.en.surround_hd = count;
									}
								} else {
									if (description.audio.en.surround === 0) {
										description.audio.en.surround = count;
									}
								};
							} else {
								if (description.audio.en.stereo === 0) {
									description.audio.en.stereo = count;
								}
							};
						};
					} else if (type === "subtitle") {
						console.log("subtitle: " + line);
						if (line.indexOf("iso639-2: deu") !== -1) {
							description.subtitle.de.push(count);
						} else if (line.indexOf("iso639-2: eng") !== -1) {
							description.subtitle.en.push(count);
						};
					};
				};
			};

		});
		console.log();
		console.log(description)
		console.log();
		var bitrate = 8000;
		if (description.hd === false) {
			bitrate = 4000;
		}

		var audio_de = "";
		if (description.audio.de.stereo !== 0) {
			audio_de = description.audio.de.stereo;
		};

		if (description.audio.de.surround !== 0) {
			audio_de = description.audio.de.surround;
		};
		
		if (description.audio.de.surround_hd !== 0) {
			audio_de = description.audio.de.surround_hd
		};

		var audio_en = "";
		if (description.audio.en.stereo !== 0) {
			audio_en = description.audio.en.stereo;
		};

		if (description.audio.en.surround !== 0) {
			audio_en = description.audio.en.surround;
		};
		
		if (description.audio.en.surround_hd !== 0) {
			audio_en = description.audio.en.surround_hd
		};

		var audio = "";
		if (audio_de !== "") {
			audio = audio_de;
		}
		if (audio_en !== "") {
			if (audio === "") {
				audio = audio_en;
			} else {
				audio += "," + audio_en;
			}
		}

		var subtitle = "";
		description.subtitle.de.forEach(function(i) {
			if (subtitle === "") {
				subtitle = i;
			} else {
				subtitle = subtitle + "," + i;
			} 
		});
		description.subtitle.en.forEach(function(i) {
			if (subtitle === "") {
				subtitle = i;
			} else {
				subtitle = subtitle + "," + i;
			} 
		});

		process += " --loose-anamorphic --modulus 2 -e x264 -b " + bitrate + " -2 --vfr -a " + audio;
		process += " -E copy -6 auto -R Auto --subtitle " + subtitle + " --x264-preset=veryfast --verbose=1";

		if (description.hd === true) {
			process += " --x264-profile=main --h264-level=\"4.1\"";
		} else {
			process += " --x264-profile=baseline --h264-level=\"3.0\"";
		}

		console.log(process);
		console.log()
		child_process.exec(process, { encoding: 'utf8', timeout: 0, maxBuffer: 20000000000*10240, killSignal: 'SIGTERM', cwd: null, env: null }, function (processError, processStdout, processStderr) {
			callback();
		});

	});
}

// convert("Y:\\Filme (Original Eingang)\\Video1.mkv", function() {
// 	console.log("Fertig");
// 	return;
// });



var fs = require('fs');
var util = require('util');
var convertableFiles = [];
fs.readdir("C:\\Filme (Original Eingang)", function(err, files) {
	files.forEach(function(item) {
		if (item.substr(-3) !== "mkv") {
			return;
		}
		if (item.substr(-13) === "converted.mkv") {
			return;
		}
		var exists = fs.existsSync("C:\\Filme (Original Eingang)\\" + item + '.converted.mkv');
		if (!exists) {
			convertableFiles.push(item);
		}
	});
	console.log(convertableFiles)
});




