import { forwardRef, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
export class NgSelect2Component {
    // private style = `CSS`;
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
        this.element = undefined;
        this.check = false;
        this.dropdownId = Math.floor(Math.random() + Date.now());
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
        });
    }
    ngOnDestroy() {
        if (this.element) {
            this.element.off('select2:select');
            this.element.off('select2:open');
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
                this.element.select2(options);
                if (typeof this.value !== 'undefined') {
                    this.setElementValue(this.value);
                }
            });
        }
        else {
            this.element.select2(options);
        }
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
NgSelect2Component.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: NgSelect2Component, deps: [{ token: i0.Renderer2 }, { token: i0.NgZone }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
NgSelect2Component.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.2", type: NgSelect2Component, selector: "ng-select2", inputs: { data: "data", placeholder: "placeholder", dropdownParent: "dropdownParent", allowClear: "allowClear", value: "value", width: "width", disabled: "disabled", id: "id", class: "class", required: "required", options: "options" }, outputs: { valueChanged: "valueChanged" }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NgSelect2Component),
            multi: true,
        },
    ], viewQueries: [{ propertyName: "selector", first: true, predicate: ["selector"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: "<select #selector [attr.id]=\"id\" [attr.class]=\"class\" [attr.required]=\"required\">\r\n  <ng-content select=\"option, optgroup\">\r\n  </ng-content>\r\n</select>\r\n", changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: NgSelect2Component, decorators: [{
            type: Component,
            args: [{ selector: 'ng-select2', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => NgSelect2Component),
                            multi: true,
                        },
                    ], template: "<select #selector [attr.id]=\"id\" [attr.class]=\"class\" [attr.required]=\"required\">\r\n  <ng-content select=\"option, optgroup\">\r\n  </ng-content>\r\n</select>\r\n" }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.NgZone }, { type: i0.ElementRef }]; }, propDecorators: { selector: [{
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
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctc2VsZWN0Mi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy1zZWxlY3QyL3NyYy9saWIvbmctc2VsZWN0Mi5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy1zZWxlY3QyL3NyYy9saWIvbmctc2VsZWN0Mi5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsVUFBVSxFQUVWLHVCQUF1QixFQUN2QixTQUFTLEVBR1QsWUFBWSxFQUNaLEtBQUssRUFLTCxNQUFNLEVBR04sU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7O0FBbUJ6RSxNQUFNLE9BQU8sa0JBQWtCO0lBeUM3Qix5QkFBeUI7SUFFekIsWUFBb0IsUUFBbUIsRUFBUyxJQUFZLEVBQVMsUUFBb0I7UUFBckUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFTLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFZO1FBckN6Rix3QkFBd0I7UUFDZixnQkFBVyxHQUFHLEVBQUUsQ0FBQztRQUVqQixtQkFBYyxHQUFHLEVBQUUsQ0FBQztRQUdwQixlQUFVLEdBQUcsS0FBSyxDQUFDO1FBUTVCLDJCQUEyQjtRQUNsQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBRTFCLDBCQUEwQjtRQUNqQixPQUFFLEdBQVcsSUFBSSxDQUFDO1FBRTNCLGlDQUFpQztRQUN4QixVQUFLLEdBQVcsSUFBSSxDQUFDO1FBRTlCLDBDQUEwQztRQUNqQyxhQUFRLEdBQVksSUFBSSxDQUFDO1FBS2xDLGdDQUFnQztRQUN0QixpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFxQixDQUFDO1FBRXZELFlBQU8sR0FBUSxTQUFTLENBQUM7UUFDekIsVUFBSyxHQUFHLEtBQUssQ0FBQztR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S0FBSztnQkFHSSxZQUFZO3NCQUFyQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBmb3J3YXJkUmVmLFxyXG4gIEFmdGVyVmlld0luaXQsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgQ29tcG9uZW50LFxyXG4gIERvQ2hlY2ssXHJcbiAgRWxlbWVudFJlZixcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgSW5wdXQsXHJcbiAgTmdab25lLFxyXG4gIE9uQ2hhbmdlcyxcclxuICBPbkRlc3Ryb3ksXHJcbiAgT25Jbml0LFxyXG4gIE91dHB1dCxcclxuICBSZW5kZXJlcjIsXHJcbiAgU2ltcGxlQ2hhbmdlcyxcclxuICBWaWV3Q2hpbGQsXHJcbiAgVmlld0VuY2Fwc3VsYXRpb24sXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgU2VsZWN0Mk9wdGlvbkRhdGEgfSBmcm9tICcuL25nLXNlbGVjdDIuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgT3B0aW9ucyB9IGZyb20gJ3NlbGVjdDInO1xyXG5cclxuZGVjbGFyZSB2YXIgalF1ZXJ5OiBhbnk7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25nLXNlbGVjdDInLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZy1zZWxlY3QyLmNvbXBvbmVudC5odG1sJyxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAge1xyXG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcclxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdTZWxlY3QyQ29tcG9uZW50KSxcclxuICAgICAgbXVsdGk6IHRydWUsXHJcbiAgICB9LFxyXG4gIF0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ1NlbGVjdDJDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBEb0NoZWNrLCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XHJcbiAgQFZpZXdDaGlsZCgnc2VsZWN0b3InLCB7IHN0YXRpYzogdHJ1ZSB9KSBzZWxlY3RvcjogRWxlbWVudFJlZjtcclxuXHJcbiAgLy8gZGF0YSBmb3Igc2VsZWN0MiBkcm9wIGRvd25cclxuICBASW5wdXQoKSBkYXRhOiBBcnJheTxTZWxlY3QyT3B0aW9uRGF0YT47XHJcblxyXG4gIC8vIHZhbHVlIGZvciBwbGFjZWhvbGRlclxyXG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyID0gJyc7XHJcblxyXG4gIEBJbnB1dCgpIGRyb3Bkb3duUGFyZW50ID0gJyc7XHJcblxyXG5cclxuICBASW5wdXQoKSBhbGxvd0NsZWFyID0gZmFsc2U7XHJcblxyXG4gIC8vIHZhbHVlIGZvciBzZWxlY3QyXHJcbiAgQElucHV0KCkgdmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdO1xyXG5cclxuICAvLyB3aWR0aCBvZiBzZWxlY3QyIGlucHV0XHJcbiAgQElucHV0KCkgd2lkdGg6IHN0cmluZztcclxuXHJcbiAgLy8gZW5hYmxlIC8gZGlzYWJsZSBzZWxlY3QyXHJcbiAgQElucHV0KCkgZGlzYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgLy8gU3BlY2lmeSB0aGUgc2VsZWN0J3MgSURcclxuICBASW5wdXQoKSBpZDogc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgLy8gU3BlY2lmeSB0aGUgc2VsZWN0J3MgY2xhc3MoZXMpXHJcbiAgQElucHV0KCkgY2xhc3M6IHN0cmluZyA9IG51bGw7XHJcblxyXG4gIC8vIFNwZWNpZnkgdGhlIHNlbGVjdCdzIHJlcXVpcmVkIGF0dHJpYnV0ZVxyXG4gIEBJbnB1dCgpIHJlcXVpcmVkOiBib29sZWFuID0gbnVsbDtcclxuXHJcbiAgLy8gYWxsIGFkZGl0aW9uYWwgb3B0aW9uc1xyXG4gIEBJbnB1dCgpIG9wdGlvbnM6IE9wdGlvbnM7XHJcblxyXG4gIC8vIGVtaXR0ZXIgd2hlbiB2YWx1ZSBpcyBjaGFuZ2VkXHJcbiAgQE91dHB1dCgpIHZhbHVlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nIHwgc3RyaW5nW10+KCk7XHJcblxyXG4gIHByaXZhdGUgZWxlbWVudDogYW55ID0gdW5kZWZpbmVkO1xyXG4gIHByaXZhdGUgY2hlY2sgPSBmYWxzZTtcclxuICBwcml2YXRlIGRyb3Bkb3duSWQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKyBEYXRlLm5vdygpKTtcclxuICAvLyBwcml2YXRlIHN0eWxlID0gYENTU2A7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHVibGljIHpvbmU6IE5nWm9uZSwgcHVibGljIF9lbGVtZW50OiBFbGVtZW50UmVmKSB7XHJcbiAgfVxyXG5cclxuICBuZ0RvQ2hlY2soKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxlbWVudCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8vIGlmICh0aGlzLmNzc0ltcG9ydCkge1xyXG4gICAgLy8gICBjb25zdCBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcclxuICAgIC8vICAgY29uc3QgbGluazogYW55ID0gaGVhZC5jaGlsZHJlbltoZWFkLmNoaWxkcmVuLmxlbmd0aCAtIDFdO1xyXG5cclxuICAgIC8vICAgaWYgKCFsaW5rLnZlcnNpb24pIHtcclxuICAgIC8vICAgICBjb25zdCBuZXdMaW5rID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KGhlYWQsICdzdHlsZScpO1xyXG4gICAgLy8gICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudFByb3BlcnR5KG5ld0xpbmssICd0eXBlJywgJ3RleHQvY3NzJyk7XHJcbiAgICAvLyAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50UHJvcGVydHkobmV3TGluaywgJ3ZlcnNpb24nLCAnc2VsZWN0MicpO1xyXG4gICAgLy8gICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudFByb3BlcnR5KG5ld0xpbmssICdpbm5lckhUTUwnLCB0aGlzLnN0eWxlKTtcclxuICAgIC8vICAgfVxyXG4gICAgLy8gfVxyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xyXG5cclxuICAgIGlmICghdGhpcy5lbGVtZW50KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hhbmdlc1snZGF0YSddICYmIEpTT04uc3RyaW5naWZ5KGNoYW5nZXNbJ2RhdGEnXS5wcmV2aW91c1ZhbHVlKSAhPT0gSlNPTi5zdHJpbmdpZnkoY2hhbmdlc1snZGF0YSddLmN1cnJlbnRWYWx1ZSkpIHtcclxuICAgICAgdGhpcy5pbml0UGx1Z2luKCk7XHJcblxyXG4gICAgICBjb25zdCBuZXdWYWx1ZTogc3RyaW5nIHwgc3RyaW5nW10gPSB0aGlzLnZhbHVlO1xyXG4gICAgICB0aGlzLnNldEVsZW1lbnRWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgIHRoaXMudmFsdWVDaGFuZ2VkLmVtaXQobmV3VmFsdWUpO1xyXG4gICAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZShuZXdWYWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYW5nZXNbJ3ZhbHVlJ10gJiYgY2hhbmdlc1sndmFsdWUnXS5wcmV2aW91c1ZhbHVlICE9PSBjaGFuZ2VzWyd2YWx1ZSddLmN1cnJlbnRWYWx1ZSkge1xyXG5cclxuICAgICAgY29uc3QgbmV3VmFsdWU6IHN0cmluZyA9IGNoYW5nZXNbJ3ZhbHVlJ10uY3VycmVudFZhbHVlO1xyXG5cclxuICAgICAgdGhpcy5zZXRFbGVtZW50VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICB0aGlzLnZhbHVlQ2hhbmdlZC5lbWl0KG5ld1ZhbHVlKTtcclxuICAgICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UobmV3VmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFuZ2VzWydkaXNhYmxlZCddICYmIGNoYW5nZXNbJ2Rpc2FibGVkJ10ucHJldmlvdXNWYWx1ZSAhPT0gY2hhbmdlc1snZGlzYWJsZWQnXS5jdXJyZW50VmFsdWUpIHtcclxuICAgICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLnNlbGVjdG9yLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsIHRoaXMuZGlzYWJsZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFuZ2VzWydwbGFjZWhvbGRlciddICYmIGNoYW5nZXNbJ3BsYWNlaG9sZGVyJ10ucHJldmlvdXNWYWx1ZSAhPT0gY2hhbmdlc1sncGxhY2Vob2xkZXInXS5jdXJyZW50VmFsdWUpIHtcclxuICAgICAgdGhpcy5lbGVtZW50LmRhdGEoJ3NlbGVjdDInKS4kY29udGFpbmVyLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcGxhY2Vob2xkZXInKS50ZXh0KHRoaXMucGxhY2Vob2xkZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFuZ2VzWydkcm9wZG93blBhcmVudCddICYmIGNoYW5nZXNbJ2Ryb3Bkb3duUGFyZW50J10ucHJldmlvdXNWYWx1ZSAhPT0gY2hhbmdlc1snZHJvcGRvd25QYXJlbnQnXS5jdXJyZW50VmFsdWUpIHtcclxuICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5zZWxlY3Rvci5uYXRpdmVFbGVtZW50LCAnZGF0YS1kcm9wZG93blBhcmVudCcsICcjJyArIHRoaXMuZHJvcGRvd25QYXJlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFuZ2VzWydhbGxvd0NsZWFyJ10gJiYgY2hhbmdlc1snYWxsb3dDbGVhciddLnByZXZpb3VzVmFsdWUgIT09IGNoYW5nZXNbJ2FsbG93Q2xlYXInXS5jdXJyZW50VmFsdWUpIHtcclxuICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5zZWxlY3Rvci5uYXRpdmVFbGVtZW50LCAnZGF0YS1hbGxvdy1jbGVhcicsIHRoaXMuYWxsb3dDbGVhci50b1N0cmluZygpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIHRoaXMuZWxlbWVudCA9IGpRdWVyeSh0aGlzLnNlbGVjdG9yLm5hdGl2ZUVsZW1lbnQpO1xyXG4gICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5zZWxlY3Rvci5uYXRpdmVFbGVtZW50LCAnZGF0YS1kcm9wZG93blBhcmVudCcsICcjJyArIHRoaXMuZHJvcGRvd25QYXJlbnQpO1xyXG4gICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5zZWxlY3Rvci5uYXRpdmVFbGVtZW50LCAnZGF0YS1hbGxvdy1jbGVhcicsIHRoaXMuYWxsb3dDbGVhci50b1N0cmluZygpKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc2VsZWN0b3IubmF0aXZlRWxlbWVudCk7XHJcblxyXG4gICAgdGhpcy5pbml0UGx1Z2luKCk7XHJcblxyXG4gICAgaWYgKHRoaXMudmFsdWUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgIHRoaXMuc2V0RWxlbWVudFZhbHVlKHRoaXMudmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZWxlbWVudC5vbignc2VsZWN0MjpzZWxlY3Qgc2VsZWN0Mjp1bnNlbGVjdCBjaGFuZ2UnLCAoZTogYW55KSA9PiB7XHJcbiAgICAgIC8vIGNvbnN0IG5ld1ZhbHVlOiBzdHJpbmcgPSAoZS50eXBlID09PSAnc2VsZWN0Mjp1bnNlbGVjdCcpID8gJycgOiB0aGlzLmVsZW1lbnQudmFsKCk7XHJcbiAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy5lbGVtZW50LnZhbCgpO1xyXG5cclxuICAgICAgdGhpcy52YWx1ZUNoYW5nZWQuZW1pdChuZXdWYWx1ZSk7XHJcbiAgICAgIGlmIChlLnR5cGUgIT09ICdjaGFuZ2UnKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UobmV3VmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogSGFja3kgZml4IGZvciBhIGJ1ZyBpbiBzZWxlY3QyIHdpdGggalF1ZXJ5IDMuNi4wJ3MgbmV3IG5lc3RlZC1mb2N1cyBcInByb3RlY3Rpb25cIlxyXG4gICAgICogc2VlOiBodHRwczovL2dpdGh1Yi5jb20vc2VsZWN0Mi9zZWxlY3QyL2lzc3Vlcy81OTkzXHJcbiAgICAgKiBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvanF1ZXJ5L2lzc3Vlcy80MzgyXHJcbiAgICAgKlxyXG4gICAgICogVE9ETzogUmVjaGVjayB3aXRoIHRoZSBzZWxlY3QyIEdIIGlzc3VlIGFuZCByZW1vdmUgb25jZSB0aGlzIGlzIGZpeGVkIG9uIHRoZWlyIHNpZGVcclxuICAgICAqL1xyXG4gICAgdGhpcy5lbGVtZW50Lm9uKCdzZWxlY3QyOm9wZW4nLCAoKSA9PiB7XHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oYC4ke3RoaXMuZ2V0RHJvcGRvd25JZENsYXNzKCl9IC5zZWxlY3QyLXNlYXJjaF9fZmllbGRgKS5mb2N1cygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIGlmICh0aGlzLmVsZW1lbnQpIHtcclxuICAgICAgdGhpcy5lbGVtZW50Lm9mZignc2VsZWN0MjpzZWxlY3QnKTtcclxuICAgICAgdGhpcy5lbGVtZW50Lm9mZignc2VsZWN0MjpvcGVuJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXRQbHVnaW4oKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxlbWVudC5zZWxlY3QyKSB7XHJcbiAgICAgIGlmICghdGhpcy5jaGVjaykge1xyXG4gICAgICAgIHRoaXMuY2hlY2sgPSB0cnVlO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdQbGVhc2UgYWRkIFNlbGVjdDIgbGlicmFyeSAoanMgZmlsZSkgdG8gdGhlIHByb2plY3QuJyArXHJcbiAgICAgICAgICAnWW91IGNhbiBkb3dubG9hZCBpdCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zZWxlY3QyL3NlbGVjdDIvdHJlZS9tYXN0ZXIvZGlzdC9qcy4nKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIHNlbGVjdDIgYWxyZWFkeSBpbml0aWFsaXplZCByZW1vdmUgaGltIGFuZCByZW1vdmUgYWxsIHRhZ3MgaW5zaWRlXHJcbiAgICBpZiAodGhpcy5lbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykgPT09IHRydWUpIHtcclxuICAgICAgdGhpcy5lbGVtZW50LnNlbGVjdDIoJ2Rlc3Ryb3knKTtcclxuICAgICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLnNlbGVjdG9yLm5hdGl2ZUVsZW1lbnQsICdpbm5lckhUTUwnLCAnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgb3B0aW9uczogT3B0aW9ucyA9IHtcclxuICAgICAgZGF0YTogdGhpcy5kYXRhLFxyXG4gICAgICB3aWR0aDogKHRoaXMud2lkdGgpID8gdGhpcy53aWR0aCA6ICdyZXNvbHZlJyxcclxuICAgICAgcGxhY2Vob2xkZXI6IHRoaXMucGxhY2Vob2xkZXJcclxuICAgIH07XHJcblxyXG4gICAgaWYgKHRoaXMuZHJvcGRvd25QYXJlbnQpIHtcclxuICAgICAgb3B0aW9ucy5kcm9wZG93blBhcmVudCA9IGpRdWVyeSgnIycgKyB0aGlzLmRyb3Bkb3duUGFyZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBPYmplY3QuYXNzaWduKG9wdGlvbnMsIHRoaXMub3B0aW9ucyk7XHJcblxyXG4gICAgY29uc3QgZHJvcGRvd25Dc3NDbGFzcyA9IHRoaXMuZ2V0RHJvcGRvd25JZENsYXNzKCk7XHJcbiAgICBvcHRpb25zLmRyb3Bkb3duQ3NzQ2xhc3MgPSBvcHRpb25zLmRyb3Bkb3duQ3NzQ2xhc3MgPyBvcHRpb25zLmRyb3Bkb3duQ3NzQ2xhc3MgKz0gYCAke2Ryb3Bkb3duQ3NzQ2xhc3N9YCA6IGRyb3Bkb3duQ3NzQ2xhc3M7XHJcblxyXG4gICAgaWYgKG9wdGlvbnMubWF0Y2hlcikge1xyXG4gICAgICBqUXVlcnkuZm4uc2VsZWN0Mi5hbWQucmVxdWlyZShbJ3NlbGVjdDIvY29tcGF0L21hdGNoZXInXSwgKG9sZE1hdGNoZXI6IGFueSkgPT4ge1xyXG4gICAgICAgIG9wdGlvbnMubWF0Y2hlciA9IG9sZE1hdGNoZXIob3B0aW9ucy5tYXRjaGVyKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc2VsZWN0MihvcHRpb25zKTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnZhbHVlICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgdGhpcy5zZXRFbGVtZW50VmFsdWUodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5zZWxlY3QyKG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5zZWxlY3Rvci5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCB0aGlzLmRpc2FibGVkKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0RWxlbWVudFZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xyXG5cclxuICAgIC8vIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xyXG5cclxuICAgIGlmIChBcnJheS5pc0FycmF5KG5ld1ZhbHVlKSkge1xyXG5cclxuICAgICAgZm9yIChjb25zdCBvcHRpb24gb2YgdGhpcy5zZWxlY3Rvci5uYXRpdmVFbGVtZW50Lm9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KG9wdGlvbiwgJ3NlbGVjdGVkJywgKG5ld1ZhbHVlLmluZGV4T2Yob3B0aW9uLnZhbHVlKSA+IC0xKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5zZWxlY3Rvci5uYXRpdmVFbGVtZW50LCAndmFsdWUnLCBuZXdWYWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZWxlbWVudCkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQudHJpZ2dlcignY2hhbmdlLnNlbGVjdDInKTtcclxuICAgIH1cclxuICAgIC8vIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXREcm9wZG93bklkQ2xhc3MoKSB7XHJcbiAgICByZXR1cm4gYHNlbGVjdDItZHJvcGRvd24taWQtJHt0aGlzLmRyb3Bkb3duSWR9YDtcclxuICB9XHJcblxyXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSkge1xyXG5cclxuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgdGhpcy5zZXRFbGVtZW50VmFsdWUodmFsdWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvcGFnYXRlQ2hhbmdlID0gKHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkgPT4geyB9O1xyXG5cclxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpIHtcclxuICAgIHRoaXMucHJvcGFnYXRlQ2hhbmdlID0gZm47XHJcbiAgfVxyXG5cclxuICByZWdpc3Rlck9uVG91Y2hlZCgpIHtcclxuICB9XHJcblxyXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xyXG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XHJcbiAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuc2VsZWN0b3IubmF0aXZlRWxlbWVudCwgJ2Rpc2FibGVkJywgdGhpcy5kaXNhYmxlZCk7XHJcbiAgfVxyXG59XHJcbiIsIjxzZWxlY3QgI3NlbGVjdG9yIFthdHRyLmlkXT1cImlkXCIgW2F0dHIuY2xhc3NdPVwiY2xhc3NcIiBbYXR0ci5yZXF1aXJlZF09XCJyZXF1aXJlZFwiPlxyXG4gIDxuZy1jb250ZW50IHNlbGVjdD1cIm9wdGlvbiwgb3B0Z3JvdXBcIj5cclxuICA8L25nLWNvbnRlbnQ+XHJcbjwvc2VsZWN0PlxyXG4iXX0=