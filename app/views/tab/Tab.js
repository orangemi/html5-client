define(['marionette', 'underscore', 'text!app/views/tab/Tab.html'], function (Marionette, _, Html) {
	var TabView = Marionette.Layout.extend({
		template : _.template(''),
		className : 'tab',
		isActive : false,

		name : null,
		view : null,
		$page : null,

		events : {
			'click' : 'onClick'
		},

		initialize : function(options) {
			options = options || {};
			this.name = options.name || 'tab';
			this.view = options.view || new Marionette.Layout();
			this.isActive = false;
		},

		onRender : function() {
			var $content = this.view.render().$el;
			this.$el.html(this.name);
			$content.appendTo(this.$page);
		},

		onClick : function() {
			debugger;
		},

		getIndex : function() {
			return this.$el.index();
		},

	});

	var TabListView = Marionette.Layout.extend({
		template : _.template(Html),
		className : 'tablist',
		$tabs : null,
		$pages : null,

		initialize : function(options) {
			options = options || {};

			var self = this;
			var tabs = this.tabs = options.tabs;
		},

		onRender : function() {
			var self = this;
			var $tabs = this.$tabs = this.$el.find('.tabs');
			var $pages = this.$pages = this.$el.find('.pages');

			if (this.tabs) this.tabs.forEach(function(tab) {
				self.addTab(tab);
			});

		},

		addTab : function(item) {
			var tabView = new TabView(item);
			tabView.$page = $('<div>').addClass('page').appendTo(this.$pages);
			tabView.render().$el.appendTo(this.$tabs);

			//TODO bind events

		},
	});

	return TabListView;
});