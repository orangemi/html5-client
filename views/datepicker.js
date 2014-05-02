define([
	'backbone',
	'underscore',
	'jquery',
	'views/select',
	'text!views/calendarpicker.html',
	], function (Backbone, _, $, SelectView, CalendarHtml) {

		var CalendarView = Backbone.View.extend({
			tagName : 'table',
			className : 'calendar-picker',
			template : _.template(CalendarHtml),

			events : {
				'click td' : 'chooseDay',
				'mousedown' : 'onMouseDown',
				'click button.left' : 'goPrevMonth',
				'click button.right' : 'goNextMonth',
			},

			render : function() {
				this.$el.html(this.template({}));
				this.$tbody = this.$el.find('tbody');
				this.$title = this.$el.find('caption h6');
				this.setCurrentDate(new Date());

				return this;
			},

			goNextMonth : function() {
				console.log(this.year, this.month);
				var date = new Date();
				date.setYear(this.year);
				date.setMonth(this.month + 1);
				this.renderCalendar(date);
			},

			goPrevMonth : function() {
				var date = new Date();
				date.setYear(this.year);
				date.setMonth(this.month - 1);
				this.renderCalendar(date);
			},

			setCurrentDate : function(today) {
				var theDate = this.date = new Date(today);
				this.renderCalendar(theDate);
			},

			renderCalendar : function(date) {
				var theDate = new Date(date);
				theDate.setHours(0,0,0,0);
				theDate.setDate(1);

				var weekday = theDate.getDay();
				var theYear = this.year = theDate.getFullYear();
				var theMonth = this.month = theDate.getMonth();
				
				theDate.setDate(1 - weekday);

				var self = this;
				this.$title.html(theYear + '/' + (theMonth + 1));
				this.$el.find('td').each(function(i, html) {
					var date = new Date(theDate);
					date.setTime(date.getTime() + i * 86400 * 1000);
					$(html).html(date.getDate())
						.toggleClass('month', date.getMonth() == theMonth)
						.toggleClass('today',
							date.getFullYear() == self.date.getFullYear() &&
							date.getMonth() == self.date.getMonth() &&
							date.getDate() == self.date.getDate()
						);
				});
			},

			onMouseDown : function(event) {
				event.preventDefault();
			},

			chooseDay : function(event) {
				var $td = $(event.currentTarget);
				var weekday = $td.index();
				var week = $td.parent().index() - 1;
				
				var date = new Date();
				date.setYear(this.year);
				date.setMonth(this.month);
				date.setDate(1);
				date.setDate(1 - date.getDay());

				date.setTime(date.getTime() + (week * 7 + weekday) * 86400 * 1000);
				console.log('choose' + date);
				this.trigger('choose', date);
			}

		});

		var DatePickerView = SelectView.extend({

			className : "menu select-list date-picker",
			events: {
				'blur >input' : 'closeMenu',
				'change >input' : 'onChange',
				'click >input' : 'clickMenu'
			},

			calendarView : null,

			initialize : function(options) {
				SelectView.prototype.initialize.apply(this, arguments);

				options = options || {};
				this.dateformat = options.format || 'yyyy-mm-dd';
			},

			render : function() {
				var self = this;
				var $el = this.$el.empty().attr('tabindex', 0);
				var $input = this.$input = $('<input>').addClass('edit long').val(this.title).appendTo($el);
				var $list = this.$list = $('<div>').addClass('list').appendTo($el);

				var calendarView = this.calendarView = new CalendarView();
				$list.html(calendarView.render().$el);
				this.listenTo(calendarView, 'choose', this.onChoose);

				return this;
			},

			clickMenu : function() {
				if (this.isFocus) return;
				else this.openMenu();
			},

			openMenu : function() {
				this.$list.show(200);
				this.isFocus = true;

				var value = this.$input.val();
				this.calendarView.setCurrentDate(new Date(value));
			},

			onChoose : function(date, options) {
				this.$input.val(date.format(this.dateformat));
				this.closeMenu();
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
		return DatePickerView;
	}
);