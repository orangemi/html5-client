define([
	'backbone',
	'underscore',
	'text!views/playerSearch.html',
	'views/table',
	'models/models'
	], function (Backbone, _, HomeHtml, Table, models) {

	var HomeView = Backbone.View.extend({
		events : {
			"click button.search" : "searchSubmit",
			"click button.reset" : "searchReset"
		},

		players: null,

		initialize: function () {

			this.players = new Backbone.Collection();
			
			//test
			var table = this.playersTable = new Table({collection : this.players});
			table.addColumns([
				{ name : 'id' },
				{ name : 'nick' },
				{ name : 'more', type: 'buttons', menus: [
					{ name : 'detail' },
					{ name : 'delete' }
				]}
			]);

			this.listenTo(table, 'buttonClick:detail', this.openPlayer);
			this.listenTo(table, 'buttonClick:delete', this.deletePlayer);
		},

		render : function() {

			this.$el.empty();
			this.$el.append(this.playersTable.render().$el);
			return this;

		},

		searchSubmit : function(evt) {
			console.log('need a filter, comming soon...');
		},

		searchReset : function(evt) {

		},

		addPlayer : function(player) {
			this.players.add(new Backbone.Model({
				id: player.id,
				nick: player.get('nick')
			}));
		},

		deletePlayer : function(player) {
			this.players.remove(player);
		},

		openPlayer : function(player) {
			location.href = '#player/' + player.id;
		}
	});
	return HomeView;
});