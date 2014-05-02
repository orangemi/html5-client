define([
	'backbone',
	'underscore',
	'text!views/player.html',
	'views/table',
	'models/models',
	'utils/utils',
	], function (Backbone, _, PlayerHtml, TableView, models, utils) {
		var PlayerView = Backbone.View.extend({

			className : 'player-info',
			template : _.template(PlayerHtml),

			heroTable : null,
			equipTable : null,

			events : {
				'click .buttons .saveplayer' : 'savePlayer',
				'click .buttons .refresh' : 'refreshPlayer',
				'click .buttons .addToReward' : 'addToReward',
				'click .buttons .addToBroadcast' : 'addToBroadcast',

				'click section>header' : 'foldSection',

				'change .basic .row input' : 'changeData',

				'change .userinformation .row input': 'changeData'
			},

			initialize : function(options) {
				var self = this;
				var heroes = new models.HeroCollection();
				heroes.setPlayer(options.id);
				this.heroTable = new TableView({collection: heroes});
				this.heroTable.addColumns(utils.data.columns.hero);
				//this.heroTable.startLoading();
				//debugger;
				this.listenTo(this.heroTable, 'buttonClick:save', this.saveModel);
				this.listenTo(this.heroTable, 'buttonClick:showEquips', this.showHeroEquip);

				var equips = new models.EquipCollection();
				equips.setPlayer(options.id);
				this.equipTable = new TableView({collection: equips});
				this.equipTable.addColumns(utils.data.columns.equip);
				this.listenTo(this.equipTable, 'buttonClick:save', this.saveModel);
				this.listenTo(this.equipTable, 'buttonClick:showEquipedHero', this.showEquipedHero);

				var items = new models.ItemCollection();
				items.setPlayer(options.id);
				this.itemTable = new TableView({collection: items});
				this.itemTable.addColumns(utils.data.columns.item);
				this.listenTo(this.itemTable, 'buttonClick:save', this.saveModel);

				var pieces = new models.PieceCollection();
				pieces.setPlayer(options.id);
				this.pieceTable = new TableView({collection: pieces});
				this.pieceTable.addColumns(utils.data.columns.piece);
				this.listenTo(this.pieceTable, 'buttonClick:save', this.saveModel);

				var messages = new models.MessageCollection();
				messages.setPlayer(options.id);
				this.messageTable = new TableView({collection: messages});
				this.messageTable.addColumns(utils.data.columns.message);
				this.listenTo(this.messageTable, 'buttonClick:save', this.saveModel);


				this.$el.html(this.template({}));
				this.model = new models.PlayerModel({ id : options.id });
				this.listenTo(this.model, 'sync', this.renderPlayer);

				var usermodel = this.usermodel = new models.UserModel();
				this.listenTo(this.usermodel,'sync',this.renderUserInfo);
				this.model.on('sync', function(model) {
					usermodel.set('id', model.get('m_uid'));
					usermodel.fetch();
				});

				//init fetch data
				this.fetchData();

			},

			fetchData : function() {
				this.model.fetch();
				this.heroTable.collection.fetch();
				this.equipTable.collection.fetch();
				this.itemTable.collection.fetch();
				this.pieceTable.collection.fetch();
				this.messageTable.collection.fetch();
			},

			changeData : function(evt) {
				var $input = $(evt.currentTarget);
				var column = $input.attr('data-col');
				var value = $input.val();
				this.model.set(column, value);
				$input.addClass('changed');
			},

			render : function() {
				this.$el.html(this.template({}));
				this.$el.find('>.heroes>div').empty().html(this.heroTable.render().$el);
				this.$el.find('>.equips>div').empty().html(this.equipTable.render().$el);
				this.$el.find('>.items>div').empty().html(this.itemTable.render().$el);
				this.$el.find('>.pieces>div').empty().html(this.pieceTable.render().$el);
				this.$el.find('>.messages>div').empty().html(this.messageTable.render().$el);
				this.heroTable.delegateEvents();
				this.equipTable.delegateEvents();
				this.itemTable.delegateEvents();
				this.pieceTable.delegateEvents();
				this.messageTable.delegateEvents();

				return this;
			},

			renderPlayer : function() {
				var model = this.model;
				var basicInfo = this.$el.find('.basic');
				/*var maxsta = basicInfo.find('span').val(model.get());*/
				basicInfo.find('[data-col]').each(function(i, html){
					var column = $(html).attr('data-col');
					if ($(html).is("input")) {
						$(html).removeClass('changed').val(model.get(column));
					} else {
						$(html).html(model.get(column));
					}
					if ($(html).attr('data-type') == 'time') {
						$(html).removeClass('changed').html(utils.dateFormat(model.get(column) * 1000));
					}
				});
				
				basicInfo.find('[data-type=total_login_reward]').each(function(j, html) {
					$(html).find('>.slot').empty();
					var reward = model.get('total_login_reward');
					if (!reward) return;
					reward = reward.split('_')[1];
					for (var i = 0; i < reward.length; i++) {
						switch (reward[i]) {
							case "0" :
							$(html).find('>.slot:eq('+i+')').html('<span >未领取</span>');
							$(html).find('>.slot:eq('+i+')').addClass('rewarda');
							break;
							case "1" :
							$(html).find('>.slot:eq('+i+')').html('<span >可领取</spad>');
							$(html).find('>.slot:eq('+i+')').addClass('rewardb');
							break;
							case "2" :
							$(html).find('>.slot:eq('+i+')').html('<span >已领取</span>');
							$(html).find('>.slot:eq('+i+')').addClass('rewardc');
							break;
						}
					}
				});

				basicInfo.find('[data-type=queue]').each(function(j, html) {
					$(html).find('>.slot').empty();
					model.get("queue").split(',').forEach(function(heroId, i) {
						var hero = new models.HeroModel({id: heroId});
						var formation = model.get("formation").split(',')[i];
						hero.once('sync', function() {
							var heroProto = utils.data.heroCollection.get(hero.get('hero_id'));
							$(html).find('.slot' + formation).html('<img src="/zues/imgs/hero/'+ heroProto.get('img') +'.png" /> '+"<span>"+hero.get('hero_id')+":"+heroProto.get('ge_name')+"</span>");
						});
						hero.fetch();
					});
				});
			},
			renderUserInfo : function() {
				var model = this.usermodel;
				var userInfo = this.$el.find('.userinformation');
				userInfo.find('[data-col]').each(function(i, html){
					var column = $(html).attr('data-col');
					if ($(html).is("input")) {
						$(html).removeClass('changed').val(model.get(column));
					} else {
						$(html).html(model.get(column));
					}
					if ($(html).attr('data-type') == 'time') {
						$(html).removeClass('changed').html(utils.dateFormat(model.get(column) * 1000));
					}
				});
			},

			foldSection : function(evt) {
				var $section = $(evt.currentTarget).parent();
				$section.toggleClass('fold');
			},

			savePlayer : function() {
				var self = this;
				utils.confirm({content: 'Are you sure to save this player?'}, function() {
					self.model.save();
				});

			},

			saveModel : function(model) {
				utils.confirm({content: 'Are you sure to save this?'}, function() {
					model.save();
				});
			},

			showEquipedHero : function(equipModel) {
				this.heroTable.resetFilter();
				this.heroTable.setFilter('', 'id', equipModel.get('hero_id'));
			},

			refreshPlayer : function() {
				var self = this;
				utils.confirm({content: 'You will lost your current change. are you sure?'}, function() {
					self.fetchData();
				});
			},

			showHeroEquip : function(heroModel) {
				this.equipTable.resetFilter();
				this.equipTable.setFilter('', 'hero_id', heroModel.get('id'));
			},

			addToReward : function() {
				utils.addToReward(this.model);
			},

			addToBroadcast : function() {
				utils.addToBroadcast(this.model);
			},

		});

		return PlayerView;
	}
);