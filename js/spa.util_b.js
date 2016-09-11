/**
 * spa.util_b.js
 * Javascript browser utilities
 */
/* global $, spa, getComputedStyle */
spa.util_b = (function () {
	'use strict';	
	//如果个你认真对待大规模JS项目，我们鼓励你考虑在函数作用域的名字空间内使用 严格模式。
	// ------------ Begin Module Scope Variables ----------
	var 
		configMap = {
			regex_encode_html		: /[&"'<>]/g,
			regex_encode_html_noamp	: /["'<>]/g,
			html_encode_map 		: {
				'&' :'&#38',
				'"' :'&#34', 
				"'" :'&#39', 
				'>' :'&#62', 
				'<' :'&#60' 
			},
			html_encode_noamp_map 	: {}
		},
		decodeHtml, decodeHtml_, encodeHtml, encodeHtml_, getEmSize 
	;

	// html_encode_noamp_map 由 html_encode_map 创建，但是要删除['&']
	configMap.html_encode_noamp_map = $.extend( {}, configMap.html_encode_map );
	delete configMap.html_encode_noamp_map['&'];

	// ------------ End   Module Scope Variables ----------

	// --------------- Begin Utility Methods -----------------
	// Begin decodeHtml
	// Decodes HTML entities in a browser-friendly way.
	// Depends on $ jQuery.
	// 
	decodeHtml = function( str ) {
		return $('<div />').html( str || '').text();
	};
	// 另一种是原生的 js 不依赖于 jQuery, 但是其思想都是一致的.
	decodeHtml_ = function( str ) {
		var div_container = document.createElement('div');
		div_container.innerHTML = str || '' ;
		return div_container.innerText || div_container.innerContent ;
	}; 
	// End decodeHTML

	// Begin encodeHtml
	// This is single pass encoder for  html entities and handles an arbitrary number of characters.
	encodeHtml = function( str, exclude_amp ) {
		var 
			input_str = String( str ),
			regex, lookup_map 
		;

		if( exclude_amp ){
			regex = configMap.regex_encode_html_noamp ;
			lookup_map = configMap.html_encode_noamp_map ;
		}else {
			regex = configMap.regex_encode_html ;
			lookup_map = configMap.html_encode_map ;
		}

		return input_str.replace( regex , function ( match , name ) {
			return lookup_map[ match ] || '';
		});
	};
	// 如果不考虑 &(ampersand),则下面是与 decodeHtml_ 对应的另外一种写法 。
	encodeHtml_ = function( str ) {
		var encode_container = document.createElement( 'div' );
		encode_container.innerHTML = '';
		encode_container.appendChild( document.createTextNode( str || '' ) );
		return encode_container.innerHTML;
	};
	// End encodeHtml 

	// Begin getEmSize
	// returns size of ems in pixels
	// 
	getEmSize = function( elem ) {
		return Number( getComputedStyle( elem , '').fontSize.match( /\d*\.?\d*/ )[0] );
	};
	// End getEmSize

	// export methods    
	 return {
	 	decodeHtml 	: decodeHtml,
	 	decodeHtml_ : decodeHtml_,
	 	encodeHtml  : encodeHtml,
	 	encodeHtml_ : encodeHtml_,
	 	getEmSize 	: getEmSize
	 };
	// --------------- End   Utility Methods -----------------
})(); 