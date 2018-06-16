/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../lib/Options.js":
/*!*************************!*\
  !*** ../lib/Options.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOptions = {
    transitionDurationSec: 0.5,
    transitionTimingFunction: 'ease',
    frameClassName: 'ccc-frame',
    itemsClassName: 'ccc-items',
    scrollDeltaCoefficient: 1,
    inertia: true,
    inertiaAcceleration: 0.005,
    inertiaIntervalMS: 16
};


/***/ }),

/***/ "../lib/index.js":
/*!***********************!*\
  !*** ../lib/index.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
var StyleKey_1 = __webpack_require__(/*! ./util/StyleKey */ "../lib/util/StyleKey.js");
var isPassiveSupported_1 = __webpack_require__(/*! ./util/isPassiveSupported */ "../lib/util/isPassiveSupported.js");
var Options_1 = __webpack_require__(/*! ./Options */ "../lib/Options.js");
var Carousel = /** @class */ (function () {
    function Carousel(element, options) {
        var _this = this;
        this.touchingInfo = null;
        this.itemsX = 0;
        this.inertiaCurrentVelocity = 0;
        this.inertiaTimerId = null;
        this.onTouchStart = function (event) {
            _this.stopInertiaMove();
            var touch = event.touches[0];
            _this.touchingInfo = {
                touchStartX: touch.pageX,
                touchStartY: touch.pageY,
                itemsStartX: _this.itemsX,
                lastTouchX: touch.pageX,
                lastUpdatedAtMS: Date.now(),
                deltaTouchX: 0,
                deltaUpdatedAtMS: 0
            };
        };
        this.onTouchMove = function (event) {
            // 縦スクロールだとわかっているときは何もしない
            if (_this.touchingInfo.isHorizontalScroll === false) {
                return;
            }
            var touch = event.touches[0];
            var dX = touch.pageX - _this.touchingInfo.touchStartX;
            if (typeof _this.touchingInfo.isHorizontalScroll === 'undefined') {
                var dY = touch.pageY - _this.touchingInfo.touchStartY;
                _this.touchingInfo.isHorizontalScroll = Math.abs(dX) - Math.abs(dY) > 0;
            }
            var now = Date.now();
            _this.touchingInfo.deltaTouchX = _this.touchingInfo.lastTouchX - touch.pageX;
            _this.touchingInfo.deltaUpdatedAtMS = now - _this.touchingInfo.lastUpdatedAtMS;
            _this.touchingInfo.lastTouchX = touch.pageX;
            _this.touchingInfo.lastUpdatedAtMS = now;
            if (_this.touchingInfo.isHorizontalScroll) {
                event.preventDefault();
                _this.moveFrameTo(_this.touchingInfo.itemsStartX + dX * _this.options.scrollDeltaCoefficient);
            }
        };
        this.onTouchEnd = function (event) {
            if (_this.touchingInfo.deltaUpdatedAtMS) {
                var initialVelocity = _this.touchingInfo.deltaTouchX * _this.options.scrollDeltaCoefficient / _this.touchingInfo.deltaUpdatedAtMS; // px/msec
                // 初速が0に近い場合は直接アニメーションで動かします。
                if (!_this.options.inertia || !initialVelocity || _this.abs(initialVelocity) < 0.1) {
                    _this.moveFrameTo(_this.getNearestGridX(_this.itemsX), _this.options.transitionDurationSec);
                }
                else {
                    _this.startInertiaMove(-initialVelocity);
                }
            }
            _this.touchingInfo = null;
        };
        this.onWindowResize = function () {
            _this.reset();
        };
        this.options = tslib_1.__assign({}, Options_1.defaultOptions, options);
        this.styleKey = new StyleKey_1.default();
        this.rootElement = element;
        this.frameElement = element.getElementsByClassName(this.options.frameClassName)[0];
        this.itemsElement = element.getElementsByClassName(this.options.itemsClassName)[0];
        this.touchEventListenerOption = isPassiveSupported_1.default() ? { passive: false } : false;
        this.reset();
        this.frameElement.addEventListener('touchstart', this.onTouchStart, this.touchEventListenerOption);
        this.frameElement.addEventListener('touchmove', this.onTouchMove, this.touchEventListenerOption);
        this.frameElement.addEventListener('touchend', this.onTouchEnd);
        window.addEventListener('resize', this.onWindowResize);
    }
    Carousel.prototype.destroy = function () {
        this.frameElement.removeEventListener('touchstart', this.onTouchStart);
        this.frameElement.removeEventListener('touchmove', this.onTouchMove);
        this.frameElement.removeEventListener('touchend', this.onTouchEnd);
        window.removeEventListener('resize', this.onWindowResize);
    };
    Carousel.prototype.reset = function () {
        this.initializeGrid();
    };
    Carousel.prototype.initializeGrid = function () {
        var maxGridX = this.itemsElement.scrollWidth - this.frameElement.clientWidth;
        var grid = [];
        for (var i = 0; i < this.itemsElement.children.length; ++i) {
            var x = this.itemsElement.children[i].offsetLeft;
            if (x >= maxGridX) {
                grid.push(maxGridX);
                break;
            }
            grid.push(x);
        }
        this.grid = grid.map(function (x) { return -x; }).reverse();
    };
    Carousel.prototype.moveFrameTo = function (targetX, durationS) {
        if (durationS === void 0) { durationS = 0; }
        var style = this.itemsElement.style;
        style[this.styleKey.transition] = durationS + "s " + this.options.transitionTimingFunction;
        style[this.styleKey.transform] = 'translate(' + targetX + 'px, 0)';
        this.itemsX = targetX;
    };
    /**
     *         => acc[px/ms^2]
     * |--------------|
     * |  .ccc-items  | -> initialVelocity[px/ms]
     * |--------------|
     * ----------------------------------------------> X
     * ↑this.itemsX[px]
     */
    Carousel.prototype.startInertiaMove = function (initialVelocity) {
        var _this = this;
        // 与えられた初速から到着地点の nearestGridX を算出
        var targetX = this.getNearestGridX(this.itemsX + (initialVelocity > 0 ? 1 : -1) * 0.5 * initialVelocity * initialVelocity / this.options.inertiaAcceleration);
        var diffX = targetX - this.itemsX;
        // 初速に対して算出された diffX が逆方向の場合、そのまま慣性運動させると永遠に止まらないので、直接アニメーションで動かして終了
        if (initialVelocity * diffX < 0) {
            this.moveFrameTo(targetX, this.options.transitionDurationSec);
            return;
        }
        // targetX にちょうど到達するための加速度(符号付き)を逆算して微調整
        var acc = -0.5 * initialVelocity * initialVelocity / diffX;
        var inertiaIntervalMS = this.options.inertiaIntervalMS;
        this.inertiaCurrentVelocity = initialVelocity;
        this.inertiaTimerId = setInterval(function () {
            var currentVelocity = _this.inertiaCurrentVelocity;
            var nextX = _this.itemsX + currentVelocity * inertiaIntervalMS;
            var nextXtargetXDiff = targetX - nextX;
            // nextX が targetX に十分近くなったら終了
            var done = currentVelocity < 0 ? nextXtargetXDiff > -1 : nextXtargetXDiff < 1;
            if (done) {
                _this.stopInertiaMove();
                _this.moveFrameTo(targetX, Math.min(-1 * currentVelocity / acc * 0.001, _this.options.transitionDurationSec));
                return;
            }
            _this.moveFrameTo(nextX);
            _this.inertiaCurrentVelocity = currentVelocity + acc * inertiaIntervalMS;
        }, inertiaIntervalMS);
    };
    Carousel.prototype.stopInertiaMove = function () {
        if (this.inertiaTimerId !== null) {
            clearInterval(this.inertiaTimerId);
            this.inertiaTimerId = null;
        }
    };
    Carousel.prototype.getNearestGridX = function (targetX) {
        var grid = this.grid;
        if (grid[grid.length - 1] < targetX) {
            return grid[grid.length - 1];
        }
        for (var i = grid.length - 1; i > 0; --i) {
            if (grid[i - 1] <= targetX && targetX <= grid[i]) {
                if (targetX - grid[i - 1] < grid[i] - targetX) {
                    return grid[i - 1];
                }
                else {
                    return grid[i];
                }
            }
        }
        return grid[0];
    };
    Carousel.prototype.abs = function (x) {
        return x < 0 ? -x : x;
    };
    return Carousel;
}());
exports.default = Carousel;


