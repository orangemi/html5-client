define(['backbone', 'underscore', 'jquery', 'text!views/page.html'], function (Backbone, _, $, PageHtml) {
	
	var PageView = Backbone.View.extend({
		className : 'page',
		template : _.template(PageHtml),
		events : {
			'click .tabs>li' : 'tabClick'
		},
		pages : null,
		maxPage : 0,

		initialize : function() {
		},
		render : function() {
			this.$el.html(this.template({}));
			this.$tabs = this.$el.children('.tabs');
			this.$pages = this.$el.children('.pages');

			this.pages = {};

			for (var name in this.pages) {
				var pageView = this.pages[name];
				this.addPage(name, PageView);
			}
			return this;
		},

		addPage : function(pageView, name) {
			if (!name) name = "default";
			var pageInfo = this.pages[name];
			if (pageInfo) {
				this.jumpToIndex(pageInfo.index);
				return pageInfo.page;
			}
			
			var $tab = $('<li>').html(name).appendTo(this.$tabs);
			var $page = $('<li>').html(pageView.render().$el).appendTo(this.$pages);
			this.pages[name] = {name:name, page:pageView, index: this.maxPage };
			this.jumpToIndex(this.maxPage);
			this.maxPage++;

			return pageView;
		},
		closePage : function(name) {},

		jumpToIndex: function(index) {
			this.$tabs.children().removeClass('active');
			this.$tabs.children(':eq(' + index + ')').addClass('active');
			this.$pages.children().removeClass('active');
			this.$pages.children(':eq(' + index + ')').addClass('active');
			this.$pages.css('-webkit-transform','translate3d(-' + index + '00%, 0, 0)')
		},

		tabClick : function(evt) {
			var $tab = $(evt.currentTarget);
			var name = $tab.html();
			this.trigger('tabClick', name);
		}


	});

	return PageView;
});