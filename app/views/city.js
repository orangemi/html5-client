define([
'marionette', 'underscore', 'app/app', 'text!app/views/City.html', 'app/views/menu/Menu', 'app/views/tab/Tab'],
function (Marionette, _, app, Html, MenuView, TabView) {
	var View = Marionette.Layout.extend({
		tagName : 'box',
		className : 'city',
		template : _.template(Html),

		events : {
			'click >.buttons>button.hero' : 'onHeroButtonClick',
			'click >.buttons>button.info' : 'onInfoButtonClick',
			'click >.buttons>button.item' : 'onItemButtonClick',
		},

		initialize : function() {
		},

		onHeroButtonClick : function() {
			app.router.navigate('heroes', { trigger: true });
		},

		onItemButtonClick : function() {
			var tabView = new TabView({ tabs : [
				{ name : 'text1', view : new View() },
				{ name : 'text2', view : new View() },
			]});

			tabView.render().$el.appendTo(this.$el);
		},

		onInfoButtonClick : function(evt) {

			var menuView = new MenuView({ menus:[
				'1-1',
				{ type:'input', text:'1-2:', disabled: true },
				{ type:'divider', text:'' },
				{ type:'menu', text:'1-3 >>>', menus : [
					'1-3-1',
					{ type:'input', text: '1-3-2:' },
					{ type:'check', text: '1-3-3' },
					{ type:'menu', text:'1-3-4 >>', menus : [
						'234',
						'834',
						'434',
						'234',
					]}
				]},
				{ type:'button', text:'1-2:', disabled: true },
				{ type:'menu', text:'1-4 >>>', menus : [
					'200',
					{ type:'input', text: 'dd:' },
					{ type:'menu', text:'>>', menus : [
						'234',
						'234',
						'234',
						'234',
					]}
				]}
			]});

			menuView.on('menu:ButtonClick', function() {
				console.log('menu clicked');
				//app.showDialog();
			});
			menuView.show();
			menuView.setPosition(evt.clientX, evt.clientY);

			//app.showMenu(menuView, evt.clientX, evt.clientY);
		}
	});
	return View;
});