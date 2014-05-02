define([
	'backbone',
	'underscore',
	'jquery',
	'views/buttonMenu'
	], function (Backbone, _, $, ButtonMenuItemView) {

	var CheckMenuItemView = ButtonMenuItemView.extend({
		className : 'chk-menu-item',

		render : function() {
			ButtonMenuItemView.prototype.render.apply(this, arguments);
			this.$el.toggleClass('checked', this.model.get('checked'));
			return this;
		},

		
		onClick : function(evt) {
			this.$el.toggleClass('checked');
			this.trigger('check', this.model);
		}
	});

	return CheckMenuItemView;
});