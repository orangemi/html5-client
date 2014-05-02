define([
'marionette', 'underscore', 'app/app', 'text!app/views/heroList.html', 'app/views/heroItem'],
function (Marionette, _, app, Html, HeroItemView) {
	var View = Marionette.Layout.extend({
		tagName : 'box',
		className : 'heroList',
		template : _.template(''),

		onRender : function() {
			console.log(app);
			debugger;
		}
	});
	return View;
});
