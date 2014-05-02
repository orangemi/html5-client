define([
	'backbone',
	'underscore',
	'jquery'
	], function (Backbone, _, $) {

	var InputMenuItemView = Backbone.View.extend({
		templateHTML : '<%= name %>',
		className : 'btn-menu-item',
		
		events : {
			"click" : "onClick",
			"focus >input" : "onFocus",
			"keydown >input" : "onKeyDown",
			"blur >input" : "onBlur",
		},

		initialize : function(options) {
			options = options || {};
			this.templateHTML = options.templateHTML || this.templateHTML;
		},
		render : function() {
			var $el = this.$el.empty();
			var json = this.model.toJSON();
			json.name = json.display ? json.display : json.name;
			$("<div>").addClass('title').html(_.template(this.templateHTML)(json)).appendTo($el);
			var $input = this.$input = $("<input>").addClass('edit long').appendTo(this.$el).hide();
			var $list = this.$list = $('<div>').addClass('list').appendTo(this.$el).hide();
			return this;
		},

		onFocus : function(evt) {
			this.trigger('focus');
		},

		onBlur : function() {
			this.trigger('blur');
		},

		onKeyDown : function(evt) {
			var keyCode = evt.keyCode;
			if (keyCode == 13) {
				this.model.set('value', this.$input.val());
				this.trigger('change', this.model);
				this.trigger('blur');
			}
		}

	});
	return InputMenuItemView;
});