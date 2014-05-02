define(
	['backbone', 'underscore', 'jquery',
	'text!views/dayCalendar.html',
	'text!views/dayCalendarActivity.html',
	'models/models',
	'views/activity',
	'views/dayCalendar',
	'views/calendarActivity',
	], function (Backbone, _, $, DayCalendarHtml, DayCalendarActivityHtml, models, ActivityView, DayCalendarView, CalendarActivityView) {

		var WeekCalendarView = DayCalendarView.extend({
			className : 'calendar week',

			resetTime : function() {
				this.constructor.__super__.resetTime.apply(this);
				this.date.setDate(this.date.getDate() - this.date.getDay());

				console.log(this.date);
				console.log(this.date.toLocaleString());
			},

			addActivity : function(activityModel) {
				if (!activityModel instanceof models.ActivityModel) return;
				if (!this.inCalendarDay(activityModel.get('starttime')) && !this.inCalendarDay(activityModel.get('endtime'))) return;

				var activityView = new CalendarActivityView({model : activityModel, $blocks : this.$blocks, type : 'week'});
				activityView.setTimestamp(this.date.getTime() / 1000);
				this.$activitys.append(activityView.render().$el);
			},

		});
		return WeekCalendarView;
});