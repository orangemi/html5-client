define([
	'marionette', 'underscore',],
	function (Marionette, _) {
		var ButtonMenu = Marionette.Layout.extend({
			template : _.template(''),
			className : 'menu_item menu_button',
			events : {
				'click' : 'onClick'
			},

			text : '',

			initialize : function(options) {
				options = options || {};
				this.text = options.text || this.text;
			},

			onRender : function() {
				this.$el.html(this.text);
			},

			onClick : function() {
				this.trigger('menu:ButtonClick', this);
			},
		});

		return ButtonMenu;
	}
);
