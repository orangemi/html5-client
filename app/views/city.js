define([
'marionette', 'underscore', 'app/app', 'text!app/views/City.html', 'app/views/menu/Menu', 'app/views/tab/Tab'],
function (Marionette, _, app, Html, MenuView, TabView) {
	var View = Marionette.Layout.extend({
		tagName : 'box',
		className : 'city',
		template : _.template(Html),

		events : {
			'click >button.hero' : 'onHeroButtonClick',
			'click >button.info' : 'onInfoButtonClick',
			'click >button.item' : 'onItemButtonClick',
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
				{ type:'input', text:'1-2:' },
				{ type:'menu', text:'1-3 >>>', menus : [
					'1-3-1',
					{ type:'input', text: '1-3-2:' },
					{ type:'check', text: '1-3-2:' },
					{ type:'menu', text:'>>', menus : [
						'234',
						'834',
						'434',
						'234',
					]}
				]},
				{ type:'menu', text:'>>>', menus : [
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