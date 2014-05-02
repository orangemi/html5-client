define([
	'marionette', 'underscore', 'app/app', 'text!app/views/city.html', 'app/views/menu'],
	function (Marionette, _, app, Html, MenuView) {
		var View = Marionette.Layout.extend({
			template : _.template(Html),

			events : {
				'click >button' : 'onButtonClick',
			},

			initialize : function() {
				var menuView = this.menuView = new MenuView({ menus:[
					'123', 'abc', '', '123', 'abc', ''
				]});

				menuView.on('buttonClick', function() {
					app.showDialog();
				});
			},

			onButtonClick : function(evt) {
				//debugger;
				//app.showDialog();
				app.showMenu(this.menuView, evt.clientX, evt.clientY);
			}
		});
		return View;
});