define([
	'marionette', 'underscore', 'app/app', 'text!app/views/city.html'],
	function (Marionette, _, app, Html) {
		var View = Marionette.Layout.extend({
			template : _.template(Html),

			events : {
				"click >button" : "onButtonClick"
			},

			onButtonClick : function(evt) {
				//debugger;
				app.showDialog();
			}
		});
		return View;
});