define(['backbone', 'underscore', 'jquery', 'views/menu', 'views/select'],
	function (Backbone, _, $, MenuView, SelectView) {
	var RowView = Backbone.View.extend({

		tagName: 'tr',

		events : {
			'click td.edit' : 'edit',
			'click td.select' : 'selectCell',
			'blur td.edit>input.edit' : 'editDone'
		},

		columns : [],
		table : null,

		initialize : function(options) {
			options = options || {};
			this.columns = options.columns || new Backbone.Collection();
			this.table = options.table || null;

			this.listenTo(this.model, 'sync', this.render);
			this.listenTo(this.model, 'remove', this.remove);
			this.listenTo(this.columns, 'change', this.toggleColumn);
		},

		render : function() {
			var $el = this.$el.empty();
			var model = this.model;
			var self = this;
			this.columns.forEach(function(column) {
				//if (typeof(column.hidden) === "undefined") { column.hidden = false; return;}
				var cell = self.renderCell(column);
				$el.append(cell);
			});

			return this;
		},

		toggleColumn : function(column) {
			var index = this.columns.indexOf(column);
			var $td = this.$el.children(':eq(' + index + ')')
			if (column.get('hide')) $td.hide();
			else $td.show();

		},

		renderCell : function(column) {
			var cell = $('<td>');
			if (column.get('type') == 'edit') cell = this.renderEdit(column, cell);
			else if (column.get('type') == 'buttons') cell = this.renderButton(column, cell);
			else if (column.get('type') == 'select') cell = this.renderSelect(column, cell);
			else cell = this.renderDefault(column, cell);
			
			if (typeof(column.get('render')) == 'function') {
				cell = column.get('render')(column, cell, this.model);
			}
			if (column.get('hide')) cell.hide();

			return cell;
		},

		renderDefault : function(column, cell) {
			var model = this.model;
			var value = model.get(column.get('name')) || '';
			cell.html(value);
			return cell;
		},

		renderEdit : function(column, cell) {
			var model = this.model;
			var value = model.get(column.get('name')) || '';
			cell.addClass('edit').append(value);
			return cell;
		},

		renderButton : function(column, cell) {
			//cell.addClass('button').append(column.name);
			var menu = new MenuView({collection: new Backbone.Collection(column.get('menus')), title: 'more'});
			this.listenTo(menu, 'itemClick', this.buttonClick);
			var $menu = menu.render().$el.appendTo(cell);
			$menu.find('>.title').addClass('button');
			$menu.find('>.list>div').addClass('button');
			return cell;
		},

		renderSelect : function(column, cell) {
			var value = this.model.get(column.get('name')) || '';
			var model = column.get('collection').get(value);
			if (model) cell.addClass('select').html(_.template(column.get('templateHTML'), model.toJSON()));
			else this.renderDefault(column, cell);//cell.click(function() )
			return cell;
		},

		selectCell: function(evt) {
			var $cell = $(evt.target);
			$cell.removeClass('select');
			var column = this.columns.at($cell.index());
			//var collection = new Backbone.Collection(column.get('collection').filter(function() { return true; }));
			var self = this;

			var select = new SelectView({
				//id: column.get('name'),
				collection: column.get('collection'),
				//collection: collection,
				templateHTML: column.get('templateHTML'),
				defaultJSON: column.get('defaultJSON'),
				current_id : this.model.get(column.get('name')),
				widthSearch : true,
			});
			select.on('itemClick', function(model) {
				self.model.set(column.get('name'), model.id);
				$cell.addClass('changed');
			});

			$cell.html(select.render().$el);
		},

		buttonClick : function(model) {
			var name = model.get('name');
			this.trigger('buttonClick', name, this.model);
			this.trigger('buttonClick:' + name, this.model);
		},

		edit : function(evt) {
			var cell = $(evt.target);
			var value = cell.html();
			$('<input>').addClass('edit').val(value).appendTo(cell.empty()).focus();
		},

		editDone : function(evt) {
			var $input = $(evt.target);
			var $cell = $input.parent();
			var value = $input.val();
			$cell.html(value).addClass('changed');

			//save to model
			var column = this.columns.at($cell.index());
			this.model.set(column.get('name'), value);
		}

	});

	return RowView;
});