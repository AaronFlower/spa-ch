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
						+ '</div>',
			chat_extend_time 	: 1000,
			chat_retract_time	: 3000,
			chat_extend_height 	: 450,
			chat_retract_height : 15
		},
		//下面的变量多是在后面进行赋值。
		stateMap = { $container : null }, // 将在整个模块中共享的动态信息放在stateMap变量中。
		jqueryMap = { }, // 将jQuery集合缓存在jqueryMap中。

		setJqueryMap, toggleChat, initModule;
	// ------- End 	 Module Scope Variables

	// --------- Begin Utility Methods--------- 
	// --------- End   Utility Methods--------- 
	// 将聊天滑块的jQuery集合缓存到 jqueryMap中。
	setJqueryMap = function ( ) {
		var $container = stateMap.$container;
		jqueryMap = { 
			$container 	: $container ,
			$chat 		: $container.find( '.spa-shell-chat' )
		};
	};

	// Begin DOM Method / toggleChat /
	// Purpose 	: Extends or retracts chat slider
	// Arguments:
	// 		* do_extend - if true, extends slider; if false retracts
	// 		* callback 	- optional function to execute at end of animation
	// Settings:
	// 		* chat_extend_time, chat_retract_time,
	// 		* chat_extend_height, chat_retract_height
	// 	Returns:
	// 		* true - slider animation activated
	// 		* false - slider animation not activated
	toggleChat = function ( do_extend, callback ) {
		var 
			px_chat_ht = jqueryMap.$chat.height(),
			is_open 	= px_chat_ht === configMap.chat_extend_height,
			is_closed 	= px_chat_ht === configMap.chat_retract_height,
			is_sliding  = ! is_open && ! is_closed ;

		// avoid race condition
		if( is_sliding ) { return false; } 

		// Begin extend chat slider 
		if( do_extend ){
			jqueryMap.$chat.animate( 
				{ height : configMap.chat_extend_height },
				configMap.chat_extend_time ,
				function ( ) {
					if( callback ){
						callback( jqueryMap.$chat );
					}
				}
			);
			return true;
		}
		// End extend chat slider
		
		// Begin retract chat slider 
		jqueryMap.$chat.animate(
			{ height : configMap.chat_retract_height },
			configMap.chat_retract_time,
			function ( ) {
				if( callback ){
					callback( jqueryMap.$chat );
				}
			}
		);
		return true;
		// End retract chat slider

	};


	initModule = function ( $container ) {
		stateMap.$container = $container;
		$container.html( configMap.main_html );	
		setJqueryMap();
		// test toggle
		setTimeout( function ( ) {
			toggleChat( true );
		}, 3000 );
		setTimeout( function ( ) {
			toggleChat( false );
		}, 8000 );
	};

	return {
		initModule : initModule
	};

})(); 