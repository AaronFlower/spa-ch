/**
 * spa.util.js
 * General JS Utilities
 */

spa.util = (function () {
	var makeError, setConfigMap ;

	// Begin public constructor /makeError/
	// Purpose : a convenience wrapper to create an error object.
	// Arguments:
	// 	* name_text - the error name
	// 	* msg_text 	- long error message
	// 	* data      - optional data attached to error object.
	// Returns : newly constructed error object.
	// Throws  : none;
	makeError = function( name_text, msg_text, data ) {
		var error = new Error();
		error.name_text = name_text;
		error.msg_text  = msg_text;

		if( data ){ error.data = data; }

		return error;
	};

	// Begin Public method /setConfigModule/
	// Purpose : Common code to set configs in feature modules
	// Arguments :
	// 	* input_map 	- [in] 需要新配置的key-value 对象。
	//					   map of key-value to set in cofig.	
	// 	* settable_map 	- 允许输入集。 map of allowable keys to set.
	// 	* config_map 	- [out] 更新的结果集。 map to apply settings to.
	// 	Returns : true
	// 	Throws  : Exception if input key not allowed in settable_map.
	setConfigModule = function( arg_map ) {
		var 
			input_map 		= arg_map.input_map,
			settable_map 	= arg_map.settable_map,
			config_map		= arg_map.config_map,
			key_name, error
		;

		for( key_name in input_map ){
			if( input_map.hasOwnProperty( key_name ) ){
				if( settable_map.hasOwnProperty( key_name ) ){
					config_map[ key_name ] = input_map[ key_name ];
				}else {
					error = makeError( 'Bad Input',
							'Setting config key |' + key_name + ' | is not supported! '
						);
					throw error;
				}
			}
		}
	};

	return {
		makeError		: makeError, 
		setConfigModule	: setConfigModule
	};
})(); 