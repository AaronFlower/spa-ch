/**
 * spa.model.js
 * Model module
 */
/* global TAFFY, $, spa */

spa.model = (function () {
	'use strict';
	var 
		configMap = {
			anon_id 	: 'a0'
		},
		stateMap = {
			anon_user 		: null,
			people_cid_map 	: {},
			people_db 		: TAFFY()
		},

		isFakeData 	= true,

		personProto, makePerson, people, initModule
	;

	// 创建person prototype ，使用原型通常能减少对内存的需求，从而改进对象的性能。
	personProto = {
		get_is_user : function ( ) {
			return this.cid === stateMap.user.id ;
		},
		get_is_anon : function ( ) {
			return this.cid === stateMap.anon_user.id;
		}
	};
	// person的构造函数， 通过Object.create( <prototype> )来创建对象。
	makePerson = function( person_map ) {
		var 
			person,
			cid  	= person_map.cid,
			css_map = person_map.css_map,
			id 		= person_map.id,
			name 	= person_map.name
		;

		if( cid === undefined || ! 	name ){
			throw 'client id and name required!';
		}

		person = Object.create( personProto );
		person.cid = cid;
		person.name = name;
		person.css_map = css_map;

		if( id ){ 
			person.id = id;
		}	

		stateMap.people_cid_map[ cid ] = person ;
		stateMap.people_db.insert( person );

		return person;
	};
	// 定义people 对象， 具有获取 people_db或people_cid_map的方法。
	people = {
		get_db 		: function ( ) {
			return stateMap.people_db;
		},
		get_cid_map : function ( ) {
			return stateMap.people_cid_map;
		}
	};

	initModule = function( ) {
		var i, people_list, person_map ;

		// 初始化匿名person, 确保它有和其它 person对象一样的方法和属性。不用考虑将来的改变。
		stateMap.anon_user = makePerson( {
			cid : configMap.anon_id,
			id 	: configMap.anon_id,
			name: 'anonymouse'
		});
		stateMap.user = stateMap.anon_user;

		// 从Fake模块，获取在线人员列表，把它们添加到TaffyDB集合 people_db 里面。
		if( isFakeData ){
			people_list = spa.fake.getPeopleList();
			for( i = 0; i < people_list.length; ++i ){
				person_map = people_list[ i ] ;
				makePerson({
					cid 	: person_map._id,
					css_map	: person_map.css_map,
					id 		: person_map.id,
					name 	: person_map.name
				});
			}
		}
	};
	return {
		initModule 	: initModule,
		people 		: people
	};
})(); 