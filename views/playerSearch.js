define([
	'backbone',
	'underscore',
	'text!views/playerSearch.html',
	'views/table',
	'models/models'
	], function (Backbone, _, HomeHtml, Table, models) {

	var HomeView = Backbone.View.extend({
		template : _.template(HomeHtml),
		events : {
			"click button.search" : "searchSubmit",
			"click button.reset" : "searchReset"
		},

		players: null,

		initialize: function () {

			this.players = new models.PlayerCollection();
			var table = this.playersTable = new Table({collection : this.players});
			table.addColumns([
				{ name : 'id' },
				{ name : 'nickname' },
				{ name : 'cashmoney' },
				{ name : 'grade' },
				{ name : 'status' },
				{ name : 'm_uid' },
				{ name : 'more',	type: 'buttons', menus: [
					{ name : 'detail' },
					{ name : 'user_detail' }
				]}
			]);

			this.listenTo(table, 'buttonClick:detail', this.openPlayer);
			this.listenTo(table, 'buttonClick:user_detail', this.openUser);
		},

		render : function() {

			this.$el.html(this.template({}));
			this.$el.append(this.playersTable.render().$el);
			this.$inputs = this.$el.find('>.search [data-prefix]');
			return this;

		},

		searchSubmit : function(evt) {
			var filter = [];
			this.$inputs.each(function(i, html) {
				var $input = $(html);
				var column = $input.attr('data-col');
				var prefix = $input.attr('data-prefix');
				var value = $input.val();
				filter.push({column : column, prefix: prefix, value : value});
			});
			this.playersTable.setFilter(filter);
		},

		searchReset : function(evt) {
			this.$inputs.each(function(i, html) {
				$(html).val('');
			});
		},

		openPlayer : function(model) {
			location.href = '#player/' + model.id;
		},
		openUser : function(model) {
			location.href = '#user/' + model.get('m_uid');
		}
	});
	return HomeView;
});