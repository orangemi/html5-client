define([
	'backbone',
	'underscore',
	'text!views/userSearch.html',
	'views/table',
	'models/models',
	'utils/utils'
	], function (Backbone, _, Html, Table, models, utils) {

	var UserSearchView = Backbone.View.extend({
		template : _.template(Html),
		events : {
			"click button.search" : "searchSubmit",
			"click button.reset" : "searchReset"
		},

		users: null,

		initialize: function () {

			this.users = new models.UserCollection();
			var table = this.usersTable = new Table({collection : this.users});
			table.addColumns([
				{ name : 'id' },
				{ name : 'username' },
				{ name : 'password' },
				{ name : 'status' },
				{ name : 'regtime', render : function(column, cell, model) {
					if (!model.get(column.name)) return cell;
					cell.html(utils.dateFormat(model.get(column.name) * 1000));
					return cell;
				}},
				{ name : 'logintime', render : function(column, cell, model) {
					if (!model.get(column.name)) return cell;
					cell.html(utils.dateFormat(model.get(column.name) * 1000));
					return cell;
				}},
				{ name : 'player_id' },
				{ name : 'more',	type: 'buttons', menus: [
					{ name : 'searchPlayer' }
				]}
			]);

			this.listenTo(table, 'buttonClick:searchPlayer', this.searchPlayer);
		},

		render : function() {

			this.$el.html(this.template({}));
			this.$el.append(this.usersTable.render().$el);
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
			this.usersTable.setFilter(filter);
		},

		searchReset : function(evt) {
			this.$inputs.each(function(i, html) {
				$(html).val('');
			});
		},

		searchPlayer : function(model) {
			utils.searchPlayerByUserId(model.id);
			//location.href = '#playerSearch/' + model.get('player_id');
		}
	});
	return UserSearchView;
});