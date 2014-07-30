define(['marionette', 'backbone', 'underscore', 'app/views/menu/MenuList'], function (Marionette, Backbone, _, MenuListView) {
	var SubMenu = Marionette.Layout.extend({
		tagName : 'li',
		template : _.template('<a><%=text%></a>'),
		className : 'menu_item menu_sub',
		events : {
			'click' : 'onClick',
			'mouseover' : 'onHover',
			'mouseleave' : 'onLeave',
		},

		initialize : function(options) {
			options = options || {};
			this.model = new Backbone.Model({
				text:	options.text || '',
				menus:	options.menus || [],
			});
		},

		onClick : function() {
			this.toggleActive(true);
			this.trigger('menu:menuClick', this);
			this.openMenu();
		},

		// onHover : function() {
		// 	this.toggleActive(true);
		// 	this.trigger('menu:menuClick', this);
		// 	this.openMenu();
		// },
		// onLeave : function() {
		// 	this.toggleActive(false);
		// },

		openMenu : function() {
			var self = this;
			var subMenu = new MenuListView({ menus : this.model.get('menus') });
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
