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
			"keyup >input" : "onKeyUp",
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
			$el.html(_.template(this.templateHTML)(json));
			var $input = this.$input = $("<input>").addClass('edit long').appendTo(this.$el);
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
			var value = this.$input.val();
			if (keyCode == 13) {
				this.trigger('change', this.model, {value: value});
				this.trigger('blur');
			}
		},

		onKeyUp : function(evt) {
			var value = this.$input.val();
			this.trigger('keyup', value);
		}

	});
	return InputMenuItemView;
});