define([
	'marionette', 'underscore',],
	function (Marionette, _) {
		var SubMenu = Marionette.Layout.extend({
			template : _.template(''),
			className : 'menu_item menu_sub',
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
				this.toggleActive(true);
				this.trigger('menu:menuClick', this);
				this.trigger('click', this);
			},

			toggleActive : function(flag) {
				this.$el.toggleClass('active', flag);
			},
		});

		return SubMenu;
	}
);
