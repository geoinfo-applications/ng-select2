import { AfterViewInit, DoCheck, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Select2OptionData } from './ng-select2.interface';
import { Options } from 'select2';
export declare class NgSelect2Component implements AfterViewInit, OnChanges, OnDestroy, OnInit, DoCheck, ControlValueAccessor {
    private renderer;
    zone: NgZone;
    _element: ElementRef;
    selector: ElementRef;
    data: Array<Select2OptionData>;
    placeholder: string;
    dropdownParent: string;
    allowClear: boolean;
    value: string | string[];
    width: string;
    disabled: boolean;
    id: string;
    class: string;
    required: boolean;
    options: Options;
    valueChanged: EventEmitter<string | string[]>;
    private element;
    private check;
    private dropdownId;
    constructor(renderer: Renderer2, zone: NgZone, _element: ElementRef);
    ngDoCheck(): void;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private initPlugin;
    private setElementValue;
    private getDropdownIdClass;
    writeValue(value: any): void;
    propagateChange: (value: string | string[]) => void;
    registerOnChange(fn: any): void;
    registerOnTouched(): void;
    setDisabledState(isDisabled: boolean): void;
}