/***/ }),

/***/ "../lib/util/StyleKey.js":
/*!*******************************!*\
  !*** ../lib/util/StyleKey.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StyleKey = /** @class */ (function () {
    function StyleKey() {
        this.transitionKeys = [
            'transition',
            'webkitTransition'
        ];
        this.transformKeys = [
            'transform',
            'webkitTransform'
        ];
        var dummyElement = document.createElement('_');
        this.transition = this.transitionKeys.filter(function (key) { return typeof dummyElement.style[key] !== 'undefined'; })[0];
        this.transform = this.transformKeys.filter(function (key) { return typeof dummyElement.style[key] !== 'undefined'; })[0];
    }
    return StyleKey;
}());
exports.default = StyleKey;


/***/ }),

/***/ "../lib/util/isPassiveSupported.js":
/*!*****************************************!*\
  !*** ../lib/util/isPassiveSupported.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isPassiveSupported() {
    var passiveSupported = false;
    try {
        var options = Object.defineProperty({}, "passive", {
            get: function () {
                passiveSupported = true;
            }
        });
        window.addEventListener("test", options, options);
        window.removeEventListener("test", options, options);
    }
    catch (err) {
        passiveSupported = false;
    }
    return passiveSupported;
}
exports.default = isPassiveSupported;


/***/ }),

