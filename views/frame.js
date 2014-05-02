define(['backbone', 'underscore', 'jquery', 'text!views/frame.html', 'views/page', 'utils/utils'],
	function (Backbone, _, $, FrameHtml, PageView, utils) {

	var FrameView = Backbone.View.extend({
		id : 'zuesframe',
		template : _.template(FrameHtml),
		events : {
			"click button#test1" : "test_click1"
		},

		page : null,

		initialize : function() {
			var page = this.page = new PageView();
			this.listenTo(page, 'tabClick', function(url) {
				utils.gotoPage(url);
			});
		},

		render : function() {
			this.$el.html(this.template({}));
			
			var $right = this.$right = this.$el.children('.right');
			var $screenBackground = this.$screenBackground = this.$el.children('.screen-background');
			var $screen = this.$screen = this.$el.find('.screen');

			$right.html(this.page.render().$el);

			return this;
		},

		showWindow : function(view) {
			this.$screen.append(view.render().$el);
			var $screenBackground = this.$screenBackground.show();
			view.on('close', function() {
				$screenBackground.hide();
			});
		}
	});
	return FrameView;
});