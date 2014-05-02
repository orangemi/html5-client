define(['backbone', 'underscore', 'jquery'], function (Backbone, _, $) {
	var NavbarView = Backbone.View.extend({
		tagName: 'ul',
		className: 'navbar',

		list: [],
		initialize : function() {
			this.$el.html('');
		},
		render : function() {
			var $el = this.$el.html('');
			var length = this.list.length;
			this.list.forEach(function(item) {
				var li = $("<li>").addClass('nav').append('<a href="' + item.url + '">' + item.name + '</a>');
				li.css('width', (100 / length) + '%');
				$el.append(li);
			});
			return this;
		},
		addButton : function(name, url) {
			this.list.push({name:name, url:url});
			this.render();
		}
	});
	return NavbarView;
});