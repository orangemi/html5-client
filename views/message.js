define([
	'backbone',
	'underscore',
	'jquery',
	'text!views/message.html',
	'views/gift',
	], function (Backbone, _, $, MessageHtml, GiftView) {
		var MessageView = Backbone.View.extend({
			className : 'message',
			template : _.template(MessageHtml),

			initialize : function() {
				this.gift = new GiftView();
			},

			render : function() {
				this.$el.html(this.template());

				var $reward = this.$el.find('.reward-list');

				$reward.empty().html(this.gift.render().$el);
				this.gift.delegateEvents();

				return this;
			}
		});
		return MessageView;
	}
);