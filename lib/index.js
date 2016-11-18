(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require("redux"), require("react"), require("uuid"), require("react-redux"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash", "redux", "react", "uuid", "react-redux"], factory);
	else if(typeof exports === 'object')
		exports["ReactReduxUUID"] = factory(require("lodash"), require("redux"), require("react"), require("uuid"), require("react-redux"));
	else
		root["ReactReduxUUID"] = factory(root["lodash"], root["redux"], root["react"], root["uuid"], root["react-redux"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_10__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createReducer = __webpack_require__(2);

	Object.defineProperty(exports, 'createUUIDReducer', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_createReducer).default;
	  }
	});

	var _connect = __webpack_require__(6);

	Object.defineProperty(exports, 'connectUUID', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_connect).default;
	  }
	});

	var _constants = __webpack_require__(3);

	Object.defineProperty(exports, 'GLOBAL_KEY', {
	  enumerable: true,
	  get: function get() {
	    return _constants.GLOBAL_KEY;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _constants = __webpack_require__(3);

	var _lodash = __webpack_require__(4);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _redux = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var createUUIDReducer = function createUUIDReducer(reducers) {
	  var splitReducer = _lodash2.default.mapValues(reducers, function (reducer) {
	    return function () {
	      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      var action = arguments[1];

	      var isGlobal = _lodash2.default.has(action, ['meta', _constants.GLOBAL_KEY]) && action.meta[_constants.GLOBAL_KEY];

	      if (!isGlobal && !_lodash2.default.has(action, ['meta', _constants.UUID_KEY])) return state;

	      if (isGlobal) return reducer(state, action);

	      var key = action.meta[_constants.UUID_KEY];

	      switch (action.type) {
	        case _constants.REGISTER:
	          return Object.assign({}, state, _defineProperty({}, key, reducer(undefined, action)));
	        case _constants.UNREGISTER:
	          return _lodash2.default.omit(state, key);
	      }

	      return _lodash2.default.has(state, key) ? _extends({}, state, _defineProperty({}, key, reducer(state[key], action))) : state;
	    };
	  });

	  return function () {
	    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var action = arguments[1];

	    if (!_lodash2.default.has(action, ['meta', _constants.NAME_KEY])) return _lodash2.default.mapValues(splitReducer, function (reducer, key) {
	      return reducer(state[key], action);
	    });

	    var name = action.meta[_constants.NAME_KEY];

	    return Object.assign({}, state, _defineProperty({}, name, splitReducer[name](state[name], action)));
	  };
	};

	exports.default = createUUIDReducer;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var NAME_KEY = exports.NAME_KEY = '@@UUID/NAME_KEY';
	var UUID_KEY = exports.UUID_KEY = '@@UUID/UUID_KEY';
	var GLOBAL_KEY = exports.GLOBAL_KEY = '@@UUID/GLOBAL';
	var REGISTER = exports.REGISTER = '@@UUID/REGISTER';
	var UNREGISTER = exports.UNREGISTER = '@@UUID/UNREGISTER';

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("redux");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(7);

	var _react2 = _interopRequireDefault(_react);

	var _redux = __webpack_require__(5);

	var _constants = __webpack_require__(3);

	var _actions = __webpack_require__(8);

	var _lodash = __webpack_require__(4);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _uuid = __webpack_require__(9);

	var _reactRedux = __webpack_require__(10);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var wrapActionCreators = function wrapActionCreators(actionCreators, name, uuid) {
	  return _lodash2.default.mapValues(actionCreators, function (actionCreator) {
	    return function () {
	      var _extends2;

	      var action = actionCreator.apply(undefined, arguments);
	      return _extends({}, action, {
	        meta: _extends({}, action.meta, (_extends2 = {}, _defineProperty(_extends2, _constants.UUID_KEY, uuid), _defineProperty(_extends2, _constants.NAME_KEY, name), _extends2))
	      });
	    };
	  });
	};

	var connectUUID = function connectUUID(name, mapStateToProps, mapDispatchToProps) {
	  return function (Component) {
	    var wrapMapStateToProps = function wrapMapStateToProps(state, _ref) {
	      var uuid = _ref.uuid,
	          props = _objectWithoutProperties(_ref, ['uuid']);

	      if (_lodash2.default.isNil(mapStateToProps)) return {};
	      return mapStateToProps(state.uuid[name][uuid], props);
	    };

	    var wrapMapDispatchToProps = function wrapMapDispatchToProps(dispatch, _ref2) {
	      var uuid = _ref2.uuid,
	          props = _objectWithoutProperties(_ref2, ['uuid']);

	      if (_lodash2.default.isNil(mapDispatchToProps)) return {};
	      if (_lodash2.default.isPlainObject(mapDispatchToProps)) {
	        var _ret = function () {
	          var actions = wrapActionCreators(mapDispatchToProps, name, uuid);
	          // memoize wrapped actions by passing a thunk
	          return {
	            v: function v() {
	              return (0, _redux.bindActionCreators)(actions, dispatch);
	            }
	          };
	        }();

	        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	      }
	      return mapDispatchToProps(dispatch, props);
	    };

	    var ConnectedComponent = (0, _reactRedux.connect)(wrapMapStateToProps, wrapMapDispatchToProps)(Component);

	    var ConnectUUID = function (_React$Component) {
	      _inherits(ConnectUUID, _React$Component);

	      function ConnectUUID() {
	        _classCallCheck(this, ConnectUUID);

	        return _possibleConstructorReturn(this, (ConnectUUID.__proto__ || Object.getPrototypeOf(ConnectUUID)).apply(this, arguments));
	      }

	      _createClass(ConnectUUID, [{
	        key: 'componentWillMount',
	        value: function componentWillMount() {
	          this.uuid = (0, _uuid.v4)();
	          this.props.register(name, this.uuid);
	        }
	      }, {
	        key: 'componentWillUnmount',
	        value: function componentWillUnmount() {
	          this.props.unregister(name, this.uuid);
	        }
	      }, {
	        key: 'render',
	        value: function render() {
	          return _react2.default.createElement(ConnectedComponent, Object.assign({}, this.props, { uuid: this.uuid }));
	        }
	      }]);

	      return ConnectUUID;
	    }(_react2.default.Component);

	    return (0, _reactRedux.connect)(null, { register: _actions.register, unregister: _actions.unregister })(ConnectUUID);
	  };
	};

	exports.default = connectUUID;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.unregister = exports.register = undefined;

	var _constants = __webpack_require__(3);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var register = exports.register = function register(name, uuid) {
	  var _meta;

	  return {
	    type: _constants.REGISTER,
	    meta: (_meta = {}, _defineProperty(_meta, _constants.UUID_KEY, uuid), _defineProperty(_meta, _constants.NAME_KEY, name), _meta)
	  };
	};

	var unregister = exports.unregister = function unregister(name, uuid) {
	  var _meta2;

	  return {
	    type: _constants.UNREGISTER,
	    meta: (_meta2 = {}, _defineProperty(_meta2, _constants.UUID_KEY, uuid), _defineProperty(_meta2, _constants.NAME_KEY, name), _meta2)
	  };
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("uuid");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("react-redux");

/***/ }
/******/ ])
});
;