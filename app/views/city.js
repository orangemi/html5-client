define([
'marionette', 'underscore', 'app/app', 'text!app/views/city.html', 'app/views/menu'],
function (Marionette, _, app, Html, MenuView) {
	var View = Marionette.Layout.extend({
		tagName : 'box',
		className : 'city',
		template : _.template(Html),

		events : {
			'click >button' : 'onButtonClick',
			'click >button.hero' : 'onHeroButtonClick',
		},

		initialize : function() {
		},

		onHeroButtonClick : function() {
			app.router.navigate('heroes');
		},

		onButtonClick : function(evt) {
			// //debugger;
			// //app.showDialog();
			// var menuView = new MenuView({ menus:[
			// 	'123', 'abc', '', '123', 'abc', ''
			// ]});

			// menuView.on('buttonClick', function() {
			// 	app.showDialog();
			// });

			// app.showMenu(menuView, evt.clientX, evt.clientY);
		}
	});
	return View;
});