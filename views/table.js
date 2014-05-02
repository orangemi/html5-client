define(['backbone', 'underscore', 'jquery', 'views/table-row', 'views/menu', 'views/checkMenu'],
	function (Backbone, _, $, RowView, MenuView, CheckMenuItemView) {

	var TableView = Backbone.View.extend({

		tagName: 'table',
		className: 'table',
		template : _.template(''),
		events : {
			'click button.next-page' : 'nextPage',
			'click button.prev-page' : 'prevPage',
			'click button.cls-filter' : 'onClearFilterClick',
//			'click th' : 'showColumnMenu',
		},

		//------------------------

		columns: [],
		captionName: '',

		filters : null,
		sort : null,
		page : 1,

		initialize : function(collection, options) {
	
			options = options || {};
			this.filters = [];
			this.sort = null;
			this.page = 1;
			this.captionName = options.caption || this.captionName;
			this.columns = new Backbone.Collection();

			//this.listenTo(this.collection, 'change', this.renderRow);
			this.listenTo(this.collection, 'sync', this.endLoading);
			this.listenTo(this.collection, 'add', this.addRow);
			this.listenTo(this.collection, 'request', this.startLoading);
			this.listenTo(this.columns, 'change', this.onColumnChange);
		},

		changeData : function(evt) {
			var $input = $(evt.currentTarget);
			$input.addClass('changed');
		},

		startLoading : function() {
			//console.log('my table loading is ' + this.$loading);
			if (this.$loading) this.$loading.removeClass('hide');

		},
		endLoading : function() {
			if (this.$loading) this.$loading.addClass('hide');
		},

		addColumns : function(columns) {
			var self = this;
			if (columns instanceof Backbone.Collection) columns = columns.models;
			this.columns.add(columns);
		},

		onColumnChange : function(column) {
			//column.set('hide', !column.get('hide'));
			var index = this.columns.indexOf(column);
			var $th = this.$thead.children('th:eq(' + index + ')');
			if (column.get('hide')) $th.hide();
			else $th.show();
			$th.find('.title').html();
		},

		hideColumn : function(column) {
			var $th = $(evt.currentTarget).parent();
			var index = $th.index();
			var column = this.columns.at(index);
			column.set('hide', !column.get('hide'));
			//this.toggleColumnShow(column);
		},

		render : function() {
			var self = this;
			var collection = this.collection;
			var $el = this.$el.empty();
			var $loading = this.$loading = $('<div>').addClass('hide loading').appendTo($el);
			var $caption = this.$caption = $('<caption>').appendTo($el);
			var $tbody = this.$tbody = $('<tbody>').appendTo($el);

			//header
			this.renderCaption();
			this.renderColumns();
			return this;
		},

		renderCaption : function() {
			var $caption = this.$caption;
			var self = this;

			$caption.empty();

			var $prevPage = $('<button>').addClass('prev-page').html('<').appendTo($caption);
			var $nextPage = $('<button>').addClass('next-page').html('>').appendTo($caption);
			var $clearFilter = $('<button>').addClass('cls-filter').html('cls').appendTo($caption).hide();
			var $currentPage = $('<span>').addClass('current-page').html(this.page).appendTo($caption);

			if (this.filters.length) $clearFilter.show();
		},

		renderColumns : function() {
			var self = this;
			var columns = this.columns;

			$row = this.$thead = $("<tr>").addClass('head').appendTo(this.$tbody);

			columns.forEach(function(column) {
				var showName = column.get('showName') || column.get('name');
				if (!column.get('showName')) {
					column.set('showName', showName);
				}

				var menuView = new MenuView({title: showName});
				menuView.addMenu([
					{name: 'sort_ascending'},
					{name: 'sort_descending'},
					{name: 'filter', type: 'sub', child:[
						{name: 'clearFilter', display: 'clear'},
						{name: 'equalFilter', display: 'equal to :', type: 'input'},
						{name: 'likeFilter', display: 'like to :', type: 'input'},
					]}
				]);
				
				menuView.on('itemClick', function(model) {
					if (model.get('name') == 'clearFilter') {
						console.log('should clear table filter');
						self.clearFilter(column.get('name'));
					};
				});

				menuView.on('itemChange', function(model, options) {
					options = options || {};
					var name, value, prefix;
					var filter = model.get('name');
					name = column.get('name');
					value = options.value;
					switch (filter) {
						case 'equalFilter' : prefix = ''; break;
						case 'likeFilter' : prefix = 'like'; break;
					}
					console.log('should add table filter for: ' + prefix + '!' + name + '=' + value + '"');
					self.setFilter(prefix, name, value);
				});

				var $th = $('<th>').html(menuView.render().$el).appendTo($row);
				if (column.get('hide')) $th.hide(); else $th.show();

			});

			var menuView = new MenuView({
				templateHTML : "<%= name %>",
			});
			columns.forEach(function(column) {
				menuView.addMenu({ id:column.cid, type:"check", name:column.get('showName'), checked: !column.get('hide') });
			});
			menuView.on('itemCheck', function(menuItem) {
				var column = columns.get(menuItem.id);
				column.set('hide', !column.get('hide'));
			});

			$('<th>').appendTo($row).html(menuView.render().$el);
		},

		nextPage : function() {
			this.page++;
			this.collection.fetch({filters: this.filters, page: this.page, sort: this.sort });
			this.renderCaption();
		},

		prevPage : function() {
			if (this.page > 1) this.page--;
			this.collection.fetch({filters: this.filters, page: this.page, sort: this.sort });
			this.renderCaption();
		},

		addRow : function(model) {
			if (!this.$tbody) return;
			var row = new RowView({model:model, columns : this.columns, table : this});
			this.listenTo(row, 'buttonClick', this.buttonClick);
			this.$tbody.append(row.render().$el);
		},

		buttonClick : function(name, model) {
			this.trigger('buttonClick', name, model);
			this.trigger('buttonClick:' + name, model);
		},

		sort : function(column, ascending) {

		},

		onClearFilterClick : function() {
			this.clearFilter();
		},
		clearFilter : function(column) {
			if (column) {
				this.setFilter([{column: column}], {clear: true});
			} else {
				this.resetFilter();
			}
			this.page = 1;
			this.collection.fetch({filters: this.filters, page: this.page, sort: this.sort });
			this.renderCaption();			
		},

		resetFilter : function(prefix, column) {
			this.filters = [];
		},

		setFilter : function(prefix, column, value, options) {
			var filters = prefix;
			if (typeof(filters) == 'string') filters = [{prefix:prefix, column: column, value:value}];
			else options = column;

			options = options || {};
			
			for (var i = 0; i < filters.length; i++) {
				var filter = filters[i];
				for (var j = this.filters.length; j--; ) {
					if (this.filters[j].column == filter.column)// && this.filters[j].prefix == filter.prefix)
						this.filters.splice(j, 1);
				}
				if (!options.clear) this.filters.push(filter);
			}

			this.page = 1;
			this.collection.fetch({filters: this.filters, page: this.page, sort: this.sort });
			this.renderCaption();
		}
	});

	return TableView;
});