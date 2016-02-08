/**
 * spa.shell.js
 * Shell Module for SPA
 */

/* global $, spa */

spa.shell = (function () {
	// ------- Begin Module Scope Variables
	var 
		configMap = {
			main_html : String() 
						+ '<div id="spa">'
						+ '	<div class="spa-shell-head">'
						+ '		<div class="spa-shell-head-logo"></div>'
						+ '		<div class="spa-shell-head-acct"></div>'
						+ '		<div class="spa-shell-head-search"></div>'
						+ '	</div>'
						+ '	<div class="spa-shell-main">'
						+ '		<div class="spa-shell-main-nav"></div>'
						+ '		<div class="spa-shell-main-content"></div>'
						+ '	</div>'
						+ '	<div class="spa-shell-foot"></div>'
						+ '	<div class="spa-shell-chat"></div>'
						+ '	<div class="spa-shell-modal"></div>'
						+ '</div>'
		},
		//下面的变量多是在后面进行赋值。
		stateMap = { $container : null }, // 将在整个模块中共享的动态信息放在stateMap变量中。
		jqueryMap = { }, // 将jQuery集合缓存在jqueryMap中。

		setJqueryMap, initModule;
	// ------- End 	 Module Scope Variables

	// --------- Begin Utility Methods--------- 
	// --------- End   Utility Methods--------- 

	setJqueryMap = function ( ) {
		var $container = stateMap.$container;
		jqueryMap = { $container : $container };
	};

	initModule = function ( $container ) {
		stateMap.$container = $container;
		$container.html( configMap.main_html );	
		setJqueryMap();
	};

	return {
		initModule : initModule
	};

})(); 