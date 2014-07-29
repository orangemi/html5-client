define([
	'marionette', 'underscore',],
	function (Marionette, _) {
		var InputMenuView = Marionette.Layout.extend({
			template : _.template(''),
			className : 'menu_item menu_input',
			events : {
				'focus input' : 'onFocus',
				'blur input' : 'onBlur',
			},

			$span : null,
			$input : null,

			text : '',

			initialize : function(options) {
				options = options || {};
				this.text = options.text || '';
				this.defaultText = options.defaultText || '';

			},

			onRender : function() {
				var $span = this.$span = $('<span>').html(this.text).appendTo(this.$el);
				var $input = this.$input = $('<input>').html(this.defaultText).appendTo(this.$el);
			},

			onClick : function() {
				this.trigger('click');
			},

			onBlur : function() {
				this.trigger('blur');
			},

			onFocus : function() {
				this.trigger('focus');
			}
		});

		return InputMenuView;
	}
);
