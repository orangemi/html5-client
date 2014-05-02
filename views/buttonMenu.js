define([
	'backbone',
	'underscore',
	'jquery'
	], function (Backbone, _, $) {

	var ButtonMenuItemView = Backbone.View.extend({
		templateHTML : '<%= name %>',
		className : 'btn-menu-item',
		
		events : {
			"click" : "onClick"
		},

		initialize : function(options) {
			options = options || {};
			this.templateHTML = options.templateHTML || this.templateHTML;
		},
		render : function() {
			var $el = this.$el.empty();
			var json = this.model.toJSON();
			json.name = json.display ? json.display : json.name;
			$el.html(_.template(this.templateHTML)(json));
			return this;
		},
		onClick : function() {
			this.trigger('click', this.model);
		}
	});
	return ButtonMenuItemView;
});