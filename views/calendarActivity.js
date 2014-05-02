define(
	['backbone', 'underscore', 'jquery',
	'text!views/dayCalendarActivity.html',
	'models/models',
	'views/activity',
	], function (Backbone, _, $, DayCalendarActivityHtml, models, ActivityView) {

		var CalendarActivityView = Backbone.View.extend({

			className : 'activity',
			template : _.template(DayCalendarActivityHtml),
			timestamp : null,
			minTimeInterval : 1800, //seconds

			_startPos : null,

			events : {
				'mousedown .topdrag' : 'startDragTop',
				'mousedown .bottomdrag' : 'startDragBottom',
				'mousedown .bodydrag' : 'startDragBody',
				'click' : 'edit'
			},

			initialize : function(options) {
				options = options || {};
				this.$blocks = options.$blocks || null;
				this.type = options.type || 'day';
				this.setDays(this.type);
				this.listenTo(this.model, 'remove', this.remove);
				this.listenTo(this.model, 'change', this.renderPos);
			},

			setDays : function(type) {
				switch(type) {
					case 'week' : this.blockDay = 7; break;
					case '4day' : this.blockDay = 4; break;
					case 'day'	: this.blockDay = 1; break;
				}
			},

			setTimestamp : function(timestamp) {
				this.timestamp = timestamp;
			},

			render : function() {
				this.$el.html(this.template(this.model.toJSON())).appendTo(this.$activitys);
				this.renderPos();
				return this;
			},

			renderPos : function() {
				var heightPerSecond = this.$blocks.height() / 86400;
				var widthPerDay = this.$blocks.height() / this.blockDay;

				var weekday = Math.floor((this.model.get('starttime') - this.timestamp) / 86400);
				var offset = {
					x : 100 / this.blockDay * weekday,
					y : heightPerSecond * Math.max((this.model.get('starttime') - weekday * 86400 - this.timestamp), 0),
					width : 100 / this.blockDay,
					height : heightPerSecond * Math.max((this.model.get('endtime') - this.model.get('starttime')), 0),
					// width : '100%': hegihtPerHour * (this.model.get('endtime') - this.timestamp)
				};

				console.log('weekday : ' + weekday);
//				debugger;
				console.log(offset);

				this.$el.css({
					left	: offset.x + '%',
					top		: offset.y + 'px',
					width	: offset.width + '%',
					height	: offset.height + 'px'
				});
			},

			draging : function(evt, column) {
				if (!this._drag) return;

				var period = this.model.get('endtime') - this.model.get('starttime');
				
				var blocksOffset = this.$blocks.offset();
				blocksOffset.width = this.$blocks.width();
				blocksOffset.height = this.$blocks.height();

				var offsetX = evt.pageX - blocksOffset.left;
				var offsetY = evt.pageY - blocksOffset.top;
				if (column == 'both') {
//					offsetX -= this._relativePos.x;
					offsetY -= this._relativePos.y;
				}

				var weekday = parseInt(offsetX / (blocksOffset.width / this.blockDay));
				weekday = Math.max(0, weekday);
				weekday = Math.min(6, weekday);
				
				var daystart = parseInt(offsetY / (blocksOffset.height / 86400));
				daystart = Math.max(0, daystart);
				daystart = Math.min(86400, daystart);
				
				if (column == 'both') {
					daystart = Math.min(86400 - period, daystart);
				}

				if (this.minTimeInterval) {
					daystart = Math.round(daystart / this.minTimeInterval) * this.minTimeInterval;
				}
				var newTimestamp = parseInt(this.timestamp + weekday * 86400 + daystart);

				var oldStarttime = this.model.get('starttime');
				var oldEndtime = this.model.get('endtime');
				
				if (column == 'both' && newTimestamp != oldStarttime) {
					this.isDraged = true;
					this.model.set('starttime', newTimestamp);
					this.model.set('endtime', newTimestamp + period);					
				} else if (column == 'start' && newTimestamp != oldStarttime) {
					this.isDraged = true;
					this.model.set('starttime', newTimestamp);
				} else if (column == 'end' && newTimestamp != oldEndtime) {
					this.isDraged = true;
					this.model.set('endtime', newTimestamp);
				}
			},

			startDragBody : function(evt) {
				return this.startDrag(evt, 'both');
			},

			startDragTop : function(evt) {
				return this.startDrag(evt, 'start');
			},

			startDragBottom : function(evt) {
				return this.startDrag(evt, 'end');
			},

			startDrag : function(evt, pos) {
				var self = this;
				this._drag = true;
				this.isDraged = false;
				this._relativePos = {
					x: evt.pageX - this.$el.offset().left,
					y: evt.pageY - this.$el.offset().top,
				};

				var draging = function(evt) {
					self.draging(evt, pos);
					evt.preventDefault();
				};
				var stopDrag = function(evt) {
					self.stopDrag(evt);
					$(document).unbind('mousemove.activity', draging);
					$(document).unbind('mouseup.activity', stopDrag);				
				}

				$(document).bind('mousemove.activity', draging);
				$(document).bind('mouseup.activity', stopDrag);

				this.draging(evt, pos);
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
				console.log('should open a dialog to edit the activity');
				evt.preventDefault();
			}

		});

	return CalendarActivityView;

});