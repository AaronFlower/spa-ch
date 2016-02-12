/**
 * spa.chat.js
 * Chat feature module for SPA
 */

/*global $, spa, getComputeStyle */

spa.chat = (function () {
	//----------- Begin Module Scope Variables -----------
	var 
		configMap = {
			main_html	: String() 
							+ '<div class="spa-chat">'
							+ '	<div class="spa-chat-head">'
							+ '		<div class="spa-chat-head-toggle">+</div>'
							+ '		<div class="spa-chat-head-title">Chat</div>'
							+ '	</div>'
							+ '	<div class="spa-chat-closer">X</div>'
							+ '	<div class="spa-chat-sizer">'
							+ '		<div class="spa-chat-msgs"></div>'
							+ '		<div class="spa-chat-box">'
							+ '			<input type="text">'
							+ '			<div>Send</div>'
							+ '		</div>'
							+ '	</div>'
							+ '</div>',
			// 可配置参数集合。							
			settable_map: {
				slider_open_time 	: true,
				slider_close_time 	: true,
				slider_opened_em 	: true,
				slider_closed_em 	: true,
				slider_opened_title : true,   
				slider_closed_title : true, 

				chat_model          : true,
				people_model 		: true,
				set_chat_anchor 	: true
			},

			slider_open_time 		: 250,
			slider_close_time 		: 250,
			slider_opened_em 		: 16,
			slider_closed_em 		: 2,
			slider_opened_title 	: 'Click to close',
			slider_closed_title 	: 'Click to open',

			chat_model 		: null,
			people_model	: null,
			set_chat_anchor	: null
		},
		stateMap 	= { 
			$append_target 	: null,
			position_type 	: 'closed', 
			px_per_em 		: 0,
			slider_hidden_px: 0,
			slider_closed_px: 0,  
			slider_opened_px: 0
		},
		jqueryMap 	= {},

		setJqueryMap, getEmSize, setPxSizes, setSliderPosition,
		onClickToggle, configModule, initModule,
		removeSlider, handleResize 
	;
	//----------- End   Module Scope Variables -----------

	//----------- Begin Utility Methods ------------------- 
	getEmSize = function( elem ) {
		return Number(
			getComputedStyle( elem, '').fontSize.match( /\d*\.?\d*/ )[0]
		);
	};
	//----------- End   Utility Methods -------------------	

	//----------- Begin DOM Methods ------------------- 
	setJqueryMap = function() {
		var $append_target = stateMap.$append_target,
			$slider = $append_target.find( '.spa-chat' );

		jqueryMap = { 
			$slider : $slider,
			$head 	: $slider.find( '.spa-chat-head' ),
			$toggle : $slider.find( '.spa-chat-head-toggle' ),
			$title 	: $slider.find( '.spa-chat-head-title' ),
			$sizer 	: $slider.find( '.spa-chat-sizer' ),
			$msgs 	: $slider.find( '.spa-chat-msgs' ),
			$box 	: $slider.find( '.spa-chat-box' ),
			$input 	: $slider.find( '.spa-chat-input input[type=text]')
		};
	};

	setPxSizes = function() {
		var px_per_em, open_height_em ;

		//.spa-chat的默认font-size的大于是多少像素等于1em, 由getEmSize计算得到 ppe.
		px_per_em = getEmSize( jqueryMap.$slider.get(0) );

		open_height_em = configMap.slider_opened_em;

		stateMap.px_per_em = px_per_em;
		stateMap.slider_closed_px = configMap.slider_closed_em * px_per_em;
		stateMap.slider_opened_px = open_height_em * px_per_em;
		jqueryMap.$sizer.css( {
			height: ( open_height_em -2 ) * px_per_em
		});
	};

	// Begin  Public DOM method /setSliderPosition/
	// Example : spa.chat.setSliderPosition( 'closed' );
	// Purpose : Move the chat slider to the requested position.
	// Arguments : 
	// 		* position_type - enum( 'closed', 'opened' , or 'hidden')
	// 		* callback - optional callback to be run end at the end of
	// 		  slider animation. The callback receives a jQuery collection
	// 		  representing the slider div as its single argument.
	// 	Action :
	// 		This method moves the slider into the requested position.
	// 		If the requested position is the current position, it returns
	// 		true without taking further action.
	// 	Returns :
	// 		* true - The requested position was achieved.
	// 		* false - The reuqested position was not achieved.
	// 	Throws : none.
	setSliderPosition = function( position_type, callback ) {
		var height_px, animate_time, slider_title, toggle_text;

		// return true if slider already in requested position
		if( position_type === stateMap.position_type ){
			return true;
		}

		switch( position_type ){
			case 'opened':
				height_px = stateMap.slider_opened_px;
				animate_time = configMap.slider_open_time;
				slider_title = configMap.slider_opened_title;
				toggle_text = "=";
				break;
			
			case 'hidden':
				height_px = 0;
				animate_time = configMap.slider_open_time;
				slider_title = '';
				toggle_text = '+';
				break;

			case 'closed':
				height_px = stateMap.slider_closed_px;
				animate_time = configMap.slider_close_time;
				slider_title = configMap.slider_closed_title;
				toggle_text = '+';
				break;
			// bail for unknown position type
			default:
				return false;
		}

		// animate slider position change
		stateMap.position_type = '';
		jqueryMap.$slider.animate( 
			{ height : height_px },
			animate_time,
			function ( ) {
				jqueryMap.$toggle.prop( 'title', slider_title );
				jqueryMap.$toggle.text( toggle_text );
				stateMap.position_type = position_type;
				if( callback ) {
					callback( jqueryMap.$slider );
				}
			}
		);
		return true;
	};
	// End Public Dom Method /setSliderPosition/
	//----------- End   DOM Methods -------------------	

	//----------- Begin Event Methods ------------------- 
	onClickToggle = function( event ) {
		var set_chat_anchor = configMap.set_chat_anchor ;
		if( stateMap.position_type === 'opened' ){
			set_chat_anchor( 'closed' );
		}else if( stateMap.position_type === 'closed' ){
			set_chat_anchor( 'opened' );
		}
		return false;
	};
	//----------- End   Event Methods -------------------	

	//----------- Begin Public Methods ------------------- 
	// Begin Public Method /configModule/
	// Example 	: sap.chat.configModule( {slider_open_em : 18 } )
	// Purpose 	: Configure the module prior to initialization
	// Arguments: 
	// 	* set_chat_anchor - a callback to modify the URI anchor to indicate
	// 		opened or closed state. This callback must return false if the 
	// 		requested state cannot be met.
	// 	* chat_model
	// 	* peopel_model
	// 	* slider_* settings. All these are optional scalars.
	// 		See mapConfig.settable_map for a full list
	// 		Example : slider_open_em is the open height in em's
	// 	Aciton 	: 
	// 		The internal configuration data structure ( configMap ) is
	// 		updated with provided arguments. No other actions are taken.
	// 	Returns : true;
	// 	Throws 	: JS error object and stack trace on unacceptable or missing arguments
	// 	
	configModule = function( input_map ) {
		spa.util.setConfigModule( {
			input_map: input_map,
			settable_map: configMap.settable_map, 
			config_map: configMap 
		});
			return true;
	};
	// End public method /configModule/

	// Begin public method /initModule/
	// Example 	: spa.chat.initModule( $('#div_id' ) )
	// Purpose 	: Direct Chata to offer its capability to the user
	// Arguments: 
	// 	* $append_target - ( example: $( '#div_id' ) )
	// 		A jQuery collection that should represent a single DOM container.
	// Action 	:
	// 		1、使用HTML填充功能容器。
	// 		2、缓存jQuery集合。
	// 		3、初始化事件处理程序。
	// Returns 	: true on success, false on failure.
	// Throws	: none;
	// 
	initModule = function( $append_target ) {
		$append_target.html( configMap.main_html );
		stateMap.$append_target = $append_target;
		setJqueryMap();
		setPxSizes();

		// initialize chat slider to default title and state
		jqueryMap.$toggle.prop( 'title', configMap.slider_closed_title );
		jqueryMap.$head.click( onClickToggle );
		stateMap.position_type = 'closed';

		return true;
	};
	// End public method /initModule/
	
	// Begin public method /removeSlider/
	// Purpose 	:
	// 	* Remove chatSlider DOM element
	// 	* Reverts to initial state
	// 	* Removes pointers to callbacks and other data
	// Arguments 	: none
	// Returns 		: true
	// Throws 		: none
	// 

	removeSlider = function() {
		// unwind initialization and state
		// remove DOM container; this removes event bindings too.
		if( jqueryMap.$slider ){
			// jqueryMap.$slider.remove( );
			jqueryMap.$slider.hide( 'slow', function(){ 
				jqueryMap.$slider.remove();
				jqueryMap = {};
			} );
		}
		stateMap.$append_target = null;
		stateMap.position_type 	= 'closed';

		// unwind key configurations
		configMap.chat_model 		= null;
		configMap.peopel_model 		= null;
		configMap.set_chat_anchor	= null;

		return true;
	};
	// End 	 public method /removeSlider/

	// Return public methods
	return {
		setSliderPosition 	: setSliderPosition,
		configModule 		: configModule,
		initModule 			: initModule,
		removeSlider		: removeSlider,
		handleResize  		: handleResize
	};
	//----------- End   Public Methods ------------------- 
})(); 