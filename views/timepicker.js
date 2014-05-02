define([
	'backbone',
	'underscore',
	'jquery',
	'views/select',
	//'text!views/timePicker.html',
	], function (Backbone, _, $, SelectView) {

		var TimePickerView = SelectView.extend({

			className : "menu select-list timepicker",
			events: {
				'blur >input' : 'closeMenu',
				'change >input' : 'onChange',
				'click >input' : 'clickMenu'
			},

			initialize: function(options) {
				SelectView.prototype.initialize.apply(this, arguments);
				this.collection.reset().add([
					{name: '00:00'},
					{name: '01:00'},
					{name: '02:00'},
					{name: '03:00'},
					{name: '04:00'},
					{name: '05:00'},
					{name: '06:00'},
					{name: '07:00'},
					{name: '08:00'},
					{name: '09:00'},
					{name: '10:00'},
					{name: '11:00'},
					{name: '12:00'},
					{name: '13:00'},
					{name: '14:00'},
					{name: '15:00'},
					{name: '16:00'},
					{name: '17:00'},
					{name: '18:00'},
					{name: '19:00'},
					{name: '20:00'},
					{name: '21:00'},
					{name: '22:00'},
					{name: '23:00'},
				]);
			},

			render : function() {
				var self = this;
				var $el = this.$el.empty().attr('tabindex', 0);
				var $input = this.$input = $('<input>').addClass('edit').val(this.title).appendTo($el);
				var $list = this.$list = $('<div>').addClass('list').appendTo($el);
				this.collection.forEach(function(model) {
					self.addMenuView(model);
				});

				return this;
			},

			clickMenu : function() {
				if (this.isFocus) return;
				else this.openMenu();
			},

			openMenu : function() {
				this.$list.show(200);
				this.isFocus = true;
			},

			onMenuItemClick : function(model, options) {
				SelectView.prototype.onMenuItemClick.apply(this, arguments);
				this.onChange();
			},

			onChange : function() {
				console.log('change', this.$input.val());
				this.trigger('change', this.$input.val());
			},

			renderTitle : function(model) {
				this.title = _.template(this.templateHTML, model.toJSON());
				this.$input.val(this.title);
			}
		});
		return TimePickerView;
	}
);