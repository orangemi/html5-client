define(['minify',
	'backbone',
	'text!app/data/hero.json'
	], function (minify, Backbone, heroString) {
		var str2json = function(string) {
			var result;
			result = JSON.parse(JSON.minify(string));	
			return result;
		};

		var str2collection = function(string) {
			var result;
			result = new Backbone.Collection(str2json(string));
			return result;
		};

		var data = {};
		data.heroCollection = str2collection(heroString);

		return data;

});