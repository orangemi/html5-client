define(['marionette', 'backbone', 'underscore',], function (Marionette, Backbone, _) {
	var InputMenuView = Marionette.Layout.extend({
		tagName : 'li',
		template : _.template('<a><span><%=text%></span><input class="edit" value="<%=defaultText%>" /></a>'),
		className : 'menu_item menu_input',
		events : {
			'focus input' : 'onFocus',
			'blur input' : 'onBlur',
		},

		$span : null,
		$input : null,

		initialize : function(options) {
			options = options || {};
			this.model = new Backbone.Model({
				text: 			options.text || '',
				defaultText:	options.defaultText || '',
			});
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
});
