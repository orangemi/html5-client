define(['backbone', 'underscore', 'jquery', 'text!views/slider.html'], function (Backbone, _, $, SliderHtml) {
	var SliderView = Backbone.View.extend({
		pos : 0,
		className : 'slider',
		tempalte : _.template(SliderHtml),

		events : {
			'mousedown' : 'startDrag',
		},

		initialize : function(options) {
			options = options || {};
			this.pos = options.pos || 0;
		},

		getPos : function() {
			return this.pos;
		},

		render : function() {
			this.$el.html(this.tempalte({}));
			this.$shuttle = this.$el.find('.shuttle');
			this.renderShuttle();
			return this;
		},

		renderShuttle : function() {
			this.$shuttle.css({left : (this.pos * 100) + '%'});
		},

		draging : function(evt) {
			if (!this._drag) return;

			var width = this.$el.width();
			var offset = evt.pageX - this.$el.offset().left;

			this.pos = offset / width;
			if (this.pos < 0) this.pos = 0;
			else if (this.pos > 1) this.pos = 1;

			this.renderShuttle();
			this.trigger('draging', evt);
		},

		startDrag : function(evt) {
			var self = this;
			this._drag = true;

			var draging = function(evt) {
				self.draging(evt);
			};
			var stopDrag = function(evt) {
				self.stopDrag(evt);
				$(document).unbind('mousemove.slider', draging);
				$(document).unbind('mouseup.slider', stopDrag);				
			}

			$(document).bind('mousemove.slider', draging);
			$(document).bind('mouseup.slider', stopDrag);

			this.draging(evt);
			this.trigger('startdrag', evt);
		},

		stopDrag : function(evt) {
			this._drag = false;
			this.trigger('stopdrag', evt);
		}
	});
	return SliderView;
});