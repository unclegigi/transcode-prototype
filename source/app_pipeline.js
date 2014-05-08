

var pipeline = function() {
	
	var public = {};
	var stack = [];
	var context = {};
	var lock = false;

	public.define = function(step) {
		stack.push(step);
	};

	public.execute = function() {
		if (!lock) {
			
			lock = true;
			var index = 0;

			var next = function() {
				var step = stack[index++];
				if (step) {
					step(context, next);
				}
			}
			next();
		};
	};

	return public;

};



var example = pipeline();

example.define(function(context, next) {
	var fs = require('fs');
	fs.readdir("C:\\Filme (Original Eingang)", function(err, files) {
		context.files = files;
		next();	
	});
});

example.define(function(context, next) {
	console.log(context);
	next();
});

example.define(function(context, next) {
	context.currentFile = context.files[0];
	context.files.splice(0,1);
	next();
});

example.define(function(context, next) {
	console.log(context);
	next();
});

example.execute();
