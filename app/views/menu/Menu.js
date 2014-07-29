define([
'marionette', 'underscore', 'app/app', 'text!app/views/menu/Menu.html', 'app/views/menu/ButtonMenu', 'app/views/menu/InputMenu', 'app/views/menu/SubMenu', 'app/views/menu/CheckMenu'],
function (Marionette, _, app, Html, ButtonMenuView, InputMenuView, SubMenuView, CheckMenuView) {

var _id = 1;

	var MenuView = Marionette.Layout.extend({

		className : 'menu',
		template : _.template(Html),

		menus : null,
		blurTimer : null,


		events : {
			'click >.item' : 'onItemClick',
			'focus' : 'onFocus',
			'blur' : 'onBlur',
		},

		initialize : function(options) {
			var self = this;
			var menus = this.menus = options.menus || [];

			this.blurTimer = null;
this._id = _id++;
		},

		onRender : function() {
			var self = this;
			this.menus.forEach(function (item) {
				self.addItemView(item);
			});
			this.$el.attr('tabindex', 1);
			setTimeout(function() {
				self.$el.focus();
			});
		},

		onMenuEvent : function(event) {
			var self = this;
			switch (event) {
				case 'menu:ButtonClick':
				case 'menu:InputEnterKey':
					self.close();
					break;
				case 'menu:CheckClick':
					break;
				default:
			}
			console.log(self._id, arguments);
			self.trigger.apply(self, arguments);
		},

		setPosition : function(x, y) {
			this.$el.css('left', x + 'px');
			this.$el.css('top', y + 'px');
		},

		addItemView : function(item) {
			var self = this;
			var view;
			if (typeof item == 'string') {
				view = new ButtonMenuView({text:item}).render();
				view.$el.appendTo(this.$el);
			} else if (item.type == 'menu') {
				view = new SubMenuView(item).render();
				view.$el.appendTo(this.$el);
				view.on('click', function () {
					var subMenu = new MenuView({menus : item.menus });
					subMenu.on('all', function(event) {
						if (!/^menu:/.test(event)) return;
						view.trigger.apply(view, arguments);
					});

					subMenu.on('focus', function() {
						self.onFocus();
					});
					subMenu.on('blur', function() {
						self.onBlur();
					});
					subMenu.on('close', function() {
						view.toggleActive(false);
					});

					subMenu.show();
					subMenu.setPosition(view.$el.offset().left + view.$el.width(), view.$el.offset().top);

				});
			} else if (item.type == 'button') {
				view = new ButtonMenuView(item).render();
				view.$el.appendTo(this.$el);
			} else if (item.type == 'check') {
				view = new CheckMenuView(item).render();
				view.$el.appendTo(this.$el);
			} else if (item.type == 'input') {
				view = new InputMenuView(item).render();
				view.$el.appendTo(this.$el);
				view.on('focus', function() {
					self.onFocus();
				});
				view.on('blur', function() {
					self.onBlur();
				});
			} else {
				return;
			}

			view.on('all', function (event) {
				if (!/^menu:/.test(event)) return;
				self.onMenuEvent.apply(self, arguments);
			});

		},

		onFocus : function() {
			console.log(this._id + ' focus');
			if (this.blurTimer) {
				clearTimeout(this.blurTimer);
				this.blurTimer = null;
			}

			this.trigger('focus');

		},

		onBlur : function() {
			var self = this;
			this.blurTimer = setTimeout(function() {
				console.log(self._id + ' blur');
				self.close();
			}, 100);
			self.trigger('blur');
		},

		show : function() {
			this.render().$el.appendTo($('body'));
		},
	});

	return MenuView;
});