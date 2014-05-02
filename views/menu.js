define([
	'backbone',
	'underscore',
	'jquery',
	'views/buttonMenu',
	'views/checkMenu',
	'views/inputMenu',
	'views/subMenu',
	], function (Backbone, _, $, ButtonMenuItemView, CheckMenuItemView, InputMenuItemView, SubMenuItemView) {

	var MenuView = Backbone.View.extend({

		className : 'menu',
		title : '...',
		widthSearch : false,
		templateHTML : '<%= name %>',
		events: {
			'blur' : 'onBlur',
			'click >.title' : 'clickMenu',
			'focus' : 'onFocus',
			'keydown >.list>input.filter' : 'onFilterChange',
		},

		_blurTimeout : null,

		initialize : function(options) {
			options = options || {};
			this.title = options.title || this.title;
			this.templateHTML = options.templateHTML || this.templateHTML;
			this.widthSearch = options.widthSearch || false;

			this.collection = this.collection || new Backbone.Collection();
			this.listenTo(this.collection, 'add', this.addMenuView);
		},

		render : function() {
			var self = this;
			var $el = this.$el.empty().attr('tabindex', 0);
			var $title = this.$title = $('<div>').addClass('title').html(this.title).appendTo($el);
			var $list = this.$list = $('<div>').addClass('list').appendTo($el).hide();

			if (this.widthSearch) {
				var filterInputView = new InputMenuItemView({model: new Backbone.Model()});
				filterInputView.onKeyDown = function() {};
				filterInputView.render().$el.appendTo($list);
				this.$filterInput = filterInputView.$input;
				
				this.listenTo(filterInputView, 'focus', this.onCancelBlur);
				this.listenTo(filterInputView, 'blur', this.onBlur);
				
				filterInputView.on('keyup', function(value) {
					self.trigger('filter', value);
				});
			}

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

			menuItem.listenTo(this, 'filter', function(value) {
				var model = menuItem.model;
				var reg = new RegExp(value, 'i');
				if (reg.test(model.get('name')) || reg.test(model.get('id'))) {
					menuItem.$el.show();
				} else {
					menuItem.$el.hide();
				}
			});
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
			if (this.isFocus) this.closeMenu();
			else this.openMenu();
		},

		openMenu : function() {
			this.$list.show(200);
			this.isFocus = true;
			this.$el.focus();
			this.trigger('focus');

			if (this.$filterInput) {
				this.$filterInput.focus().select();
			}
		},

		onMenuItemChange : function(model, options) {
			this.trigger('itemChange', model, options);
			this.closeMenu();
		},
		onMenuItemCheck : function(model, options) {
			this.trigger('itemCheck', model, options);
		},
		onMenuItemClick : function(model, options) {
			this.trigger('itemClick', model, options);
			this.closeMenu();
		}
	});
	return MenuView;
});
