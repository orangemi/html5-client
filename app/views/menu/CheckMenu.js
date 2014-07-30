define(['marionette', 'underscore',], function (Marionette, _) {
	var CheckMenu = Marionette.Layout.extend({
		tagName : 'li',
		template : _.template('<a><%=text%></a>'),
		//template : _.template('<a><%=text%></a>'),
		className : 'menu_item menu_check',

		checkStatus : false,

		events : {
			'click' : 'onClick'
		},

		initialize : function(options) {
			options = options || {};
			this.model = new Backbone.Model({
				text: options.text || '',
				check: options.check || false,
			});
		},

		toggleCheck : function(flag) {
			if (flag === undefined) flag = !this.model.get('check');
			this.model.set('check', flag);
			this.$el.toggleClass('check', flag);
		},

		onRender : function() {
			this.toggleCheck(this.model.get('check'));
		},

		onClick : function() {
			this.toggleCheck();
			this.trigger('menu:CheckClick', this, this.checkStatus);
		},
	});

	return CheckMenu;
});
