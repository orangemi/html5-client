define([
	'backbone',
	'underscore',
	'jquery',
	'text!views/gift.html',
	'models/gift',
	'views/menu',
	'views/select',
	'utils/utils'
	], function (Backbone, _, $, GiftHtml, GiftModels, MenuView, SelectView, utils) {
		var GiftView = Backbone.View.extend({

			className : 'gift',
			template :_.template(GiftHtml),
			children : null,
			isLotteryItem : false,
			isRoot : false,
			events : {
				'click >.header>.buttons button.remove' : 'removeGift',
				'click >.header>.buttons button.loadcsv' : 'loadFromFile',
				'change >.upload' : 'onFileLoad',
				'click >[type-col]>.edit' : 'infoEdit',
				'blur >[type-col]>.edit>input' : 'infoEditDone'
			},

			initialize : function(options) {
				options = options || {};
				this.isRoot = options.root || false;
				this.isLotteryItem = options.isLotteryItem || false;

				this.children = [];

				var type = options.type || 'gift';
				if (!this.model) this.model = new GiftModels[type]();
				if (this.isLotteryItem) { this.model.set('rate', 0); }

				this.listenTo(this.model, 'change', this.renderInfo);
			},

			render : function() {
				var type = this.model.get('type');
				this.$el.html(this.template({}));

				var $file = this.$file = this.$el.find('>.upload');
				var $title = this.$title = this.$el.find('>.header>.title').html(type);
				var $buttons = this.$buttons = this.$el.find('>.header>.buttons');

				var $rateinfo = this.$rateinfo = this.$el.find('>.rateinfo');
				var $children = this.$children = this.$el.find('>.children');

				this.renderInfo();
				return this;
			},

			renderInfo : function() {
				var model = this.model;
				var type = this.model.get('type');
				if (type == 'gift') { this.renderGiftButton(); }
				else if (type == 'lottery') { this.renderLotteryButton(); }
				else {
					var $child = this.$el.find('>[type-col=' + type + ']').show();
					var $typeid = $child.find('>.' + type + '_id');
					//.html(select.render().$el);
					if ($typeid.length == 1) {
						var select = new SelectView({
							current_id: model.id,
							collection: model.constructor.collection,
							templateHTML: model.constructor.collection.templateHTML,
							defaultJSON: model.constructor.collection.defaultJSON,
							widthSearch : true,
						});
						$typeid.html(select.render().$el);
						this.listenTo(select, 'itemClick', this.typeSelect);
					}

					$child.find('>[data-col]').each(function (i, html) {
						var $edit = $(html);
						var column = $(html).attr('data-col');
						$edit.html(model.get(column));
					});
				}

				if (this.isLotteryItem) { this.renderRateInfo(); }
			},

			renderRateInfo : function() {
				model = this.model;
				this.$rateinfo.show();
				this.$rateinfo.find('.rate').html(model.get('rate'));
			},

			typeSelect : function(model) {
				var type = this.model.get('type');
				this.model.set('id', model.id, {silent: true});
			},

			renderGiftButton : function() {
				var self = this;
				this.$buttons.find('.loadcsv').show();
				var menuNames = [];
				for(var key in GiftModels) {
					if (key == 'base') continue;
					menuNames.push({name: key});
				}

				var menuView = new MenuView({collection:new Backbone.Collection(menuNames), title: '+'});
				menuView.on('itemClick', function (model) {
					self.addChild(model.get('name'));
				});
				menuView.render().$el.appendTo($('<li>').appendTo(this.$buttons));
				return this;
			},

			renderLotteryButton : function() {
				var self = this;
				this.$buttons.find('.loadcsv').show();
				var menuNames = [];
				for(var key in GiftModels) {
					if (key == 'base') continue;
					menuNames.push({name: key});
				}

				var menuView = new MenuView({collection:new Backbone.Collection(menuNames), title: '+'});
				menuView.on('itemClick', function (model) {
					self.addChild(model.get('name'));
				});
				menuView.render().$el.appendTo($('<li>').appendTo(this.$buttons));
				return this;
			},

			infoEdit : function(evt) {
				var cell = $(evt.target);
				var value = cell.html();
				$('<input>').val(value).appendTo(cell.empty()).select().focus();
			},

			infoEditDone : function(evt) {
				var input = $(evt.target);
				var cell = input.parent();
				var value = input.val();
				cell.html(value);

				//save to model
				var column = cell.attr('data-col');
				this.model.set(column, value);
			},

			removeGift : function() {
				if (this.isRoot) return;
				this.trigger('remove');
				this.remove();
			},

			addChild : function(type) {
				console.log(type);
				var view;
				var self = this;
				var model = null;

				var options = {type:type};
				if (this.model.get('type') == 'lottery') options.isLotteryItem = true;
				view = new GiftView(options);
				view.render().$el.appendTo(this.$children);
				this.listenTo(view, 'remove', function() {
					self.removeChild(view);
				});
				this.children.push(view);
			},

			loadFromFile : function() {
				this.$file.click();
			},

			onFileLoad : function() {
				var self = this;
				var fileReader = new FileReader();
				var file = this.$file[0].files[0];
				fileReader.onload = function() {
					console.log('file "' + file.name + '" loaded .');
					self.readCsv(file, this.result);
				};
				fileReader.onerror = function() {
					console.error('could not read file');
				};
				fileReader.readAsText(file);
			},

			readCsv : function(file, content) {
				console.error('error read csv file(method not complete)');
				//console.log(content);
			},

			removeChild : function(view) {
				var children = this.children;
				for (var i = children.length; i--; ) {
					if (children[i] == view) children.splice(i, 1);
				}
			},

			getJSON : function() {
				var result = this.model.toJSON();
				result.children = [];
				//result.type = params.type;
				//delete params.type;
				this.children.forEach(function(view) {
					result.children.push(view.getJSON());
				});
				return result;
			}
		});
		return GiftView;
	}
);