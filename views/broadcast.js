define([
	'backbone',
	'underscore',
	'jquery',
	'text!views/broadcast.html',
	'views/playerList',
	'views/message',
	'models/models',
	], function (Backbone, _, $, RewardHtml, PlayerListView, MessageView, models) {
		var RewardView = Backbone.View.extend({
			id : 'broadcast',
			template : _.template(RewardHtml),

			initialize : function() {
				this.message = new MessageView();
				this.playerList = new PlayerListView();
				//this.rootGift.isRoot = true;
			},
			render : function() {
				var $el = this.$el.html(this.template({}));
				var $playerList = this.$playerList = this.$el.children('.player-list');
				var $message = this.$message = this.$el.children('.message-info');
				
				$message.empty().html(this.message.render().$el);
				this.message.delegateEvents();
				
				$playerList.empty().html(this.playerList.render().$el);
				this.playerList.delegateEvents();

				return this;
			},
			addPlayer : function(player) {
				this.playerList.addPlayer(player);
			}
		});
		return RewardView;
	}
);
