define(['marionette', 'backbone', 'underscore'], function (Marionette, Backbone, _) {

var _id = 1;

	var MenuList = Marionette.Layout.extend({
		tagName : 'ul',
		className : 'menu_list dropdown-menu',
		template : _.template(''),

//		menus : null,
		blurTimer : null,

		events : {
			'click >.item' : 'onItemClick',
			'focus' : 'onFocus',
			'blur' : 'onBlur',
		},

		initialize : function(options) {
			var self = this;
			var menus = options.menus || [];
			menus.forEach(function(item, i) {
				if (typeof item == 'string') menus[i] = { type: 'button', text: item };
			});
			this.collection = options.collection || new Backbone.Collection(menus);
			//var menus = this.menus = options.menus || [];

			this.blurTimer = null;
this._id = _id++;
		},

		onRender : function() {
			var self = this;
			this.collection.forEach(function (itemModel) {
				self.addItemView(itemModel);
			});
			this.$el.attr('tabindex', 1);
			this.$el.show();
			setTimeout(function() {
				self.$el.focus();
			});
		},

		onMenuEvent : function(event) {
			var self = this;
			self.trigger.apply(self, arguments);
		},

		setPosition : function(x, y) {
			this.$el.css('left', x + 'px');
			this.$el.css('top', y + 'px');
		},

		addItemView : function(itemModel) {
			var self = this;
			var view;

			var ItemView = MenuList.menuMap[itemModel.get('type')];
			if (itemModel.get('type') == 'divider') {
				$('<li>').addClass('divider').appendTo(this.$el);
				return;
			}
			if (!ItemView) return;

			view = new ItemView({ model: itemModel });
			view.render().$el.appendTo(this.$el);
			view.on('focus', function() {
				self.onFocus();
			});
			view.on('blur', function() {
				self.onBlur();
			});
			view.on('closeMenu', function() {
				self.close();
				self.trigger('closeMenu');
			});

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

	return MenuList;
});