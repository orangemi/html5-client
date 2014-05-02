define([
	'backbone',
	'underscore',
	'jquery',
	'text!views/monthCalendar.html',
	'views/activity.js',
	'models/models',
	], function (Backbone, _, $, MonthCalendarHtml, ActivityView, models) {

		var MonthCalendarActivityView = Backbone.View.extend({
			className : 'activity',
			timestamp : 0,

			_startPos : null,

			events : {
				'mousedown' : 'startDrag',
				'click' : 'edit'
			},


			initialize : function(options) {
				options = options || {};
				this.listenTo(this.model, 'change', this.render);
			},

			setTimestamp : function(timestamp) {
				this.timestamp = timestamp;
			},

			getOffset : function() {

				var offset = {};
				var starttime = Math.max(this.model.get('starttime') , this.timestamp);
				offset.left = 100 * (starttime - this.timestamp) / (7 * 86400);
				var endtime = Math.min(this.model.get('endtime') , this.timestamp + 7 * 86400);
				offset.width = 100 * (endtime - starttime) / (7 * 86400);

				return offset;
			},

			inRange : function() {
				return this.model.get('starttime') < this.timestamp + 7 * 86400 && this.model.get('endtime') > this.timestamp;
			},

			render : function() {
				if (!this.inRange()) {
					this.trigger('rangeerror', this);
					this.$el.hide();
					return this;
				}

				this.$el.html(this.model.get('name')).css({background: 'red'}).show();
				this.renderPos();
				return this;
			},

			renderPos : function() {
				var offset = this.getOffset();

				this.$el.css({
					left : offset.left + '%',
					top : '20px',
					width : offset.width + '%',
					height : '20px'
				});
			},

			draging : function(evt) {
				var $parent = this.$parent;
				var currentPos = {
					x: evt.pageX - $parent.offset().left,
					y: evt.pageY - $parent.offset().top,
				};

				var width = $parent.width();
				var height = $parent.height();

				var thisWeekday = Math.floor(7 * currentPos.x / width);
				Math.max(this.weekday, 0);
				Math.min(this.weekday, 6);

				var offset = {
					weekday : thisWeekday - this._startPos.weekday,
					week : Math.floor(currentPos.y / height),
				};

				this.model.set('starttime', this._startPos.starttime + offset.week * 86400 * 7 + offset.weekday * 86400);
				this.model.set('endtime', this._startPos.endtime + offset.week * 86400 * 7 + offset.weekday * 86400);

			},

			startDrag : function(evt) {
				var self = this;
				this._drag = true;
				this.isDraged = false;
				
				var $parent = this.$parent = this.$el.parent();
				var width = $parent.width();
				var height = $parent.height();

				var currentPos = {
					x: evt.pageX - $parent.offset().left,
					y: evt.pageY - $parent.offset().top,
					starttime : this.model.get('starttime'),
					endtime : this.model.get('endtime'),
				};
				
				currentPos.weekday = Math.floor(7 * currentPos.x / width);
				this._startPos = currentPos;

				var draging = function(evt) {
					self.draging(evt);
					evt.preventDefault();
				};
				var stopDrag = function(evt) {
					self.stopDrag(evt);
					$(document).unbind('mousemove.activity', draging);
					$(document).unbind('mouseup.activity', stopDrag);				
				}

				$(document).bind('mousemove.activity', draging);
				$(document).bind('mouseup.activity', stopDrag);

				this.draging(evt);
				this.trigger('startdrag', evt);
				evt.preventDefault();
			},

			stopDrag : function(evt) {
				evt.preventDefault();
				this._drag = false;
				console.log('stopdrag');

				this.trigger('stopdrag', evt);
			},

			edit : function(evt) {
				evt.stopImmediatePropagation();
				if (this.isDraged) return;
				console.log('edit the activity');
				this.trigger('edit', this.model);
				evt.preventDefault();
			}

		});

		var MonthCalendarView = Backbone.View.extend({

			className : 'calendar-month',
			template : _.template(MonthCalendarHtml),

			initialize : function(options) {
				this.date = options.date || new Date();
				this.collection = new Backbone.Collection();
				this.resetDate();

				this.listenTo(this.collection, 'add', this.addActivity);
			},

			resetDate : function() {
				this.date.setHours(0,0,0,0);
				this.date.setDate(1);
			},

			render : function() {
				this.$el.html(this.template({}));
				this.renderDate();
				this.renderNow();
				this.$activitys = this.$el.find('.activitys');
				return this;
			},

			addActivity : function(activityModel) {
				var startweek = Math.floor((activityModel.get('starttime') - this.date.getTime() / 1000) / (7 * 86400));
				var endweek = Math.floor((activityModel.get('endtime') - this.date.getTime() / 1000) / (7 * 86400));

				var theDate = new Date(this.date);
				theDate.setDate(1);
				theDate.setDate(1 - theDate.getDay());
//				for (var week = startweek ; week <= endweek; week++) {
				for (var week = 0 ; week <= 5; week++) {
					var $activitys = this.$activitys.eq(week);
					var view = new MonthCalendarActivityView({model: activityModel});
					var starttime = theDate.getTime() / 1000 + week * 86400 * 7;
					view.setTimestamp(starttime);
					$activitys.append(view.render().$el);
					this.listenTo(view, 'edit', this.editActivity);
				}

				this.listenTo(activityModel, 'change', this.refreshActivityWeek);
				//this.listenTo(view, '');
			},

			refreshActivityWeek : function(activityModel) {
				var startweek = Math.floor((activityModel.get('starttime') - this.date.getTime() / 1000) / (7 * 86400));
				var endweek = Math.floor((activityModel.get('endtime') - this.date.getTime() / 1000) / (7 * 86400));
			},

			renderDate : function() {
				var self = this;
				
				var theFirstDate = new Date(this.date);
				theFirstDate.setDate(1);
				var theMonth = theFirstDate.getMonth();
				theFirstDate.setDate(1 - theFirstDate.getDay());

				this.$el.find('.day').each(function(i, html) {
					var date = new Date(theFirstDate);
					date.setTime(date.getTime() + i * 86400 * 1000);
					var theDate = (i == 0 || date.getDate() == 1) ? date.format('m/d') : date.getDate();
					$(html).html(theDate).toggleClass('month', date.getMonth() == theMonth);
				});
			},

			setDate : function(date) {
				this.date = new Date(date);

				this.resetDate();
				this.render();
			},

			renderNow : function() {
				console.log('to show now date');
			},

			editActivity : function(activityModel) {
				this.trigger('edit', activityModel);
			}

		});

		return MonthCalendarView;
});
