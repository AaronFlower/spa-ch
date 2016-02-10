/**
 * spa.chat.js
 * Chat feature module for SPA
 */

/*global $, spa */

spa.chat = (function () {
	//----------- Begin Module Scope Variables -----------
	var 
		configMap = {
			main_html	: String() 
							+ '<div style="padding:1em; color:#fff;">'
							+ 	'Say Hello to chat!'
							+ '</div>',
			settable_map: {}
		},
		stateMap 	= { $container: null },
		jqueryMap 	= {},

		setJqueryMap, configModule, initModule ;
	//----------- End   Module Scope Variables -----------

	//----------- Begin Utility Methods ------------------- 
	//----------- End   Utility Methods -------------------	

	//----------- Begin DOM Methods ------------------- 
	setJqueryMap = function() {
		var $container = stateMap.$container;
		jqueryMap = { $container : $container };
	};
	//----------- End   DOM Methods -------------------	

	//----------- Begin Event Methods ------------------- 
	//----------- End   Event Methods -------------------	

	//----------- Begin Public Methods ------------------- 
	configModule = function( input_map ) {
		spa.util.setConfigModule( {
			input_map: input_map,
			settable_map: configModule.settable_map, 
			config_map: configMap 
		});
		return true;
	};

	initModule = function( $container ) {
		$container.html( configMap.main_html );
		stateMap.$container = $container;
		setJqueryMap();

		return true;
	};
	// Return public methods
	return {
		configModule : configModule,
		initModule: initModule
	};
	//----------- End   Public Methods ------------------- 
})(); 