define([
	'backbone',
	'underscore',
	'app/views/home',
	'app/views/city',
	'app/views/dialog',
	'app/views/menu',
	],
	function (Backbone, _, HomeView, CityView, DialogView, MenuView) {
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

				//TODO code should be re'managed.
				app.showMenu = function(view, x, y) {
					app.view.$el.append(view.render().$el);
					view.setPosition(x - app.view.$el.offset().left, y - app.view.$el.offset().top);
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