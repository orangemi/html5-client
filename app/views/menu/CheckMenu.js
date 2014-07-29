define(['marionette', 'underscore',], function (Marionette, _) {
	var CheckMenu = Marionette.Layout.extend({
		template : _.template(''),
		className : 'menu_item menu_check',

		checkStatus : false,

		$span : null,
		$check : null,

		events : {
			'click' : 'onClick'
		},

		text : '',

		initialize : function(options) {
			options = options || {};
			this.text = options.text || this.text;
			this.checkStatus = options.check || false;
		},

		toggleCheck : function(flag) {
			if (flag === undefined) flag = !this.checkStatus;
			this.checkStatus = flag;
			this.$el.toggleClass('check', flag);
		},

		onRender : function() {
			var $check = this.$check = $('<em>').appendTo(this.$el);
			var $span = this.$span = $('<span>').html(this.text).appendTo(this.$el);
			this.toggleCheck(this.checkStatus);
		},

		onClick : function() {
			this.toggleCheck();
			this.trigger('menu:CheckClick', this, this.checkStatus);
		},
	});

	return CheckMenu;
});
