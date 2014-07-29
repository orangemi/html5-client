define([
'backbone', 'marionette', 'underscore', 'app/app', 'text!app/views/HeroList.html', 'app/views/HeroItem', 'app/views/table/Table'],
function (Backbone, Marionette, _, app, Html, HeroItemView, TableView) {
	var View = Marionette.Layout.extend({
		tagName : 'box',
		className : 'heroList',
		template : _.template(''),

		itemTableView : null,

		initialize : function() {
			var itemTableView = this.itemTableView = new TableView({
				caption: 'Caption',
				columns: [
					{ name : "id" },
					{ name : "name", type : "input" },
					{ name : "name", type : "input", hide : true },
					{ name : "xx", type : "button", title : "action" },
				]
			}).render();
		},

		onRender : function() {
			this.itemTableView.$el.appendTo(this.$el);
			for (var i = 0; i < 100; i++) {
				var item = new Backbone.Model({ id: i+1, name: 'sample item' + i });
				this.itemTableView.data.add(item);
			}
		}
	});
	return View;
});
