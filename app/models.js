define(['backbone', 'underscore', 'app/app', 'app/models.debug.js'], function (Backbone, _, app, FakeModels) {
	var models = {};

	var BaseModel = models.BaseModel = Backbone.Model.extend({
		type : 'base',
		initialize : function(attrs, options) {
			//TODO listen events;
			return Backbone.Model.prototype.initialize.apply(this, arguments);
		},
		sync : function(methods, model, options) {
			if (!app.config.get('release') && app.config.get('isLocalModel')) {
				FakeModels.getFakeModel(this.type, this, options);
				return;
			}

			return Backbone.Model.prototype.sync.apply(this, arguments);
		}
	});

	var BaseCollection = models.BaseCollection = Backbone.Collection.extend({
		model : BaseModel,
		initialize : function(array, options) {
			//TODO lisn events;
			return Backbone.Collection.prototype.initialize.apply(this, arguments);
		},
		sync : function(methods, collection, options) {
			if (!app.config.get('release') && app.config.get('isLocalModel')) {
				FakeModels.getFakeModel(this.model.prototype.type, this, options);
				return;
			}

			return Backbone.Model.prototype.sync.apply(this, arguments);
		}
	});

	var HeroModel = models.HeroModel = BaseModel.extend({
		type : 'hero'
	});

	var HeroCollection = models.HeroCollection = BaseCollection.extend({
		model : HeroModel
	});

	return models;
});