/***/ "../node_modules/tslib/tslib.es6.js":
/*!******************************************!*\
  !*** ../node_modules/tslib/tslib.es6.js ***!
  \******************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __exportStar, __values, __read, __spread, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var cute_clever_carousel_1 = __webpack_require__(/*! cute-clever-carousel */ "../lib/index.js");
var optionsElement = document.getElementById('options');
var options = {
    transitionDurationSec: 0.5,
    transitionTimingFunction: 'ease',
    scrollDeltaCoefficient: 1,
    inertia: true,
    inertiaAcceleration: 0.005,
    inertiaIntervalMS: 16
};
// init options input
Object.keys(options).forEach(function (optionKey) {
    var tr = document.createElement('tr');
    var labelTd = document.createElement('td');
    var label = document.createElement('span');
    label.innerText = optionKey;
    labelTd.appendChild(label);
    tr.appendChild(labelTd);
    var inputTd = document.createElement('td');
    var input = document.createElement('input');
    input.name = optionKey;
    input.value = options[optionKey];
    input.addEventListener('change', update);
    inputTd.appendChild(input);
    tr.appendChild(inputTd);
    optionsElement.appendChild(tr);
});
var carouselInstance = null;
function update() {
    var inputs = optionsElement.getElementsByTagName('input');
    var options = {};
    for (var i = 0; i < inputs.length; ++i) {
        var input = inputs.item(i);
        switch (input.name) {
            // float
            case 'transitionDurationSec':
            case 'scrollDeltaCoefficient':
            case 'inertiaAcceleration':
            case 'inertiaIntervalMS':
                options[input.name] = parseFloat(input.value);
                break;
            // boolean
            case 'inertia':
                options[input.name] = input.value === 'true';
                break;
            default:
                options[input.name] = input.value;
        }
    }
    console.log('initialized', options);
    if (carouselInstance) {
        carouselInstance.destroy();
    }
    carouselInstance = new cute_clever_carousel_1.default(document.getElementsByClassName('carousel')[0], options);
}
update();


/***/ })

/******/ });
//# sourceMappingURL=index.js.map