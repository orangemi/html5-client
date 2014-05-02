define([
'backbone', 'underscore',
'app/views/home', 'app/views/city', 'app/views/heroList', ],
function (Backbone, _, HomeView, CityView, HeroListView) {
	var Router = Backbone.Router.extend({
		app : null,
		history : null,
		routes : {
			''			: 'goHome',
			'home'		: 'goHome',
			'heroes'	: 'goHeroes',
			'hero/:id'	: 'goHero',
		},

		initialize : function(app) {
			var self = this;
			this.app = app;
			this.history = [];

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

		render : function() {
			if (this.app.view) return this.app.view;
			var view = this.app.view = new HomeView();
			return view.render();
		},

		goHome : function() {
			var cityView = new CityView();
			this.app.view.bodyRegion.show(cityView);
			//this.history.push(cityView);
		},

		goHeroes : function() {
			var heroListView = new HeroListView();
			this.app.view.bodyRegion.show(heroListView);
		}

	});
	return Router;
});