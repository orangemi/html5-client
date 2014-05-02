define(['marionette', 'underscore', 'text!ui/frame.html'], function (Marionette, _, FrameHtml) {
	var FrameView = Marionette.View.extend({
		template : _.template(FrameHtml)
	});

	return FrameView;
});