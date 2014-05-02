define([
	'backbone',
	'underscore',
	'jquery',
	'views/buttonMenu',
	'views/checkMenu',
	'views/inputMenu',
	], function (Backbone, _, $, ButtonMenuItemView, CheckMenuItemView, InputMenuItemView) {

	var SubMenuItemView = Backbone.View.extend({

		className : 'sub-menu-item',
		templateHTML : '<%= name %>',		
		events : {
			'blur' : 'onBlur',
			'click >.title' : 'clickMenu',
			'focus' : 'onFocus',
		},

		_blurTimeout : null,

		initialize : function(options) {
			options = options || {};
			this.templateHTML = options.templateHTML || this.templateHTML;
			this.collection = this.collection || new Backbone.Collection();
			this.collection.add(this.model.get('child'));
			this.listenTo(this.collection, 'add', this.addMenuView);
		},
		render : function() {
			var self = this;
			var $el = this.$el.empty().attr('tabindex', 0);
			var json = this.model.toJSON();
			json.name = json.display ? json.display : json.name;
			var $title = this.$title = $('<div>').addClass('title').html(_.template(this.templateHTML)(json)).appendTo($el);
			var $list = this.$list = $('<div>').addClass('list').appendTo($el).hide();

			this.collection.forEach(function(model) {
				self.addMenuView(model);
			});

			return this;
		},

		addMenu : function(models) {
			this.collection.add(models);
		},

		addMenuView : function(model) {
			var menuType = model.get('type');
			var menuItemClass;
			if (menuType == 'check') menuItemClass = CheckMenuItemView;
			else if (menuType == 'input') menuItemClass = InputMenuItemView;
			else if (menuType == 'sub') menuItemClass = SubMenuItemView;
			else menuItemClass = ButtonMenuItemView;

			var menuItem = new menuItemClass({model:model, templateHTML : this.templateHTML});
			var $row = menuItem.render().$el.appendTo(this.$list);
			
			this.listenTo(menuItem, 'click', this.onMenuItemClick);
			this.listenTo(menuItem, 'check', this.onMenuItemCheck);
			this.listenTo(menuItem, 'change', this.onMenuItemChange);
			this.listenTo(menuItem, 'focus', this.onCancelBlur);
			this.listenTo(menuItem, 'blur', this.onBlur);
		},

		onFocus : function() {
			var self = this;
			self.onCancelBlur();
			self.trigger('focus');
		},

		onBlur : function() {
			var self = this;
			if (this._blurTimeout) this.onCancelBlur();
			this._blurTimeout = setTimeout(function() {
				self.closeMenu();
			}, 75);
		},

		onCancelBlur : function() {
			clearTimeout(this._blurTimeout);
			this._blurTimeout = null;
		},

		closeMenu : function() {
			this.isFocus = false;
			this.$list.hide(200);
			this.trigger('blur');
		},

		clickMenu : function() {
			if (this.isFocus) {}
			else this.openMenu();
		},

		openMenu : function() {
			this.$list.show(200);
			this.isFocus = true;
			this.$el.focus();
			this.trigger('focus');
		},

		onMenuItemChange : function(model, options) {
			this.trigger('change', model, options);
			this.closeMenu();
		},
		onMenuItemCheck : function(model, options) {
			this.trigger('check', model, options);
		},
		onMenuItemClick : function(model, options) {
			this.trigger('click', model, options);
			this.closeMenu();
		}
	});
	return SubMenuItemView;
});