define([
'marionette', 'underscore', 'app/app', 'text!app/views/Dialog.html'],
function (Marionette, _, app, Html) {
	var View = Marionette.Layout.extend({
		className : 'dialog',
		template : _.template(Html),

		events : {
			'click >.top>.close' : 'onCloseButtonClick'
		},

		onCloseButtonClick : function(evt) {
			this.close();
		}
	});
	return View;
});