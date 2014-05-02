define([
	'backbone',
	'underscore',
	'jquery',
	'views/menu',
	'utils/utils'
	], function (Backbone, _, $, MenuView, utils) {
		var SelectView = MenuView.extend({
			className: 'menu select-list',

			initialize: function(options) {

				//this.constructor.__super__.initialize.apply(this, arguments);
				MenuView.prototype.initialize.apply(this, arguments);

				options = options || {};
				var defaultJSON = options.defaultJSON || {id:0, name:"null", img:0};
				if (options.current_id)	{
					var model = this.collection.get(options.current_id);
					if (model) defaultJSON = this.collection.get(options.current_id).toJSON();
					else defaultJSON.id = options.current_id;
				}
				this.title = _.template(this.templateHTML, defaultJSON);
			},

			onMenuItemClick : function(model, options) {
				MenuView.prototype.onMenuItemClick.apply(this, arguments);
				this.renderTitle(model);
			},

			renderTitle : function(model) {
				this.title = _.template(this.templateHTML, model.toJSON());
				this.$title.html(this.title);
				//	model.get('id') + ": " + model.get('name'));
			},
		});
		return SelectView;
	}
);