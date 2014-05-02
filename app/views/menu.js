define([
'marionette', 'underscore', 'app/app', 'text!app/views/menu.html', 'app/views/menu/button'],
function (Marionette, _, app, Html, ButtonView) {
	var MenuView = Marionette.Layout.extend({

		className : 'menu',
		template : _.template(Html),

		menus : null,

		events : {
			'click >.item' : 'onItemClick',
			'focus' : 'onFocus',
			'blur' : 'onBlur',
		},

		initialize : function(options) {
			var self = this;
			var menus = this.menus = options.menus || [];
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

		setPosition : function(x, y) {
			this.$el.css('left', x + 'px');
			this.$el.css('top', y + 'px');
		},

		addItemView : function(item) {
			var self = this;
			var view;
			if (typeof item == 'string') {
				view = new ButtonView({text:item}).render();
				view.$el.appendTo(this.$el);
				view.on('click', function () {
					self.close();
					self.trigger('buttonClick', item, view);
					self.trigger('buttonClick:' + item, view);

				});
			} else if (item.type == 'button') {
				view = new ButtonView(item).render();
				view.$el.appendTo(this.$el);
				view.on('click', function () {
					self.close();
					self.trigger('buttonClick', item.id, view);
					self.trigger('buttonClick:' + item.id, view);
				});					
			}
		},

		onFocus : function() {
		},

		onBlur : function() {
			this.close();
		},
	});

	return MenuView;
});