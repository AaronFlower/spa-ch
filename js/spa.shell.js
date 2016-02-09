/**
 * spa.shell.js
 * Shell Module for SPA
 */

/* global $, spa */

spa.shell = (function () {
	// ------- Begin Module Scope Variables
	var 
		configMap = {
			anchor_schema_map : {	// anchor可以设置值的集合。
				chat : { open : true , closed : true } 
			},
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
			chat_extend_time 	: 300,
			chat_retract_time	: 300,
			chat_extend_height 	: 450,
			chat_retract_height : 15,
			chat_extend_title 	: 'Click to retract',
			chat_retract_title 	: 'Click to extend'
		},
		//下面的变量多是在后面进行赋值。
		// 将在整个模块中共享的动态信息放在stateMap变量中。
		stateMap = { 
			$container : null,
			anchor_map : { },
			is_chat_retracted : true 
		}, 
		jqueryMap = { }, // 将jQuery集合缓存在jqueryMap中。

		copyAnchorMap, setJqueryMap, toggleChat,
		changeAnchorPart, onHashChange, 
		onClickChat, initModule;
	// ------- End 	 Module Scope Variables

	// --------- Begin Utility Methods--------- 
	copyAnchorMap = function ( ) {
		// 一般js都按引用的，想要正确的复制不是一件容易的事， 还好有$.extend。
		return $.extend( true, { }, stateMap.anchor_map );	
	};
	// --------- End   Utility Methods--------- 
	
	// --------- Begin Dom Method -------- 
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
	// State 	: sets stateMap.is_chat_retracted
	// 		* true 	- slider is retracted
	// 		* false - slider is extended
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
					jqueryMap.$chat.attr( 'title', configMap.chat_extend_title );
					stateMap.is_chat_retracted = false ;
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
				jqueryMap.$chat.attr( 'title', configMap.chat_retract_title );
				stateMap.is_chat_retracted = true;
				if( callback ){
					callback( jqueryMap.$chat );
				}
			}
		);
		return true;
		// End retract chat slider
	};
	// End DOM method /toggleChat/
	// ------------- Begin Dom Method ( changeAnchorPart ) -----------
	// Purpose 	 : 更改URI 锚组件的部分内容。
	// Arguments :
	// 		* arg_map - 该map描述那些需要改变。
	// 	Returns  :
	// 		* true  - 锚被更新
	// 		* false - 锚更新失败。
	// 	Action : 
	// 		锚的当前状态存储在 stateMap.anchor_map中。
	// 			* 通过 copyAnchorMap() 获得当前锚一个状态map.
	// 			* 修改 arg_map的 key-value
	// 			* 管理 map中的独立键与关联键
	// 			* 变更 锚。
	// 			* Return true on success , and false on failure.
	changeAnchorPart = function ( arg_map ) {
		var 
			anchor_map_revise = copyAnchorMap( ),
			bool_return = true,
			key_name, key_dep_name ;
		// 将传进来的 arg_map 变更合并到 anchor_map_revise中。
		// Begin merge changes into anchor map
		KEYVAL:
		for( key_name in arg_map ){
			if( arg_map.hasOwnProperty( key_name ) ){
				// 跳过关联键
				if( 0 === key_name.indexOf( '_' ) ){
					continue KEYVAL;
				}

				// 更新独立键
				anchor_map_revise[ key_name ] = arg_map[ key_name ];

				// 更新对应的独立键，如果有的话。
				key_dep_name = '_' + key_name ;
				if( arg_map[ key_dep_name ] ){
					anchor_map_revise[ key_dep_name ] = arg_map[ key_dep_name ];
				}else {
					//否则删除之前锚中的关联键。 即使删除不存在的属性也不会报错的。
					delete anchor_map_revise[ key_dep_name ];
					delete anchor_map_revise[ '_s' + key_dep_name ];
				}
			}
		}
		// End merge changes into anchor map
		
		//Begin attempt to update URI; revert it if not sucessful.
		try{
			$.uriAnchor.setAnchor( anchor_map_revise );
		}catch( error ){
			// replace URI with existing state
			$.uriAnchor.setAnchor( stateMap.anchor_map , null, true );
			bool_return = false ;
		}
		// End attempt to update URI;

		return bool_return;
	};
	// ------------- End   Dom Method ( changeAnchorPart ) -----------
	// ------------- End Dom Methods --------
	
	//--------- Begin Event Handlers --------
	// Begin Event Handler /onHashchange/
	// Purpose 		: hashchange 处理程序。
	// Arguments 	: 
	// 		event - jQuery event object.
	// Settings 	: none;
	// Returns 		: false;
	// Action :
	// 		* 根据当前状态和新的锚表示的状态作比较，如果不同则尝试更改应用部分。
	// 		* 如果不能处理请求的变化，则保持当前的状态，并恢复锚，以便和状态匹配。
	onHashChange = function ( event ) {
		var 
			anchor_map_previous = copyAnchorMap( ),
			anchor_map_proposed,
			_s_chat_previous, _s_chat_proposed,
			s_chat_proposed ;
		// Attempt to parse anchor
		try{
			anchor_map_proposed = $.uriAnchor.makeAnchorMap( );
		}catch( error ){
			$.uriAnchor.setAnchor( anchor_map_previous , null, true );
			return false ;
		}
		// 更新stateMap
		stateMap.anchor_map = anchor_map_proposed ;
		// convenience vars 
		_s_chat_proposed = anchor_map_proposed._s_chat ;
		_s_chat_previous = anchor_map_previous._s_chat ;

		// 如果 hash 值改变了，则变对应的应用部分。
		if( !anchor_map_previous || _s_chat_proposed !== _s_chat_previous ){
			s_chat_proposed = anchor_map_proposed.chat ;
			switch(s_chat_proposed){
				case 'open' :
					toggleChat( true );
					break;
				case 'closed' :
					toggleChat( false );
					break;
				default :
					toggleChat( false );
					delete anchor_map_proposed.chat;
					$.uriAnchor.setAnchor( anchor_map_proposed, null, true );
			}
		}

		return false;
	};
	// End event handler /onHashChange/

	// Begin event handler /onClickChat/
	onClickChat = function ( event ) {
		// 将应用状态当前历史事件来记录，并记录天anchor中。
		// 单击是为了变更应用的状态，但是应用了锚之后的逻辑是这样的：
		// 		* 先去变更锚（ changeAnchorPart ）
		// 		* 变更锚后自然会触发( onHashChange )事件
		// 		* onHashchange事件会根据锚的状态来更新应用的状态。
		changeAnchorPart( {
			chat : ( stateMap.is_chat_retracted ? 'open' : 'closed' )
		});
		return false;
	};
	// End event handler /onClickChat/
	//--------- End   Event Handlers --------

	//------------ Begin Public Methods -------
	//------------ Begin public method /initModule/
	initModule = function ( $container ) {
		stateMap.$container = $container;
		$container.html( configMap.main_html );	
		setJqueryMap();

		// initialize chat slider and bind click handler
		configMap.is_chat_retracted = true;
		jqueryMap.$chat
			.attr( 'title', configMap.chat_retract_title )
			.click( onClickChat );
		// 初始化配置 锚 模式集合
		$.uriAnchor.configModule( {
			schema_map: configMap.anchor_schema_map 
		 });
		// 当一切都加载完成后，为window绑定 hashchange事件并触发。
		$(window) 
			.bind( 'hashchange', onHashChange )
			.trigger( 'hashchange' );

	};
	//------------ End   public method /initModule/

	return {
		initModule : initModule
	};

	//------------ End   Public Methods -------

})(); 