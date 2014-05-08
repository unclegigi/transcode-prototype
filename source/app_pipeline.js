

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
			stack.forEach(function(step) {
				step(context);
			});
		};
	};

	return public;

};


var example = pipeline();

example.define(function(context) {
	console.log("Hallo");
});

example.define(function(context) {
	console.log("Welt")
});

example.execute();
