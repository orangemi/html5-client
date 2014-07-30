define(['bootstrap', 'marionette', 'app/config', 'app/data', 'app/models'], function (Bootstrap, Marionette, Config, Data, Models) {

	var App = Marionette.Application.extend({

		isRelease : true,
		isRemoteModel : true,

		env : env,
		config : Config,
		data : Data,
		models : Models,
		router : null,
		$parent : null,

		//home view object
		view : null,

		initialize : function(options) {
			this.isRelease = !(this.env.url.querys.debug > 0) || this.config.get('release');

			if (!this.isRelease) env.global.app = this;
			console.log('env.app init...');
		},

		onStart : function(options) {
			options = options || {};
			console.log('Application start...');

			var $parent = this.$parent = options.$parent || $("body");
			
			this.router.render().$el.appendTo($parent);
			Backbone.history.start();
		}

	});

	var app = new App();
	app.initialize();

	return app;

});