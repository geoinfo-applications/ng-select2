import * as i0 from '@angular/core';
import { EventEmitter, forwardRef, Component, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, Input, Output, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

class NgSelect2Component {
    constructor(renderer, zone, _element) {
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
        this.valueChanged = new EventEmitter();
        // emitter when the dropdown is opened
        this.open = new EventEmitter();
        // emitter to expose the select2 api
        this.select2Api = new EventEmitter();
        this.element = undefined;
        this.check = false;
        this.dropdownId = Math.floor(Math.random() + Date.now());
        this.isOpen = false;
        this.propagateChange = (value) => { };
    }
    ngDoCheck() {
        if (!this.element) {
            return;
        }
    }
    ngOnInit() {
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
    }
    ngOnChanges(changes) {
        if (!this.element) {
            return;
        }
        if (changes['data'] && JSON.stringify(changes['data'].previousValue) !== JSON.stringify(changes['data'].currentValue)) {
            this.initPlugin();
            const newValue = this.value;
            this.setElementValue(newValue);
            this.valueChanged.emit(newValue);
            this.propagateChange(newValue);
        }
        if (changes['value'] && changes['value'].previousValue !== changes['value'].currentValue) {
            const newValue = changes['value'].currentValue;
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
    }
    ngAfterViewInit() {
        this.element = jQuery(this.selector.nativeElement);
        this.renderer.setAttribute(this.selector.nativeElement, 'data-dropdownParent', '#' + this.dropdownParent);
        this.renderer.setAttribute(this.selector.nativeElement, 'data-allow-clear', this.allowClear.toString());
        // console.log(this.selector.nativeElement);
        this.initPlugin();
        if (this.value !== undefined && this.value !== null) {
            this.setElementValue(this.value);
        }
        this.element.on('select2:select select2:unselect change', (e) => {
            // const newValue: string = (e.type === 'select2:unselect') ? '' : this.element.val();
            const newValue = this.element.val();
            this.valueChanged.emit(newValue);
            if (e.type !== 'change') {
                this.propagateChange(newValue);
            }
        });
        /*
         * Hacky fix for a bug in select2 with jQuery 3.6.0's new nested-focus "protection"
         * see: https://github.com/select2/select2/issues/5993
         * see: https://github.com/jquery/jquery/issues/4382
         *
         * TODO: Recheck with the select2 GH issue and remove once this is fixed on their side
         */
        this.element.on('select2:open', () => {
            document.querySelector(`.${this.getDropdownIdClass()} .select2-search__field`).focus();
            if (!this.isOpen) {
                this.open.emit();
            }
            this.isOpen = true;
        });
        this.element.on('select2:close', () => {
            this.isOpen = false;
        });
    }
    ngOnDestroy() {
        if (this.element) {
            this.element.off('select2:select');
            this.element.off('select2:open');
            this.element.off('select2:close');
        }
    }
    initPlugin() {
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
        const options = {
            data: this.data,
            width: (this.width) ? this.width : 'resolve',
            placeholder: this.placeholder
        };
        if (this.dropdownParent) {
            options.dropdownParent = jQuery('#' + this.dropdownParent);
        }
        Object.assign(options, this.options);
        const dropdownCssClass = this.getDropdownIdClass();
        options.dropdownCssClass = options.dropdownCssClass ? options.dropdownCssClass += ` ${dropdownCssClass}` : dropdownCssClass;
        if (options.matcher) {
            jQuery.fn.select2.amd.require(['select2/compat/matcher'], (oldMatcher) => {
                options.matcher = oldMatcher(options.matcher);
                this.select2 = this.element.select2(options).data('select2');
                if (typeof this.value !== 'undefined') {
                    this.setElementValue(this.value);
                }
            });
        }
        else {
            this.select2 = this.element.select2(options).data('select2');
        }
        this.select2Api.emit(this.select2);
        this.renderer.setProperty(this.selector.nativeElement, 'disabled', this.disabled);
    }
    setElementValue(newValue) {
        // this.zone.run(() => {
        if (Array.isArray(newValue)) {
            for (const option of this.selector.nativeElement.options) {
                this.renderer.setProperty(option, 'selected', (newValue.indexOf(option.value) > -1));
            }
        }
        else {
            this.renderer.setProperty(this.selector.nativeElement, 'value', newValue);
        }
        if (this.element) {
            this.element.trigger('change.select2');
        }
        // });
    }
    getDropdownIdClass() {
        return `select2-dropdown-id-${this.dropdownId}`;
    }
    writeValue(value) {
        if (value !== undefined) {
            this.value = value;
            this.setElementValue(value);
        }
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched() {
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this.renderer.setProperty(this.selector.nativeElement, 'disabled', this.disabled);
    }
}
NgSelect2Component.ɵfac = function NgSelect2Component_Factory(t) { return new (t || NgSelect2Component)(i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.NgZone), i0.ɵɵdirectiveInject(i0.ElementRef)); };
NgSelect2Component.ɵcmp = i0.ɵɵngDeclareComponent({ version: "11.2.14", type: NgSelect2Component, selector: "ng-select2", inputs: { data: "data", placeholder: "placeholder", dropdownParent: "dropdownParent", allowClear: "allowClear", value: "value", width: "width", disabled: "disabled", id: "id", class: "class", required: "required", options: "options" }, outputs: { valueChanged: "valueChanged", open: "open", select2Api: "select2Api" }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NgSelect2Component),
            multi: true,
        },
    ], viewQueries: [{ propertyName: "selector", first: true, predicate: ["selector"], emitDistinctChangesOnly: false, descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: "<select #selector [attr.id]=\"id\" [attr.class]=\"class\" [attr.required]=\"required\">\r\n  <ng-content select=\"option, optgroup\">\r\n  </ng-content>\r\n</select>\r\n", changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NgSelect2Component, [{
        type: Component,
        args: [{
                selector: 'ng-select2',
                templateUrl: './ng-select2.component.html',
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => NgSelect2Component),
                        multi: true,
                    },
                ],
            }]
    }], function () { return [{ type: i0.Renderer2 }, { type: i0.NgZone }, { type: i0.ElementRef }]; }, { selector: [{
            type: ViewChild,
            args: ['selector', { static: true }]
        }], data: [{
            type: Input
        }], placeholder: [{
            type: Input
        }], dropdownParent: [{
            type: Input
        }], allowClear: [{
            type: Input
        }], value: [{
            type: Input
        }], width: [{
            type: Input
        }], disabled: [{
            type: Input
        }], id: [{
            type: Input
        }], class: [{
            type: Input
        }], required: [{
            type: Input
        }], options: [{
            type: Input
        }], valueChanged: [{
            type: Output
        }], open: [{
            type: Output
        }], select2Api: [{
            type: Output
        }] }); })();

class NgSelect2Module {
}
NgSelect2Module.ɵfac = function NgSelect2Module_Factory(t) { return new (t || NgSelect2Module)(); };
NgSelect2Module.ɵmod = i0.ɵɵdefineNgModule({ type: NgSelect2Module });
NgSelect2Module.ɵinj = i0.ɵɵdefineInjector({ imports: [[
            CommonModule
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(NgSelect2Module, { declarations: [NgSelect2Component], imports: [CommonModule], exports: [NgSelect2Component] }); })();
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NgSelect2Module, [{
        type: NgModule,
        args: [{
                imports: [
                    CommonModule
                ],
                declarations: [NgSelect2Component],
                exports: [NgSelect2Component]
            }]
    }], null, null); })();

/*
 * Public API Surface of ng-select2
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NgSelect2Component, NgSelect2Module };
//# sourceMappingURL=ng-select2.js.map
