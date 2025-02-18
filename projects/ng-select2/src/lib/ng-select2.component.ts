import {
  forwardRef,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Select2OptionData } from './ng-select2.interface';
import { Options, Select2 } from 'select2';

declare var jQuery: any;

@Component({
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
})
export class NgSelect2Component implements AfterViewInit, OnChanges, OnDestroy, OnInit, DoCheck, ControlValueAccessor {
  @ViewChild('selector', { static: true }) selector: ElementRef;

  // data for select2 drop down
  @Input() data: Array<Select2OptionData>;

  // value for placeholder
  @Input() placeholder = '';

  @Input() dropdownParent = '';


  @Input() allowClear = false;

  // value for select2
  @Input() value: string | string[];

  // width of select2 input
  @Input() width: string;

  // enable / disable select2
  @Input() disabled = false;

  // Specify the select's ID
  @Input() id: string = null;

  // Specify the select's class(es)
  @Input() class: string = null;

  // Specify the select's required attribute
  @Input() required: boolean = null;

  // all additional options
  @Input() options: Options;

  // emitter when value is changed
  @Output() valueChanged = new EventEmitter<string | string[]>();

  // emitter when the dropdown is opened
  @Output() open = new EventEmitter<string | string[]>();

  // emitter to expose the select2 api
  @Output() select2Api = new EventEmitter<Select2>();

  private element: any = undefined;
  private check = false;
  private dropdownId = Math.floor(Math.random() + Date.now());
  // private style = `CSS`;
  private select2?: Select2;
  private isOpen = false;

  constructor(private renderer: Renderer2, public zone: NgZone, public _element: ElementRef) {
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

  ngOnChanges(changes: SimpleChanges) {

    if (!this.element) {
      return;
    }

    if (changes['data'] && JSON.stringify(changes['data'].previousValue) !== JSON.stringify(changes['data'].currentValue)) {
      this.initPlugin();

      const newValue: string | string[] = this.value;
      this.setElementValue(newValue);
      this.valueChanged.emit(newValue);
      this.propagateChange(newValue);
    }

    if (changes['value'] && changes['value'].previousValue !== changes['value'].currentValue) {

      const newValue: string = changes['value'].currentValue;

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

    this.element.on('select2:select select2:unselect change', (e: any) => {
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
      document.querySelector<HTMLInputElement>(`.${this.getDropdownIdClass()} .select2-search__field`).focus();
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

  private initPlugin() {
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

    const options: Options = {
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
      jQuery.fn.select2.amd.require(['select2/compat/matcher'], (oldMatcher: any) => {
        options.matcher = oldMatcher(options.matcher);
        this.select2 = this.element.select2(options).data('select2');

        if (typeof this.value !== 'undefined') {
          this.setElementValue(this.value);
        }
      });
    } else {
      this.select2 = this.element.select2(options).data('select2');
    }

    this.select2Api.emit(this.select2);
    this.renderer.setProperty(this.selector.nativeElement, 'disabled', this.disabled);
  }

  private setElementValue(newValue: string | string[]) {

    // this.zone.run(() => {

    if (Array.isArray(newValue)) {

      for (const option of this.selector.nativeElement.options) {
        this.renderer.setProperty(option, 'selected', (newValue.indexOf(option.value) > -1));
      }
    } else {
      this.renderer.setProperty(this.selector.nativeElement, 'value', newValue);
    }

    if (this.element) {
      this.element.trigger('change.select2');
    }
    // });
  }

  private getDropdownIdClass() {
    return `select2-dropdown-id-${this.dropdownId}`;
  }

  writeValue(value: any) {

    if (value !== undefined) {
      this.value = value;
      this.setElementValue(value);
    }
  }

  propagateChange = (value: string | string[]) => { };

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this.renderer.setProperty(this.selector.nativeElement, 'disabled', this.disabled);
  }
}
