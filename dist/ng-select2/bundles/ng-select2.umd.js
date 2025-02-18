(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/forms'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('ng-select2', ['exports', '@angular/core', '@angular/forms', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["ng-select2"] = {}, global.ng.core, global.ng.forms, global.ng.common));
})(this, (function (exports, i0, forms, common) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || Array.prototype.slice.call(from));
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var NgSelect2Component = /** @class */ (function () {
        function NgSelect2Component(renderer, zone, _element) {
            this.renderer = renderer;
            this.zone = zone;
            this._element = _element;
            // value for placeholder
            this.placeholder = '';
            this.dropdownParent = '';
            this.allowClear = false;
            // enable / disable select2
            this.disabled = false;
            // Specify the select's ID
            this.id = null;
            // Specify the select's class(es)
            this.class = null;
            // Specify the select's required attribute
            this.required = null;
            // emitter when value is changed
            this.valueChanged = new i0.EventEmitter();
            // emitter when the dropdown is opened
            this.open = new i0.EventEmitter();
            // emitter to expose the select2 api
            this.select2Api = new i0.EventEmitter();
            this.element = undefined;
            this.check = false;
            this.dropdownId = Math.floor(Math.random() + Date.now());
            this.isOpen = false;
            this.propagateChange = function (value) { };
        }
        NgSelect2Component.prototype.ngDoCheck = function () {
            if (!this.element) {
                return;
            }
        };
        NgSelect2Component.prototype.ngOnInit = function () {
            // if (this.cssImport) {
            //   const head = document.getElementsByTagName('head')[0];
            //   const link: any = head.children[head.children.length - 1];
            //   if (!link.version) {
            //     const newLink = this.renderer.createElement(head, 'style');
            //     this.renderer.setElementProperty(newLink, 'type', 'text/css');
            //     this.renderer.setElementProperty(newLink, 'version', 'select2');
            //     this.renderer.setElementProperty(newLink, 'innerHTML', this.style);
            //   }
            // }
        };
        NgSelect2Component.prototype.ngOnChanges = function (changes) {
            if (!this.element) {
                return;
            }
            if (changes['data'] && JSON.stringify(changes['data'].previousValue) !== JSON.stringify(changes['data'].currentValue)) {
                this.initPlugin();
                var newValue = this.value;
                this.setElementValue(newValue);
                this.valueChanged.emit(newValue);
                this.propagateChange(newValue);
            }
            if (changes['value'] && changes['value'].previousValue !== changes['value'].currentValue) {
                var newValue = changes['value'].currentValue;
                this.setElementValue(newValue);
                this.valueChanged.emit(newValue);
                this.propagateChange(newValue);
            }
            if (changes['disabled'] && changes['disabled'].previousValue !== changes['disabled'].currentValue) {
                this.renderer.setProperty(this.selector.nativeElement, 'disabled', this.disabled);
            }
            if (changes['placeholder'] && changes['placeholder'].previousValue !== changes['placeholder'].currentValue) {
                this.element.data('select2').$container.find('.select2-selection__placeholder').text(this.placeholder);
            }
            if (changes['dropdownParent'] && changes['dropdownParent'].previousValue !== changes['dropdownParent'].currentValue) {
                this.renderer.setAttribute(this.selector.nativeElement, 'data-dropdownParent', '#' + this.dropdownParent);
            }
            if (changes['allowClear'] && changes['allowClear'].previousValue !== changes['allowClear'].currentValue) {
                this.renderer.setAttribute(this.selector.nativeElement, 'data-allow-clear', this.allowClear.toString());
            }
        };
        NgSelect2Component.prototype.ngAfterViewInit = function () {
            var _this = this;
            this.element = jQuery(this.selector.nativeElement);
            this.renderer.setAttribute(this.selector.nativeElement, 'data-dropdownParent', '#' + this.dropdownParent);
            this.renderer.setAttribute(this.selector.nativeElement, 'data-allow-clear', this.allowClear.toString());
            // console.log(this.selector.nativeElement);
            this.initPlugin();
            if (this.value !== undefined && this.value !== null) {
                this.setElementValue(this.value);
            }
            this.element.on('select2:select select2:unselect change', function (e) {
                // const newValue: string = (e.type === 'select2:unselect') ? '' : this.element.val();
                var newValue = _this.element.val();
                _this.valueChanged.emit(newValue);
                if (e.type !== 'change') {
                    _this.propagateChange(newValue);
                }
            });
            /*
             * Hacky fix for a bug in select2 with jQuery 3.6.0's new nested-focus "protection"
             * see: https://github.com/select2/select2/issues/5993
             * see: https://github.com/jquery/jquery/issues/4382
             *
             * TODO: Recheck with the select2 GH issue and remove once this is fixed on their side
             */
            this.element.on('select2:open', function () {
                document.querySelector("." + _this.getDropdownIdClass() + " .select2-search__field").focus();
                if (!_this.isOpen) {
                    _this.open.emit();
                }
                _this.isOpen = true;
            });
            this.element.on('select2:close', function () {
                _this.isOpen = false;
            });
        };
        NgSelect2Component.prototype.ngOnDestroy = function () {
            if (this.element) {
                this.element.off('select2:select');
                this.element.off('select2:open');
                this.element.off('select2:close');
            }
        };
        NgSelect2Component.prototype.initPlugin = function () {
            var _this = this;
            if (!this.element.select2) {
                if (!this.check) {
                    this.check = true;
                    console.log('Please add Select2 library (js file) to the project.' +
                        'You can download it from https://github.com/select2/select2/tree/master/dist/js.');
                }
                return;
            }
            // If select2 already initialized remove him and remove all tags inside
            if (this.element.hasClass('select2-hidden-accessible') === true) {
                this.element.select2('destroy');
                this.renderer.setProperty(this.selector.nativeElement, 'innerHTML', '');
            }
            var options = {
                data: this.data,
                width: (this.width) ? this.width : 'resolve',
                placeholder: this.placeholder
            };
            if (this.dropdownParent) {
                options.dropdownParent = jQuery('#' + this.dropdownParent);
            }
            Object.assign(options, this.options);
            var dropdownCssClass = this.getDropdownIdClass();
            options.dropdownCssClass = options.dropdownCssClass ? options.dropdownCssClass += " " + dropdownCssClass : dropdownCssClass;
            if (options.matcher) {
                jQuery.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher) {
                    options.matcher = oldMatcher(options.matcher);
                    _this.select2 = _this.element.select2(options).data('select2');
                    if (typeof _this.value !== 'undefined') {
                        _this.setElementValue(_this.value);
                    }
                });
            }
            else {
                this.select2 = this.element.select2(options).data('select2');
            }
            this.select2Api.emit(this.select2);
            this.renderer.setProperty(this.selector.nativeElement, 'disabled', this.disabled);
        };
        NgSelect2Component.prototype.setElementValue = function (newValue) {
            var e_1, _a;
            // this.zone.run(() => {
            if (Array.isArray(newValue)) {
                try {
                    for (var _b = __values(this.selector.nativeElement.options), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var option = _c.value;
                        this.renderer.setProperty(option, 'selected', (newValue.indexOf(option.value) > -1));
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            else {
                this.renderer.setProperty(this.selector.nativeElement, 'value', newValue);
            }
            if (this.element) {
                this.element.trigger('change.select2');
            }
            // });
        };
        NgSelect2Component.prototype.getDropdownIdClass = function () {
            return "select2-dropdown-id-" + this.dropdownId;
        };
        NgSelect2Component.prototype.writeValue = function (value) {
            if (value !== undefined) {
                this.value = value;
                this.setElementValue(value);
            }
        };
        NgSelect2Component.prototype.registerOnChange = function (fn) {
            this.propagateChange = fn;
        };
        NgSelect2Component.prototype.registerOnTouched = function () {
        };
        NgSelect2Component.prototype.setDisabledState = function (isDisabled) {
            this.disabled = isDisabled;
            this.renderer.setProperty(this.selector.nativeElement, 'disabled', this.disabled);
        };
        return NgSelect2Component;
    }());
    NgSelect2Component.ɵfac = function NgSelect2Component_Factory(t) { return new (t || NgSelect2Component)(i0__namespace.ɵɵdirectiveInject(i0__namespace.Renderer2), i0__namespace.ɵɵdirectiveInject(i0__namespace.NgZone), i0__namespace.ɵɵdirectiveInject(i0__namespace.ElementRef)); };
    NgSelect2Component.ɵcmp = i0__namespace.ɵɵngDeclareComponent({ version: "11.2.14", type: NgSelect2Component, selector: "ng-select2", inputs: { data: "data", placeholder: "placeholder", dropdownParent: "dropdownParent", allowClear: "allowClear", value: "value", width: "width", disabled: "disabled", id: "id", class: "class", required: "required", options: "options" }, outputs: { valueChanged: "valueChanged", open: "open", select2Api: "select2Api" }, providers: [
            {
                provide: forms.NG_VALUE_ACCESSOR,
                useExisting: i0.forwardRef(function () { return NgSelect2Component; }),
                multi: true,
            },
        ], viewQueries: [{ propertyName: "selector", first: true, predicate: ["selector"], emitDistinctChangesOnly: false, descendants: true, static: true }], usesOnChanges: true, ngImport: i0__namespace, template: "<select #selector [attr.id]=\"id\" [attr.class]=\"class\" [attr.required]=\"required\">\r\n  <ng-content select=\"option, optgroup\">\r\n  </ng-content>\r\n</select>\r\n", changeDetection: i0__namespace.ChangeDetectionStrategy.OnPush, encapsulation: i0__namespace.ViewEncapsulation.None });
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0__namespace.ɵsetClassMetadata(NgSelect2Component, [{
                type: i0.Component,
                args: [{
                        selector: 'ng-select2',
                        templateUrl: './ng-select2.component.html',
                        encapsulation: i0.ViewEncapsulation.None,
                        changeDetection: i0.ChangeDetectionStrategy.OnPush,
                        providers: [
                            {
                                provide: forms.NG_VALUE_ACCESSOR,
                                useExisting: i0.forwardRef(function () { return NgSelect2Component; }),
                                multi: true,
                            },
                        ],
                    }]
            }], function () { return [{ type: i0__namespace.Renderer2 }, { type: i0__namespace.NgZone }, { type: i0__namespace.ElementRef }]; }, { selector: [{
                    type: i0.ViewChild,
                    args: ['selector', { static: true }]
                }], data: [{
                    type: i0.Input
                }], placeholder: [{
                    type: i0.Input
                }], dropdownParent: [{
                    type: i0.Input
                }], allowClear: [{
                    type: i0.Input
                }], value: [{
                    type: i0.Input
                }], width: [{
                    type: i0.Input
                }], disabled: [{
                    type: i0.Input
                }], id: [{
                    type: i0.Input
                }], class: [{
                    type: i0.Input
                }], required: [{
                    type: i0.Input
                }], options: [{
                    type: i0.Input
                }], valueChanged: [{
                    type: i0.Output
                }], open: [{
                    type: i0.Output
                }], select2Api: [{
                    type: i0.Output
                }] });
    })();

    var NgSelect2Module = /** @class */ (function () {
        function NgSelect2Module() {
        }
        return NgSelect2Module;
    }());
    NgSelect2Module.ɵfac = function NgSelect2Module_Factory(t) { return new (t || NgSelect2Module)(); };
    NgSelect2Module.ɵmod = i0__namespace.ɵɵdefineNgModule({ type: NgSelect2Module });
    NgSelect2Module.ɵinj = i0__namespace.ɵɵdefineInjector({ imports: [[
                common.CommonModule
            ]] });
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0__namespace.ɵɵsetNgModuleScope(NgSelect2Module, { declarations: [NgSelect2Component], imports: [common.CommonModule], exports: [NgSelect2Component] }); })();
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0__namespace.ɵsetClassMetadata(NgSelect2Module, [{
                type: i0.NgModule,
                args: [{
                        imports: [
                            common.CommonModule
                        ],
                        declarations: [NgSelect2Component],
                        exports: [NgSelect2Component]
                    }]
            }], null, null);
    })();

    /*
     * Public API Surface of ng-select2
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.NgSelect2Component = NgSelect2Component;
    exports.NgSelect2Module = NgSelect2Module;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ng-select2.umd.js.map
