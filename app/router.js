define([
	'backbone',
	'underscore',
	'app/views/home',
	'app/views/city',
	'app/views/dialog'],
	function (Backbone, _, HomeView, CityView, DialogView) {
		var Router = Backbone.Router.extend({
			app : null,

			initialize : function(app) {
				var self = this;
				this.app = app;

				//TODO code should be re'managed.
				//define some useful function
				app.showDialog = function(options) {
					options = options || {};
					var view = new DialogView(options);
					//app.view,(view);
					app.view.showPop(view);
				};
			},

			goHome : function() {
				if (this.app.view) return this.app.view;
				var view = this.app.view = new HomeView();
				return view.render();
			},

			showCity : function() {
				var cityView = new CityView();
				this.goHome().bodyRegion.show(cityView);
			},

			show : function() {
				return this.showCity();
			}
		});
		return Router;
	});