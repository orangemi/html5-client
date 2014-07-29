define(['app/views/menu/MenuList', 'app/views/menu/ButtonMenu', 'app/views/menu/InputMenu', 'app/views/menu/SubMenu', 'app/views/menu/CheckMenu'],
function (MenuListView, ButtonMenuView, InputMenuView, SubMenuView, CheckMenuView) {
	var MenuView = MenuListView;
	MenuView.menuMap = {
		button		: ButtonMenuView,
		input		: InputMenuView,
		menu		: SubMenuView,
		check		: CheckMenuView,
	};
	return MenuView;
});