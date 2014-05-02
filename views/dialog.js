define(
	['backbone', 'underscore', 'jquery', 'text!views/dialog.html'],
	function (Backbone, _, $, DialogHtml) {

		var Dialog = Backbone.View.extend({
			className : 'dialog confirm-dialog',
			template : _.template(DialogHtml),

			data : null,

			events : {
				'click button.confirm' : 'confirm',
				'click button.cancel' : 'cancel'
			},

			initialize : function(options) {
				var data = this.data = options.data || {};
				data.title = data.title || 'SYSTEM';
				data.content = data.content || '';
				data.confirm = data.confirm || 'CONFIRM';
				data.cancel = data.cancel || 'CANCEL';
				this.hideConfirm = options.hideConfirm || false;
				this.hideCancel = options.hideCancel || false;
			},

			close : function() {
				var self = this;
				this.$dialog.hide(300);
				setTimeout(function() {
					self.remove();
				}, 300);
				this.trigger('close');
				//this.remove();
			},

			show : function() {
				this.$dialog.show(300);
			},

			confirm : function() {
				this.trigger('confirm');
				this.close();
			},

			cancel : function() {
				this.trigger('cancel');
				this.close();
			},

			render : function() {
				this.$el.empty().html(this.template(this.data));

				var $dialog = this.$dialog = $(this.$el.find('.dialog')[0]).hide();
				if (this.hideCancel) $dialog.find('.footer button.cancel').hide();

				return this;
			}
		});
	return Dialog;

});