define(['marionette', 'underscore', 'text!app/views/tab/Tab.html'], function (Marionette, _, Html) {
	var TabView = Marionette.Layout.extend({
		template : _.template(''),
		className : 'tab',
		$page : null,

		getIndex : function() {
			return this.$el.index();
		},

	});

	var TabListView = Marionette.Layout.extend({
		template : _.template(Html),
		$tabs : null,
		$pages : null,

		onRender : function() {
			var $tabs = this.$tabs = this.$el.find('.tabs');
			var $pages = this.$pages = this.$el.find('.pages');
		},

		addTab : function(item) {
			var tabView = new TabView(item);
			tabView.render().$el.appendTo(this.$tabs);
			tabView.$page = $('<div>').addClass('page').appendTo(this.$pages);
			
		},
	});
});