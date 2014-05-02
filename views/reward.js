define([
	'backbone',
	'underscore',
	'jquery',
	'text!views/reward.html',
	'views/playerList',
	'views/gift',
	'models/reward',
	'utils/utils'
	], function (Backbone, _, $, RewardHtml, PlayerListView, GiftView, RewardModel, utils) {
		var RewardView = Backbone.View.extend({
			id : 'reward',
			template : _.template(RewardHtml),
			rootGift : null,

			events : {
				'click button.give' : 'giveReward'
			},

			initialize : function() {
				this.rootGift = new GiftView({root:true});
				this.playerList = new PlayerListView();
				//this.rootGift.isRoot = true;
			},
			render : function() {
				var $el = this.$el.html(this.template({}));
				var $playerList = this.$playerList = this.$el.children('.player-list');
				var $rewardList = this.$rewardList = this.$el.children('.reward-list');
				
				$rewardList.empty().html(this.rootGift.render().$el);
				this.rootGift.delegateEvents();
				$playerList.empty().html(this.playerList.render().$el);
				this.playerList.delegateEvents();

				return this;
			},
			addPlayer : function(player) {
				this.playerList.addPlayer(player);
			},
			giveReward : function() {
				var self = this;
				var player_ids = (function (players) {
					var ids = [];
					players.forEach(function(player) {
						ids.push(player.id);
					});
					return ids;
				})(this.playerList.players);

				utils.confirm({content: "Are you sure to send this reward ?"}, function() {
					var reward = new RewardModel({
						players : player_ids,
						gift: self.rootGift.getJSON()
					});
					reward.once('sync', function() {
						utils.confirm({content: "Reward Sent!"});
					});

					reward.save();

				});

			}
		});
		return RewardView;
	}
);
