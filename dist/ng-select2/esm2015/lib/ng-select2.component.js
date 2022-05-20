import { forwardRef, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2, ViewChild, ViewEncapsulation, ChangeDetectorRef, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
export class NgSelect2Component {
    constructor(renderer, zone, _element, cdr) {
        this.renderer = renderer;
        this.zone = zone;
        this._element = _element;
        this.cdr = cdr;
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
        this.onOpen = new EventEmitter();
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
            if (this.select2) {
                this.element.html('');
                const dataAdapter = this.select2.dataAdapter;
                dataAdapter.addOptions(dataAdapter.convertToOptions(this.data));
                const newValue = this.value;
                this.setElementValue(newValue);
                // this.valueChanged.emit(newValue);
                this.propagateChange(newValue);
                this.select2.trigger('change');
                this.cdr.detectChanges();
            }
            else {
                this.initPlugin();
                const newValue = this.value;
                this.setElementValue(newValue);
                this.valueChanged.emit(newValue);
                this.propagateChange(newValue);
            }
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
                this.onOpen.emit();
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
                this.select2 = this.element.select2(options);
                if (typeof this.value !== 'undefined') {
                    this.setElementValue(this.value);
                }
            });
        }
        else {
            this.select2 = this.element.select2(options).data('select2');
        }
        this.renderer.setProperty(this.selector.nativeElement, 'disabled', this.disabled);
        if (this.isOpen) {
            setTimeout(() => this.element.select2('open'));
        }
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
NgSelect2Component.decorators = [
    { type: Component, args: [{
                selector: 'ng-select2',
                template: "<select #selector [attr.id]=\"id\" [attr.class]=\"class\" [attr.required]=\"required\">\r\n  <ng-content select=\"option, optgroup\">\r\n  </ng-content>\r\n</select>\r\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => NgSelect2Component),
                        multi: true,
                    },
                ]
            },] }
];
NgSelect2Component.ctorParameters = () => [
    { type: Renderer2 },
    { type: NgZone },
    { type: ElementRef },
    { type: ChangeDetectorRef }
];
NgSelect2Component.propDecorators = {
    selector: [{ type: ViewChild, args: ['selector', { static: true },] }],
    data: [{ type: Input }],
    placeholder: [{ type: Input }],
    dropdownParent: [{ type: Input }],
    allowClear: [{ type: Input }],
    value: [{ type: Input }],
    width: [{ type: Input }],
    disabled: [{ type: Input }],
    id: [{ type: Input }],
    class: [{ type: Input }],
    required: [{ type: Input }],
    options: [{ type: Input }],
    valueChanged: [{ type: Output }],
    onOpen: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctc2VsZWN0Mi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy1zZWxlY3QyL3NyYy9saWIvbmctc2VsZWN0Mi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFVBQVUsRUFFVix1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFVBQVUsRUFDVixZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFJTixNQUFNLEVBQ04sU0FBUyxFQUVULFNBQVMsRUFDVCxpQkFBaUIsRUFBRSxpQkFBaUIsR0FDckMsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBbUJ6RSxNQUFNLE9BQU8sa0JBQWtCO0lBZ0Q3QixZQUFvQixRQUFtQixFQUFTLElBQVksRUFBUyxRQUFvQixFQUFVLEdBQXNCO1FBQXJHLGFBQVEsR0FBUixRQUFRLENBQVc7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQUFVLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBMUN6SCx3QkFBd0I7UUFDZixnQkFBVyxHQUFHLEVBQUUsQ0FBQztRQUVqQixtQkFBYyxHQUFHLEVBQUUsQ0FBQztRQUdwQixlQUFVLEdBQUcsS0FBSyxDQUFDO1FBUTVCLDJCQUEyQjtRQUNsQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBRTFCLDBCQUEwQjtRQUNqQixPQUFFLEdBQVcsSUFBSSxDQUFDO1FBRTNCLGlDQUFpQztRQUN4QixVQUFLLEdBQVcsSUFBSSxDQUFDO1FBRTlCLDBDQUEwQztRQUNqQyxhQUFRLEdBQVksSUFBSSxDQUFDO1FBS2xDLGdDQUFnQztRQUN0QixpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFxQixDQUFDO1FBRS9ELHNDQUFzQztRQUM1QixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQXFCLENBQUM7UUFFakQs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SW5pdCxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBDb21wb25lbnQsXHJcbiAgRG9DaGVjayxcclxuICBFbGVtZW50UmVmLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBJbnB1dCxcclxuICBOZ1pvbmUsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIE9uRGVzdHJveSxcclxuICBPbkluaXQsXHJcbiAgT3V0cHV0LFxyXG4gIFJlbmRlcmVyMixcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG4gIFZpZXdDaGlsZCxcclxuICBWaWV3RW5jYXBzdWxhdGlvbiwgQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgU2VsZWN0Mk9wdGlvbkRhdGEgfSBmcm9tICcuL25nLXNlbGVjdDIuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgT3B0aW9ucywgU2VsZWN0MiB9IGZyb20gJ3NlbGVjdDInO1xyXG5cclxuZGVjbGFyZSB2YXIgalF1ZXJ5OiBhbnk7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25nLXNlbGVjdDInLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZy1zZWxlY3QyLmNvbXBvbmVudC5odG1sJyxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAge1xyXG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcclxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdTZWxlY3QyQ29tcG9uZW50KSxcclxuICAgICAgbXVsdGk6IHRydWUsXHJcbiAgICB9LFxyXG4gIF0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ1NlbGVjdDJDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBEb0NoZWNrLCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XHJcbiAgQFZpZXdDaGlsZCgnc2VsZWN0b3InLCB7IHN0YXRpYzogdHJ1ZSB9KSBzZWxlY3RvcjogRWxlbWVudFJlZjtcclxuXHJcbiAgLy8gZGF0YSBmb3Igc2VsZWN0MiBkcm9wIGRvd25cclxuICBASW5wdXQoKSBkYXRhOiBBcnJheTxTZWxlY3QyT3B0aW9uRGF0YT47XHJcblxyXG4gIC8vIHZhbHVlIGZvciBwbGFjZWhvbGRlclxyXG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyID0gJyc7XHJcblxyXG4gIEBJbnB1dCgpIGRyb3Bkb3duUGFyZW50ID0gJyc7XHJcblxyXG5cclxuICBASW5wdXQoKSBhbGxvd0NsZWFyID0gZmFsc2U7XHJcblxyXG4gIC8vIHZhbHVlIGZvciBzZWxlY3QyXHJcbiAgQElucHV0KCkgdmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdO1xyXG5cclxuICAvLyB3aWR0aCBvZiBzZWxlY3QyIGlucHV0XHJcbiAgQElucHV0KCkgd2lkdGg6IHN0cmluZztcclxuXHJcbiAgLy8gZW5hYmxlIC8gZGlzYWJsZSBzZWxlY3QyXHJcbiAgQElucHV0KCkgZGlzYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgLy8gU3BlY2lmeSB0aGUgc2VsZWN0J3MgSURcclxuICBASW5wdXQoKSBpZDogc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgLy8gU3BlY2lmeSB0aGUgc2VsZWN0J3MgY2xhc3MoZXMpXHJcbiAgQElucHV0KCkgY2xhc3M6IHN0cmluZyA9IG51bGw7XHJcblxyXG4gIC8vIFNwZWNpZnkgdGhlIHNlbGVjdCdzIHJlcXVpcmVkIGF0dHJpYnV0ZVxyXG4gIEBJbnB1dCgpIHJlcXVpcmVkOiBib29sZWFuID0gbnVsbDtcclxuXHJcbiAgLy8gYWxsIGFkZGl0aW9uYWwgb3B0aW9uc1xyXG4gIEBJbnB1dCgpIG9wdGlvbnM6IE9wdGlvbnM7XHJcblxyXG4gIC8vIGVtaXR0ZXIgd2hlbiB2YWx1ZSBpcyBjaGFuZ2VkXHJcbiAgQE91dHB1dCgpIHZhbHVlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nIHwgc3RyaW5nW10+KCk7XHJcblxyXG4gIC8vIGVtaXR0ZXIgd2hlbiB0aGUgZHJvcGRvd24gaXMgb3BlbmVkXHJcbiAgQE91dHB1dCgpIG9uT3BlbiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nIHwgc3RyaW5nW10+KCk7XHJcblxyXG4gIHByaXZhdGUgZWxlbWVudDogYW55ID0gdW5kZWZpbmVkO1xyXG4gIHByaXZhdGUgY2hlY2sgPSBmYWxzZTtcclxuICBwcml2YXRlIGRyb3Bkb3duSWQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKyBEYXRlLm5vdygpKTtcclxuICAvLyBwcml2YXRlIHN0eWxlID0gYENTU2A7XHJcbiAgcHJpdmF0ZSBzZWxlY3QyPzogU2VsZWN0MjtcclxuICBwcml2YXRlIGlzT3BlbiA9IGZhbHNlO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHB1YmxpYyB6b25lOiBOZ1pvbmUsIHB1YmxpYyBfZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmKSB7XHJcbiAgfVxyXG5cclxuICBuZ0RvQ2hlY2soKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxlbWVudCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8vIGlmICh0aGlzLmNzc0ltcG9ydCkge1xyXG4gICAgLy8gICBjb25zdCBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcclxuICAgIC8vICAgY29uc3QgbGluazogYW55ID0gaGVhZC5jaGlsZHJlbltoZWFkLmNoaWxkcmVuLmxlbmd0aCAtIDFdO1xyXG5cclxuICAgIC8vICAgaWYgKCFsaW5rLnZlcnNpb24pIHtcclxuICAgIC8vICAgICBjb25zdCBuZXdMaW5rID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KGhlYWQsICdzdHlsZScpO1xyXG4gICAgLy8gICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudFByb3BlcnR5KG5ld0xpbmssICd0eXBlJywgJ3RleHQvY3NzJyk7XHJcbiAgICAvLyAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50UHJvcGVydHkobmV3TGluaywgJ3ZlcnNpb24nLCAnc2VsZWN0MicpO1xyXG4gICAgLy8gICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudFByb3BlcnR5KG5ld0xpbmssICdpbm5lckhUTUwnLCB0aGlzLnN0eWxlKTtcclxuICAgIC8vICAgfVxyXG4gICAgLy8gfVxyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xyXG5cclxuICAgIGlmICghdGhpcy5lbGVtZW50KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hhbmdlc1snZGF0YSddICYmIEpTT04uc3RyaW5naWZ5KGNoYW5nZXNbJ2RhdGEnXS5wcmV2aW91c1ZhbHVlKSAhPT0gSlNPTi5zdHJpbmdpZnkoY2hhbmdlc1snZGF0YSddLmN1cnJlbnRWYWx1ZSkpIHtcclxuICAgICAgaWYgKHRoaXMuc2VsZWN0Mikge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5odG1sKCcnKTtcclxuICAgICAgICBjb25zdCBkYXRhQWRhcHRlciA9ICh0aGlzLnNlbGVjdDIgYXMgYW55KS5kYXRhQWRhcHRlcjtcclxuICAgICAgICBkYXRhQWRhcHRlci5hZGRPcHRpb25zKGRhdGFBZGFwdGVyLmNvbnZlcnRUb09wdGlvbnModGhpcy5kYXRhKSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgIC8vIHRoaXMudmFsdWVDaGFuZ2VkLmVtaXQobmV3VmFsdWUpO1xyXG4gICAgICAgIHRoaXMucHJvcGFnYXRlQ2hhbmdlKG5ld1ZhbHVlKTtcclxuICAgICAgICAodGhpcy5zZWxlY3QyIGFzIGFueSkudHJpZ2dlcignY2hhbmdlJyk7XHJcbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuaW5pdFBsdWdpbigpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdWYWx1ZTogc3RyaW5nIHwgc3RyaW5nW10gPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIHRoaXMuc2V0RWxlbWVudFZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlZC5lbWl0KG5ld1ZhbHVlKTtcclxuICAgICAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZShuZXdWYWx1ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hhbmdlc1sndmFsdWUnXSAmJiBjaGFuZ2VzWyd2YWx1ZSddLnByZXZpb3VzVmFsdWUgIT09IGNoYW5nZXNbJ3ZhbHVlJ10uY3VycmVudFZhbHVlKSB7XHJcblxyXG4gICAgICBjb25zdCBuZXdWYWx1ZTogc3RyaW5nID0gY2hhbmdlc1sndmFsdWUnXS5jdXJyZW50VmFsdWU7XHJcblxyXG4gICAgICB0aGlzLnNldEVsZW1lbnRWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgIHRoaXMudmFsdWVDaGFuZ2VkLmVtaXQobmV3VmFsdWUpO1xyXG4gICAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZShuZXdWYWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYW5nZXNbJ2Rpc2FibGVkJ10gJiYgY2hhbmdlc1snZGlzYWJsZWQnXS5wcmV2aW91c1ZhbHVlICE9PSBjaGFuZ2VzWydkaXNhYmxlZCddLmN1cnJlbnRWYWx1ZSkge1xyXG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuc2VsZWN0b3IubmF0aXZlRWxlbWVudCwgJ2Rpc2FibGVkJywgdGhpcy5kaXNhYmxlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYW5nZXNbJ3BsYWNlaG9sZGVyJ10gJiYgY2hhbmdlc1sncGxhY2Vob2xkZXInXS5wcmV2aW91c1ZhbHVlICE9PSBjaGFuZ2VzWydwbGFjZWhvbGRlciddLmN1cnJlbnRWYWx1ZSkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQuZGF0YSgnc2VsZWN0MicpLiRjb250YWluZXIuZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19wbGFjZWhvbGRlcicpLnRleHQodGhpcy5wbGFjZWhvbGRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYW5nZXNbJ2Ryb3Bkb3duUGFyZW50J10gJiYgY2hhbmdlc1snZHJvcGRvd25QYXJlbnQnXS5wcmV2aW91c1ZhbHVlICE9PSBjaGFuZ2VzWydkcm9wZG93blBhcmVudCddLmN1cnJlbnRWYWx1ZSkge1xyXG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLnNlbGVjdG9yLm5hdGl2ZUVsZW1lbnQsICdkYXRhLWRyb3Bkb3duUGFyZW50JywgJyMnICsgdGhpcy5kcm9wZG93blBhcmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYW5nZXNbJ2FsbG93Q2xlYXInXSAmJiBjaGFuZ2VzWydhbGxvd0NsZWFyJ10ucHJldmlvdXNWYWx1ZSAhPT0gY2hhbmdlc1snYWxsb3dDbGVhciddLmN1cnJlbnRWYWx1ZSkge1xyXG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLnNlbGVjdG9yLm5hdGl2ZUVsZW1lbnQsICdkYXRhLWFsbG93LWNsZWFyJywgdGhpcy5hbGxvd0NsZWFyLnRvU3RyaW5nKCkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgdGhpcy5lbGVtZW50ID0galF1ZXJ5KHRoaXMuc2VsZWN0b3IubmF0aXZlRWxlbWVudCk7XHJcbiAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLnNlbGVjdG9yLm5hdGl2ZUVsZW1lbnQsICdkYXRhLWRyb3Bkb3duUGFyZW50JywgJyMnICsgdGhpcy5kcm9wZG93blBhcmVudCk7XHJcbiAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLnNlbGVjdG9yLm5hdGl2ZUVsZW1lbnQsICdkYXRhLWFsbG93LWNsZWFyJywgdGhpcy5hbGxvd0NsZWFyLnRvU3RyaW5nKCkpO1xyXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5zZWxlY3Rvci5uYXRpdmVFbGVtZW50KTtcclxuXHJcbiAgICB0aGlzLmluaXRQbHVnaW4oKTtcclxuXHJcbiAgICBpZiAodGhpcy52YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMudmFsdWUgIT09IG51bGwpIHtcclxuICAgICAgdGhpcy5zZXRFbGVtZW50VmFsdWUodGhpcy52YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lbGVtZW50Lm9uKCdzZWxlY3QyOnNlbGVjdCBzZWxlY3QyOnVuc2VsZWN0IGNoYW5nZScsIChlOiBhbnkpID0+IHtcclxuICAgICAgLy8gY29uc3QgbmV3VmFsdWU6IHN0cmluZyA9IChlLnR5cGUgPT09ICdzZWxlY3QyOnVuc2VsZWN0JykgPyAnJyA6IHRoaXMuZWxlbWVudC52YWwoKTtcclxuICAgICAgY29uc3QgbmV3VmFsdWUgPSB0aGlzLmVsZW1lbnQudmFsKCk7XHJcblxyXG4gICAgICB0aGlzLnZhbHVlQ2hhbmdlZC5lbWl0KG5ld1ZhbHVlKTtcclxuICAgICAgaWYgKGUudHlwZSAhPT0gJ2NoYW5nZScpIHtcclxuICAgICAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZShuZXdWYWx1ZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBIYWNreSBmaXggZm9yIGEgYnVnIGluIHNlbGVjdDIgd2l0aCBqUXVlcnkgMy42LjAncyBuZXcgbmVzdGVkLWZvY3VzIFwicHJvdGVjdGlvblwiXHJcbiAgICAgKiBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9zZWxlY3QyL3NlbGVjdDIvaXNzdWVzLzU5OTNcclxuICAgICAqIHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnkvaXNzdWVzLzQzODJcclxuICAgICAqXHJcbiAgICAgKiBUT0RPOiBSZWNoZWNrIHdpdGggdGhlIHNlbGVjdDIgR0ggaXNzdWUgYW5kIHJlbW92ZSBvbmNlIHRoaXMgaXMgZml4ZWQgb24gdGhlaXIgc2lkZVxyXG4gICAgICovXHJcbiAgICB0aGlzLmVsZW1lbnQub24oJ3NlbGVjdDI6b3BlbicsICgpID0+IHtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihgLiR7dGhpcy5nZXREcm9wZG93bklkQ2xhc3MoKX0gLnNlbGVjdDItc2VhcmNoX19maWVsZGApLmZvY3VzKCk7XHJcbiAgICAgIGlmICghdGhpcy5pc09wZW4pIHtcclxuICAgICAgICB0aGlzLm9uT3Blbi5lbWl0KCk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLmVsZW1lbnQub24oJ3NlbGVjdDI6Y2xvc2UnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgaWYgKHRoaXMuZWxlbWVudCkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQub2ZmKCdzZWxlY3QyOnNlbGVjdCcpO1xyXG4gICAgICB0aGlzLmVsZW1lbnQub2ZmKCdzZWxlY3QyOm9wZW4nKTtcclxuICAgICAgdGhpcy5lbGVtZW50Lm9mZignc2VsZWN0MjpjbG9zZScpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbml0UGx1Z2luKCkge1xyXG4gICAgaWYgKCF0aGlzLmVsZW1lbnQuc2VsZWN0Mikge1xyXG4gICAgICBpZiAoIXRoaXMuY2hlY2spIHtcclxuICAgICAgICB0aGlzLmNoZWNrID0gdHJ1ZTtcclxuICAgICAgICBjb25zb2xlLmxvZygnUGxlYXNlIGFkZCBTZWxlY3QyIGxpYnJhcnkgKGpzIGZpbGUpIHRvIHRoZSBwcm9qZWN0LicgK1xyXG4gICAgICAgICAgJ1lvdSBjYW4gZG93bmxvYWQgaXQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2VsZWN0Mi9zZWxlY3QyL3RyZWUvbWFzdGVyL2Rpc3QvanMuJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBJZiBzZWxlY3QyIGFscmVhZHkgaW5pdGlhbGl6ZWQgcmVtb3ZlIGhpbSBhbmQgcmVtb3ZlIGFsbCB0YWdzIGluc2lkZVxyXG4gICAgaWYgKHRoaXMuZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpID09PSB0cnVlKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5zZWxlY3QyKCdkZXN0cm95Jyk7XHJcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5zZWxlY3Rvci5uYXRpdmVFbGVtZW50LCAnaW5uZXJIVE1MJywgJycpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG9wdGlvbnM6IE9wdGlvbnMgPSB7XHJcbiAgICAgIGRhdGE6IHRoaXMuZGF0YSxcclxuICAgICAgd2lkdGg6ICh0aGlzLndpZHRoKSA/IHRoaXMud2lkdGggOiAncmVzb2x2ZScsXHJcbiAgICAgIHBsYWNlaG9sZGVyOiB0aGlzLnBsYWNlaG9sZGVyXHJcbiAgICB9O1xyXG5cclxuICAgIGlmICh0aGlzLmRyb3Bkb3duUGFyZW50KSB7XHJcbiAgICAgIG9wdGlvbnMuZHJvcGRvd25QYXJlbnQgPSBqUXVlcnkoJyMnICsgdGhpcy5kcm9wZG93blBhcmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgT2JqZWN0LmFzc2lnbihvcHRpb25zLCB0aGlzLm9wdGlvbnMpO1xyXG5cclxuICAgIGNvbnN0IGRyb3Bkb3duQ3NzQ2xhc3MgPSB0aGlzLmdldERyb3Bkb3duSWRDbGFzcygpO1xyXG4gICAgb3B0aW9ucy5kcm9wZG93bkNzc0NsYXNzID0gb3B0aW9ucy5kcm9wZG93bkNzc0NsYXNzID8gb3B0aW9ucy5kcm9wZG93bkNzc0NsYXNzICs9IGAgJHtkcm9wZG93bkNzc0NsYXNzfWAgOiBkcm9wZG93bkNzc0NsYXNzO1xyXG5cclxuICAgIGlmIChvcHRpb25zLm1hdGNoZXIpIHtcclxuICAgICAgalF1ZXJ5LmZuLnNlbGVjdDIuYW1kLnJlcXVpcmUoWydzZWxlY3QyL2NvbXBhdC9tYXRjaGVyJ10sIChvbGRNYXRjaGVyOiBhbnkpID0+IHtcclxuICAgICAgICBvcHRpb25zLm1hdGNoZXIgPSBvbGRNYXRjaGVyKG9wdGlvbnMubWF0Y2hlcik7XHJcbiAgICAgICAgdGhpcy5zZWxlY3QyID0gdGhpcy5lbGVtZW50LnNlbGVjdDIob3B0aW9ucyk7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy52YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIHRoaXMuc2V0RWxlbWVudFZhbHVlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNlbGVjdDIgPSB0aGlzLmVsZW1lbnQuc2VsZWN0MihvcHRpb25zKS5kYXRhKCdzZWxlY3QyJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLnNlbGVjdG9yLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsIHRoaXMuZGlzYWJsZWQpO1xyXG4gICAgaWYgKHRoaXMuaXNPcGVuKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lbGVtZW50LnNlbGVjdDIoJ29wZW4nKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldEVsZW1lbnRWYWx1ZShuZXdWYWx1ZTogc3RyaW5nIHwgc3RyaW5nW10pIHtcclxuXHJcbiAgICAvLyB0aGlzLnpvbmUucnVuKCgpID0+IHtcclxuXHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShuZXdWYWx1ZSkpIHtcclxuXHJcbiAgICAgIGZvciAoY29uc3Qgb3B0aW9uIG9mIHRoaXMuc2VsZWN0b3IubmF0aXZlRWxlbWVudC5vcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eShvcHRpb24sICdzZWxlY3RlZCcsIChuZXdWYWx1ZS5pbmRleE9mKG9wdGlvbi52YWx1ZSkgPiAtMSkpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuc2VsZWN0b3IubmF0aXZlRWxlbWVudCwgJ3ZhbHVlJywgbmV3VmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmVsZW1lbnQpIHtcclxuICAgICAgdGhpcy5lbGVtZW50LnRyaWdnZXIoJ2NoYW5nZS5zZWxlY3QyJyk7XHJcbiAgICB9XHJcbiAgICAvLyB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0RHJvcGRvd25JZENsYXNzKCkge1xyXG4gICAgcmV0dXJuIGBzZWxlY3QyLWRyb3Bkb3duLWlkLSR7dGhpcy5kcm9wZG93bklkfWA7XHJcbiAgfVxyXG5cclxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcclxuXHJcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgIHRoaXMuc2V0RWxlbWVudFZhbHVlKHZhbHVlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb3BhZ2F0ZUNoYW5nZSA9ICh2YWx1ZTogc3RyaW5nIHwgc3RyaW5nW10pID0+IHsgfTtcclxuXHJcbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KSB7XHJcbiAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZSA9IGZuO1xyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJPblRvdWNoZWQoKSB7XHJcbiAgfVxyXG5cclxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xyXG4gICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLnNlbGVjdG9yLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsIHRoaXMuZGlzYWJsZWQpO1xyXG4gIH1cclxufVxyXG4iXX0=