define(['backbone', 'underscore', 'jquery', 'text!views/activity.html', 'views/select','views/datepicker', 'views/timepicker', 'utils/utils'],
	function (Backbone, _, $, ActivityHmtl, SelectView, DatePickerView, TimePickerView, utils) {

	var ActivityView = Backbone.View.extend({

		className : 'activity-block',
		template : _.template(ActivityHmtl),

		events : {
			'click button.close' : 'closeActivity'
		},

		initialize : function(options) {

		},

		render : function() {
			var self = this;
			var model = this.model;
			this.$el.html(this.template({}));
			this.$className = this.$el.find('.body>.row.className');

			var selectView = new SelectView({
				defaultJSON: {name:model.get('type')},
				collection : utils.data.others.activityCollection
			});

			this.$el.find('[data-col=className]').each(function(i, html) {
				$(html).html(selectView.render().$el);
			});
			this.listenTo(selectView, 'itemClick', this.changeType);

			this.$el.find('[data-type=date]').each(function(i, html) {
				var column = $(html).attr('data-col');
				var value = model.get(column);
				if (!value) return;

				var date = new Date();
				date.setTime(value * 1000);

				var datePickerView = new DatePickerView({
					date : date,
					format : 'yyyy-mm-dd',
					defaultJSON: { name: date.format('yyyy-mm-dd') }
				});

				datePickerView.on('change', function() {
					self.onChange({currentTarget : html});
				});

				$(html).html(datePickerView.render().$el);
			});

			
			this.$el.find('[data-type=time]').each(function(i, html) {
				var column = $(html).attr('data-col');
				var value = model.get(column);
				if (!value) value = Date.now() / 1000;
				
				var date = new Date();
				date.setTime(value * 1000);

				var timePickerView = new TimePickerView({
					defaultJSON: { name: date.format('HH:MM:ss') }
				});

				timePickerView.on('change', function() {
					self.onChange({currentTarget : html});
				});
				$(html).html(timePickerView.render().$el);
			});

			return this;
		},

		closeActivity : function() {
			this.remove();
		},

		remove : function() {
			this.trigger('remove');
			return Backbone.View.prototype.remove.apply(this, arguments);
		},

		onChange : function(event) {
			var $input = $(event.currentTarget);
			var column = $input.attr('data-col');
			var type = $input.attr('data-type');
			var value = $input.val();
			if (!column) return;

			if (type == 'time' || type == 'date') {
				var $inputs = this.$el.find('[data-col=' + column + ']');
				value = $inputs.filter('[data-type=date]').find('input.edit').val() + ' ' + $inputs.filter('[data-type=time]').find('input.edit').val();
				var date = new Date(value);
				value = date.getTime() / 1000;
				this.model.set(column, value);
			} else {
				//this.model.set(column, value);
			}
		},

		changeType : function(model) {
			var typeName = model.get('name');
			console.log('change activity type to ' + typeName + ' ...');
		}
	});

	return ActivityView;
});