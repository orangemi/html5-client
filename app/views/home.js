define([
'marionette', 'underscore', 'app/app', 'text!app/views/home.html', ],
function (Marionette, _, app, Html) {
	var HomeView = Marionette.Layout.extend({
		id : 'main',
		tagName : 'box',
		template : _.template(Html),

		regions : {
			"topRegion" : ">.top",
			"bodyRegion" : ">.body",
			"bottomRegion" : ">.bottom",
			"popRegion" : ">.pop",
		},

		initialize : function() {},

		onRender : function() {
			this.$el.css({
				width: app.config.get('width') + 'px',
				height: app.config.get('height') + 'px'
			});
		},

		showPop : function(view) {
			this.popRegion.show(view);
			var pops = this.$el.find('>.pop').removeClass('hide');
			view.on('close', function() {
				if (pops.length == 1) pops.addClass('hide');
			});
		}
	});

	return HomeView;
});