define(['marionette', 'underscore', 'app/views/menu/MenuList'], function (Marionette, _, MenuListView) {
	var SubMenu = Marionette.Layout.extend({
		template : _.template(''),
		className : 'menu_item menu_sub',
		events : {
			'click' : 'onClick'
		},

		text : '',
		menus : null,

		initialize : function(options) {
			options = options || {};
			this.text = options.text || this.text;
			this.menus = options.menus || [];
		},

		onRender : function() {
			this.$el.html(this.text);
		},

		onClick : function() {
			this.toggleActive(true);
			this.trigger('menu:menuClick', this);
			this.openMenu();
		},

		openMenu : function() {
			var self = this;
			var subMenu = new MenuListView({ menus : this.menus });
			subMenu.on('all', function(event) {
				if (event == 'focus' || event == 'blur' || event == 'closeMenu') {
					self.trigger(event);
					return;
				}
				if (!/^menu:/.test(event)) return;
				self.trigger.apply(self, arguments);
			});

			subMenu.on('close', function() {
				self.toggleActive(false);
			});

			subMenu.show();
			subMenu.setPosition(self.$el.offset().left + self.$el.width(), self.$el.offset().top);
		},

		toggleActive : function(flag) {
			this.$el.toggleClass('active', flag);
		},
	});

	return SubMenu;
});
