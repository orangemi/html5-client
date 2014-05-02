define([
	'backbone',
	'underscore',
	'jquery',
	'text!views/activityHome.html',
	'views/dayCalendar.js',
	'views/weekCalendar.js',
	'views/monthCalendar.js',
	'views/activity.js',
	'models/models',
	], function (Backbone, _, $, ActivityHomeHtml, DayCalendarView, WeekCalendarView, MonthCalendarView, ActivityView, models) {
	var ActivityHomeView = Backbone.View.extend({
		className : "activityHome",

		template : _.template(ActivityHomeHtml),

		events : {
			'click >header button.goto-today' : 'gotoToday',
			'click >header button.prev' : 'prevPeriod',
			'click >header button.next' : 'nextPeriod',
			'click >header button.day' : 'renderDayCalendar',
			'click >header button.week' : 'renderWeekCalendar',
			'click >header button.month' : 'renderMonthCalendar',
		},

		currentViewType : null,
		currentDate : null,

		initialize : function() {
			this.currentViewType = 'day';
			this.currentDate = new Date();
			this.collection = new models.ActivityCollection();
			this.listenTo(this.collection, 'sync', this.syncActivity);

			this.collection.fetch();
		},
		render : function() {
			this.$el.html(this.template({}));
			this.$header = this.$el.children('header');
			this.$content = this.$el.children('.content');
			this.$activityEditor = this.$el.children('.activityEditor');
			this.$title = this.$el.find('>header .title');

			this.renderCalendar();
			this.renderTitle();

			return this;
		},

		renderTitle : function() {
			var month = this.currentDate.getMonth();
			var getName = function(month) {
				var names = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
				return names[month];
			};
			this.$title.html(getName(month));
		},

		renderCalendar : function(type, options) {
			options = options || {};
			options.date = options.date || new Date(this.currentDate);
			if (!type) type = this.currentViewType;

			var view;
			if (type == 'day') view = new DayCalendarView(options);
			else if (type == 'week') view = new WeekCalendarView(options);
			else if (type == 'month') view = new MonthCalendarView(options);

			if (!view) return console.error('no view for ' + type);

			this.currentViewType = type;
			this.currentView = view;
			this.$header.find('button.calendartype').removeClass('active');
			this.$header.find('button.calendartype.' + type).addClass('active');

			this.$content.empty().html(view.render().$el);
			this.listenTo(view, 'edit', this.editActivity);

			if (options.sync) this.syncActivity(this.collection);
		},

		syncActivity : function(activityCollection) {
			var view = this.currentView;
			activityCollection.forEach(function(activityModel) {
				view.collection.add(activityModel);
			});
		},

		renderActivitys : function(view) {
			var activityModel;
			activityModel = new models.ActivityModel();
			activityModel.set('name', 'double exp');
			activityModel.set('starttime', Date.now() / 1000 - 30000);
			activityModel.set('endtime', Date.now() / 1000 + 300000);

			var t = new Date();
			t.setTime(activityModel.get('starttime') * 1000);
			console.log(t);
			t.setTime(activityModel.get('endtime') * 1000);
			console.log(t);

			view.collection.add(activityModel);
		},

		renderDayCalendar : function() {
			this.renderCalendar('day', {sync: true});
		},
		renderWeekCalendar : function() {
			this.renderCalendar('week', {sync: true});
		},
		renderMonthCalendar : function() {
			this.renderCalendar('month', {sync: true});
		},

		editActivity : function(activityModel) {
			var $activityEditor = this.$activityEditor;
			view = new ActivityView({model : activityModel});
			view.once('remove', function() {
				console.log('remove');
				$activityEditor.hide();
			});
			$activityEditor.html(view.render().$el).show();
		},

		refreshCalendar : function() {
			this.currentView.setDate(new Date(this.currentDate));
			this.renderTitle();

			//todo fecth activity for prev month
		},

		gotoToday : function() {
			this.currentDate = new Date();
			this.refreshCalendar();
		},

		prevPeriod : function() {
			if (this.currentViewType == 'month') {
				this.currentDate.setMonth(this.currentDate.getMonth() - 1);
			} else if (this.currentViewType == 'week') {
				this.currentDate.setDate(this.currentDate.getDate() - 7);
			} else if (this.currentViewType == 'day') {
				this.currentDate.setDate(this.currentDate.getDate() - 1);
			}
			this.currentView.setDate(new Date(this.currentDate));
			this.refreshCalendar();
		},

		nextPeriod : function() {
			if (this.currentViewType == 'month') {
				this.currentDate.setMonth(this.currentDate.getMonth() + 1);
			} else if (this.currentViewType == 'week') {
				this.currentDate.setDate(this.currentDate.getDate() + 7);
			} else if (this.currentViewType == 'day') {
				this.currentDate.setDate(this.currentDate.getDate() + 1);
			}
			this.currentView.setDate(new Date(this.currentDate));
			this.refreshCalendar();
		},
	});
	return ActivityHomeView;
});