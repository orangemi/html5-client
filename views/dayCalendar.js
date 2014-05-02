define(
	['backbone', 'underscore', 'jquery',
	'text!views/dayCalendar.html',
	'text!views/dayCalendarActivity.html',
	'models/models',
	'views/activity',
	'views/calendarActivity',
	], function (Backbone, _, $, DayCalendarHtml, DayCalendarActivityHtml, models, ActivityView, CalendarActivityView) {
		
		var DayCalendarView = Backbone.View.extend({
			className : 'calendar day',
			template : _.template(DayCalendarHtml),

			events : {
				'click .blocks' : 'newActivity',
			},

			collection : null,
			timezone : null,
			date : null,

			initialize : function(options) {
				options = options || {};

				this.date = options.date || new Date();
				this.timezone = options.timezone || new Date().getTimezoneOffset() / -60;
				this.resetTime();

				this.collection = new Backbone.Collection();
				this.listenTo(this.collection, 'add', this.addActivity);
			},

			render : function() {
				var $el = this.$el;
				$el.html(this.template({}));
				this.$title = $el.find('>.header h1');
				this.$timezone = $el.find('>.timezone');
				this.$blocks = $el.find('>.blocks');
				this.$activitys = $el.find('>.blocks>.activitys');
				this.$now = $el.find('>.blocks>.now');

				this.$timezone.html(this.getTimezoneString());

				return this;
			},

			resetTime : function() {
				this.date.setUTCMilliseconds(0);
				this.date.setUTCSeconds(0);
				this.date.setUTCMinutes(0);
				this.date.setUTCHours(0 - this.timezone);

				console.log(this.date);
				console.log(this.date.toLocaleString());
			},

			inCalendarDay : function(timestamp) {
				return timestamp * 1000 >= this.date.getTime() ||
					timestamp * 1000 < this.date.getTime() + 86400 * 1000;
			},

			getTimezoneString : function(timezone) {
				if (!timezone) timezone = this.timezone;
				return 'GMT' + (timezone >= 0 ?
					timezone >= 10 ?
					'+' + timezone.toString() :
					'+0' + timezone.toString() :
					timezone <= -10 ?
					timezone.toString() :
					'-0' + Math.abs(timezone)
				);
			},

			newActivity : function(evt) {
				console.log('it will create a new activity soon');
			},

			addActivity : function(activityModel) {
				if (!activityModel instanceof models.ActivityModel) return;
				if (!this.inCalendarDay(activityModel.get('starttime')) && !this.inCalendarDay(activityModel.get('endtime'))) return;
//				this.activitys.add(activityModel);

				var activityView = new CalendarActivityView({model : activityModel, $blocks : this.$blocks, type : 'day'});
				activityView.setTimestamp(this.date.getTime() / 1000);
				this.$activitys.append(activityView.render().$el);
			},

		});
		return DayCalendarView;
});