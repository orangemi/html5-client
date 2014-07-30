define(['marionette', 'backbone', 'underscore',], function (Marionette, Backbone, _) {
	var ButtonMenu = Marionette.Layout.extend({
		tagName : 'li',
		template : _.template('<a><%=text%></a>'),
		className : 'menu_item menu_button',
		events : {
			'click' : 'onClick'
		},

		initialize : function(options) {
			options = options || {};
			this.model = new Backbone.Model({
				text: options.text || '',
			});
		},

		onClick : function() {
			this.trigger('menu:ButtonClick', this);
			this.trigger('closeMenu');
		},
	});

	return ButtonMenu;
});
