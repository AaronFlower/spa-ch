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
				chat : { opened : true , closed : true } 
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
						+ '	<div class="spa-shell-modal"></div>'
						+ '</div>',
			chat_extend_time 	: 300,
			chat_retract_time	: 300,
			chat_extend_height 	: 450,
			chat_retract_height : 15,
			chat_extend_title 	: 'Click to retract',
			chat_retract_title 	: 'Click to extend' ,
			resize_interval 	: 200
		},
		//下面的变量多是在后面进行赋值。
		// 将在整个模块中共享的动态信息放在stateMap变量中。
		stateMap = { 
			anchor_map : { },
			resize_idto : undefined
		}, 
		jqueryMap = { }, // 将jQuery集合缓存在jqueryMap中。

		copyAnchorMap, 		setJqueryMap,
		changeAnchorPart, 	onHashChange, onResize, 
		setChatAnchor, 		initModule;
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
		};
	};

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
			_s_chat_previous, _s_chat_proposed, s_chat_proposed,
			anchor_map_proposed, 
			is_ok = true, 
			anchor_map_previous = copyAnchorMap( )
		;
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
				case 'opened' :
					is_ok = spa.chat.setSliderPosition( 'opened' );
					break;
				case 'closed' :
					is_ok = spa.chat.setSliderPosition( 'closed' );
					break;
				default :
					spa.chat.setSliderPosition( 'closed' );
					delete anchor_map_proposed.chat;
					$.uriAnchor.setAnchor( anchor_map_proposed, null, true );
			}
		}

		// Begin revert anchor if slider change denied
		if( ! is_ok ){
			if( anchor_map_previous ){
				$.uriAnchor.setAnchor( anchor_map_previous, null, true );
				stateMap.anchor_map = anchor_map_previous;
			}else{
				delete anchor_map_proposed.chat;
				$.uriAnchor.setAnchor( anchor_map_proposed, null, true );
			}
		}

		return false;
	};
	// End event handler /onHashChange/
	// Begind event handler /onResize/
	onResize = function( ) {
		// 只要当前没有尺寸调整计时器在运作，就运行onResize的逻辑。
		if( stateMap.resize_idto ){
			return true;
		}

		spa.chat.handleResize( );
		stateMap.resize_idto = setTimeout(
			function ( ) {
				stateMap.resize_idto = undefined;
			},
			configMap.resize_interval
		);

		// 返回true,这样jQuery就不会调用preventDefault()或才stopPropagation()函数了。
		return true;
	};
	// End 	  event handler /onResize/
	//--------- End   Event Handlers --------

	//--------------- BEGIN CALLBACKS -----------
	// Begin callback method /setChatAnchor/
	// Example 	: setChatAnchor( 'closed' )
	// Purpose 	: Change the chat component of the anchor
	// Arguments:
	// 	* position_type - emum( 'opened', 'closed')
	// Action 	:
	// 	Changes the URI anchor parameter 'chat' to the requested value if possible.
	// Returns 
	// 	* true 	- requested anchor part was updated
	// 	* false - requested anchor part was not updated.
	// Throws 	: none;
	setChatAnchor = function( position_type ) {
		return changeAnchorPart( { chat : position_type } );
	};
	// End callback method /setChatAnchor/
	//--------------- END   CALLBACKS -----------

	//------------ Begin Public Methods -------
	//------------ Begin public method /initModule/
	// Example 	: spa.shell.initModule( $('#app_div_id' ) )
	// Purpose 	: Directs the shell to offer its capability to the user 
	// Arguments: 
	// 	* container - ( example : $( '#app_div_id' ) )
	// Action	:
	// 	Populates $container with the shell of the UI and then cofigures and initializes
	// 	feature modules. The shell is alse responsible for browser-wide issues such as
	// 	URI anchor and cookie management.
	// Returns 	: none;
	// Throws 	: none;
	initModule = function ( $container ) {
		stateMap.$container = $container;
		$container.html( configMap.main_html );	
		setJqueryMap();

		// 初始化配置 锚 模式集合
		$.uriAnchor.configModule( {
			schema_map: configMap.anchor_schema_map 
		 });
		// config and initialize feature modules
		spa.chat.configModule( {
			set_chat_anchor 	: setChatAnchor
		} );
		spa.chat.initModule( jqueryMap.$container );
		// 当一切都加载完成后，为window绑定 hashchange事件并触发。
		$(window) 
			.bind( 'resize', onResize )
			.bind( 'hashchange', onHashChange )
			.trigger( 'hashchange' );

	};
	//------------ End   public method /initModule/

	return {
		initModule : initModule
	};

	//------------ End   Public Methods -------

})(); 