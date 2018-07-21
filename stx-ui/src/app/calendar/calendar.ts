import {
    NgModule, Component, ElementRef,
    AfterViewInit, AfterViewChecked, OnDestroy, OnInit,
    Input, Output, SimpleChange, EventEmitter, forwardRef, Renderer2, ViewChild, ChangeDetectorRef
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../../custommodules/primeng/primeng';
import { DomHandler } from '../../custommodules/primeng/primeng';
import { AbstractControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor } from '@angular/forms';

export const CALENDAR_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CalendarComponent),
    multi: true
};

export const CALENDAR_VALIDATOR: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => CalendarComponent),
    multi: true
};

export interface LocaleSettings {
    firstDayOfWeek?: number;
    dayNames: string[];
    dayNamesShort: string[];
    dayNamesMin: string[];
    monthNames: string[];
    monthNamesShort: string[];
}

@Component({
    selector: 'app-calendar',
    template: `
        <span [ngClass]="{'ui-calendar':true,'ui-calendar-w-btn':showIcon}" [ngStyle]="style" [class]="styleClass">
            <ng-template [ngIf]="!inline">
                <input #inputfield type="text" [attr.id]="inputId" [attr.required]="required"
                [value]="inputFieldValue" (focus)="onInputFocus($event)"
                (keydown)="onInputKeydown($event)" (click)="closeOverlay=false" (blur)="onInputBlur($event)"
                    [readonly]="readonlyInput" (input)="onUserInput($event)" [ngStyle]="inputStyle" [class]="inputStyleClass"
                    [placeholder]="placeholder||''" [disabled]="disabled" [attr.tabindex]="tabindex"
                    [ngClass]="'ui-inputtext ui-widget ui-state-default ui-corner-all'"
                    ><button type="button" [icon]="icon" pButton *ngIf="showIcon" (click)="onButtonClick($event,inputfield)"
                    [ngClass]="{'ui-datepicker-trigger':true,'ui-state-disabled':disabled}" [disabled]="disabled" tabindex="-1"></button>
            </ng-template>
            <div #datepicker class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"
            [ngClass]="{'ui-datepicker-inline':inline,'ui-shadow':!inline,'ui-state-disabled':disabled,'ui-datepicker-timeonly':timeOnly}"
                [ngStyle]="{'display': inline ? 'inline-block' : (overlayVisible ? 'block' : 'none')}"
                (click)="onDatePickerClick($event)" [@overlayState]="inline ? 'visible' : (overlayVisible ? 'visible' : 'hidden')">

                <div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all"
                *ngIf="!timeOnly && (overlayVisible || inline)">
                    <ng-content select="p-header"></ng-content>
                    <a class="ui-datepicker-prev ui-corner-all" href="#" (click)="prevMonth($event)">
                        <span class="fa fa-angle-left"></span>
                    </a>
                    <a class="ui-datepicker-next ui-corner-all" href="#" (click)="nextMonth($event)">
                        <span class="fa fa-angle-right"></span>
                    </a>
                    <div class="ui-datepicker-title">
                        <span class="ui-datepicker-month" *ngIf="!monthNavigator">{{locale.monthNames[currentMonth]}}</span>
                        <select class="ui-datepicker-month" *ngIf="monthNavigator" (change)="onMonthDropdownChange($event.target.value)">
                            <option [value]="i" *ngFor="let month of locale.monthNames;let i = index"
                            [selected]="i == currentMonth">{{month}}</option>
                        </select>
                        <select class="ui-datepicker-year" *ngIf="yearNavigator" (change)="onYearDropdownChange($event.target.value)">
                            <option [value]="year" *ngFor="let year of yearOptions" [selected]="year == currentYear">{{year}}</option>
                        </select>
                        <span class="ui-datepicker-year" *ngIf="!yearNavigator">{{currentYear}}</span>
                    </div>
                </div>
                <table class="ui-datepicker-calendar" *ngIf="!timeOnly && (overlayVisible || inline)">
                    <thead>
                        <tr>
                            <th scope="col" *ngFor="let weekDay of weekDays;let begin = first; let end = last">
                                <span>{{weekDay}}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let week of dates">
                            <td *ngFor="let date of week" [ngClass]="{'ui-datepicker-other-month ui-state-disabled':date.otherMonth,
                                'ui-datepicker-current-day':isSelected(date),'ui-datepicker-today':date.today}">
                                <a class="ui-state-default" href="#" *ngIf="date.otherMonth ? showOtherMonths : true" [ngClass]=
                                    "{'ui-state-active':isSelected(date), 'ui-state-highlight':date.today,
                                    'ui-state-disabled':!date.selectable}"
                                    (click)="onDateSelect($event,date)">{{date.day}}</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="ui-timepicker ui-widget-header ui-corner-all" *ngIf="showTime||timeOnly">
                    <div class="ui-hour-picker">
                        <a href="#" (click)="incrementHour($event)">
                            <span class="fa fa-angle-up"></span>
                        </a>
                        <span [ngStyle]="{'display': currentHour < 10 ? 'inline': 'none'}">0</span><span>{{currentHour}}</span>
                        <a href="#" (click)="decrementHour($event)">
                            <span class="fa fa-angle-down"></span>
                        </a>
                    </div>
                    <div class="ui-separator">
                        <a href="#">
                            <span class="fa fa-angle-up"></span>
                        </a>
                        <span>:</span>
                        <a href="#">
                            <span class="fa fa-angle-down"></span>
                        </a>
                    </div>
                    <div class="ui-minute-picker">
                        <a href="#" (click)="incrementMinute($event)">
                            <span class="fa fa-angle-up"></span>
                        </a>
                        <span [ngStyle]="{'display': currentMinute < 10 ? 'inline': 'none'}">0</span><span>{{currentMinute}}</span>
                        <a href="#" (click)="decrementMinute($event)">
                            <span class="fa fa-angle-down"></span>
                        </a>
                    </div>
                    <div class="ui-separator" *ngIf="showSeconds">
                        <a href="#">
                            <span class="fa fa-angle-up"></span>
                        </a>
                        <span>:</span>
                        <a href="#">
                            <span class="fa fa-angle-down"></span>
                        </a>
                    </div>
                    <div class="ui-second-picker" *ngIf="showSeconds">
                        <a href="#" (click)="incrementSecond($event)">
                            <span class="fa fa-angle-up"></span>
                        </a>
                        <span [ngStyle]="{'display': currentSecond < 10 ? 'inline': 'none'}">0</span><span>{{currentSecond}}</span>
                        <a href="#" (click)="decrementSecond($event)">
                            <span class="fa fa-angle-down"></span>
                        </a>
                    </div>
                    <div class="ui-ampm-picker" *ngIf="hourFormat=='12'">
                        <a href="#" (click)="toggleAMPM($event)">
                            <span class="fa fa-angle-up"></span>
                        </a>
                        <span>{{pm ? 'PM' : 'AM'}}</span>
                        <a href="#" (click)="toggleAMPM($event)">
                            <span class="fa fa-angle-down"></span>
                        </a>
                    </div>
                </div>
                <ng-content select="p-footer"></ng-content>
            </div>
        </span>
    `,
    animations: [
        trigger('overlayState', [
            state('hidden', style({
                opacity: 0
            })),
            state('visible', style({
                opacity: 1
            })),
            transition('visible => hidden', animate('400ms ease-in')),
            transition('hidden => visible', animate('400ms ease-out'))
        ])
    ],
    providers: [DomHandler, CALENDAR_VALUE_ACCESSOR, CALENDAR_VALIDATOR]
})
export class CalendarComponent implements AfterViewInit, AfterViewChecked, OnInit, OnDestroy, ControlValueAccessor {
    host: {
        '[class.ui-inputwrapper-filled]': 'filled',
        '[class.ui-inputwrapper-focus]': 'focus'
    };
    @Input() defaultDate: Date;

    @Input() style: string;

    @Input() styleClass: string;

    @Input() inputStyle: string;

    @Input() inputId: string;

    @Input() inputStyleClass: string;

    @Input() placeholder: string;

    @Input() disabled: any;

    @Input() dateFormat = 'mm/dd/yy';

    @Input() inline = false;

    @Input() showOtherMonths = true;

    @Input() selectOtherMonths: boolean;

    @Input() showIcon: boolean;

    @Input() icon = 'fa-calendar';

    @Input() appendTo: any;

    @Input() readonlyInput: boolean;

    @Input() shortYearCutoff: any = '+10';

    @Input() monthNavigator: boolean;

    @Input() yearNavigator: boolean;

    @Input() yearRange: string;

    @Input() showTime: boolean;

    @Input() hourFormat = '24';

    @Input() timeOnly: boolean;

    @Input() stepHour = 1;

    @Input() stepMinute = 1;

    @Input() stepSecond = 1;

    @Input() showSeconds = false;

    @Input() required: boolean;

    @Input() showOnFocus = true;

    @Input() dataType = 'date';

    @Input() disabledDates: Array<Date>;

    @Input() disabledDays: Array<number>;

    @Input() utc: boolean;

    @Output() onFocus: EventEmitter<any> = new EventEmitter();

    @Output() onBlur: EventEmitter<any> = new EventEmitter();

    @Output() onClose: EventEmitter<any> = new EventEmitter();

    @Output() onSelect: EventEmitter<any> = new EventEmitter();

    @Output() onInput: EventEmitter<any> = new EventEmitter();

    _locale: LocaleSettings = {
        firstDayOfWeek: 0,
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };

    @Input() tabindex: number;

    @ViewChild('datepicker') overlayViewChild: ElementRef;

    @ViewChild('inputfield') inputfieldViewChild: ElementRef;

    value: Date;

    dates: any[];
    literal: boolean; // my impl
    output: any;
    weekDays: string[];

    currentMonthText: string;

    currentMonth: number;

    currentYear: number;

    currentHour: number;

    currentMinute: number;

    currentSecond: number;

    pm: boolean;

    overlay: HTMLDivElement;

    overlayVisible: boolean;

    overlayShown: boolean;

    closeOverlay = true;

    dateClick: boolean;
    calendarElement: any;
    documentClickListener: any;

    ticksTo1970: number;

    yearOptions: number[];

    focus: boolean;

    isKeydown: boolean;

    filled: boolean;

    inputFieldValue: string = null;

    _minDate: Date;

    _maxDate: Date;

    _isValid = true;

    onModelChange: Function = () => { };

    onModelTouched: Function = () => { };


    @Input() get minDate(): Date {
        return this._minDate;
    }

    set minDate(date: Date) {
        this._minDate = date;
        this.createMonth(this.currentMonth, this.currentYear);
    }

    @Input() get maxDate(): Date {
        return this._maxDate;
    }

    set maxDate(date: Date) {
        this._maxDate = date;
        this.createMonth(this.currentMonth, this.currentYear);
    }

    get locale() {
        return this._locale;
    }

    @Input()
    set locale(newLocale: LocaleSettings) {
        this._locale = newLocale;
        this.createWeekDays();
        this.createMonth(this.currentMonth, this.currentYear);
    }

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer2, public cd: ChangeDetectorRef) { }

    ngOnInit() {
        const date = this.defaultDate || new Date();
        this.createWeekDays();

        this.currentMonth = date.getMonth();
        this.currentYear = date.getFullYear();
        this.pm = date.getHours() > 11;
        if (this.showTime) {
            this.currentMinute = date.getMinutes();
            this.currentSecond = date.getSeconds();

            if (this.hourFormat === '12') {
                this.currentHour = date.getHours() === 0 ? 12 : date.getHours() % 12;
            } else {
                this.currentHour = date.getHours();
            }
        } else if (this.timeOnly) {
            this.currentMinute = 0;
            this.currentHour = 0;
            this.currentSecond = 0;
        }

        this.createMonth(this.currentMonth, this.currentYear);

        this.ticksTo1970 = (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
            Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000);

        if (this.yearNavigator && this.yearRange) {
            this.yearOptions = [];
            const years = this.yearRange.split(':'),
                yearStart = parseInt(years[0], 10),
                yearEnd = parseInt(years[1], 10);

            for (let i = yearStart; i <= yearEnd; i++) {
                this.yearOptions.push(i);
            }
        }
    }

    ngAfterViewInit() {
        if (!this.inline && this.appendTo) {
            if (this.appendTo === 'body') {
                document.body.appendChild(this.overlayViewChild.nativeElement);
            } else {
                this.domHandler.appendChild(this.overlayViewChild.nativeElement, this.appendTo);
            }
        }
    }

    ngAfterViewChecked() {
        if (this.overlayShown) {
            this.alignOverlay();
            this.overlayShown = false;
        }
    }

    createWeekDays() {
        this.weekDays = [];
        let dayIndex = this.locale.firstDayOfWeek;
        for (let i = 0; i < 7; i++) {
            this.weekDays.push(this.locale.dayNamesMin[dayIndex]);
            dayIndex = (dayIndex === 6) ? 0 : ++dayIndex;
        }
    }

    createMonth(month: number, year: number) {
        this.dates = [];
        this.currentMonth = month;
        this.currentYear = year;
        this.currentMonthText = this.locale.monthNames[month];
        const firstDay = this.getFirstDayOfMonthIndex(month, year);
        const daysLength = this.getDaysCountInMonth(month, year);
        const prevMonthDaysLength = this.getDaysCountInPrevMonth(month, year);
        const sundayIndex = this.getSundayIndex();
        let dayNo = 1;
        const today = new Date();

        for (let i = 0; i < 6; i++) {
            const week = [];

            if (i === 0) {
                for (let j = (prevMonthDaysLength - firstDay + 1); j <= prevMonthDaysLength; j++) {
                    const prev = this.getPreviousMonthAndYear(month, year);
                    week.push({
                        day: j, month: prev.month, year: prev.year, otherMonth: true,
                        today: this.isToday(today, j, prev.month, prev.year), selectable: this.isSelectable(j, prev.month, prev.year)
                    });
                }

                const remainingDaysLength = 7 - week.length;
                for (let j = 0; j < remainingDaysLength; j++) {
                    week.push({
                        day: dayNo, month: month, year: year, today: this.isToday(today, dayNo, month, year),
                        selectable: this.isSelectable(dayNo, month, year)
                    });
                    dayNo++;
                }
            } else {
                for (let j = 0; j < 7; j++) {
                    if (dayNo > daysLength) {
                        const next = this.getNextMonthAndYear(month, year);
                        week.push({
                            day: dayNo - daysLength, month: next.month, year: next.year, otherMonth: true,
                            today: this.isToday(today, dayNo - daysLength, next.month, next.year),
                            selectable: this.isSelectable((dayNo - daysLength), next.month, next.year)
                        });
                    } else {
                        week.push({
                            day: dayNo, month: month, year: year, today: this.isToday(today, dayNo, month, year),
                            selectable: this.isSelectable(dayNo, month, year)
                        });
                    }

                    dayNo++;
                }
            }

            this.dates.push(week);
        }
    }

    prevMonth(event) {
        if (this.disabled) {
            event.preventDefault();
            return;
        }

        if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else {
            this.currentMonth--;
        }

        this.createMonth(this.currentMonth, this.currentYear);
        event.preventDefault();
    }

    nextMonth(event) {
        if (this.disabled) {
            event.preventDefault();
            return;
        }

        if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else {
            this.currentMonth++;
        }

        this.createMonth(this.currentMonth, this.currentYear);
        event.preventDefault();
    }

    onDateSelect(event, dateMeta) {
        if (this.disabled || !dateMeta.selectable) {
            event.preventDefault();
            return;
        }

        if (dateMeta.otherMonth) {
            if (this.selectOtherMonths) {
                this.currentMonth = dateMeta.month;
                this.currentYear = dateMeta.year;
                this.createMonth(this.currentMonth, this.currentYear);
                this.selectDate(dateMeta);
            }
        } else {
            this.selectDate(dateMeta);
        }

        this.dateClick = true;
        this.updateInputfield();
        event.preventDefault();
    }

    updateInputfield() {
        if (this.value) {
            let formattedValue;

            if (this.timeOnly) {
                formattedValue = this.formatTime(this.value);
            } else {
                formattedValue = this.formatDate(this.value, this.dateFormat);
                if (this.showTime) {
                    formattedValue += ' ' + this.formatTime(this.value);
                }
            }

            this.inputFieldValue = formattedValue;
        } else {
            this.inputFieldValue = '';
        }

        this.updateFilledState();

        if (this.inputfieldViewChild && this.inputfieldViewChild.nativeElement) {
            this.inputfieldViewChild.nativeElement.value = this.inputFieldValue;
        }
    }

    selectDate(dateMeta) {
        if (this.utc) {
            this.value = new Date(Date.UTC(dateMeta.year, dateMeta.month, dateMeta.day));
        } else {
            this.value = new Date(dateMeta.year, dateMeta.month, dateMeta.day);
        }
        if (this.showTime) {
            if (this.hourFormat === '12' && this.pm && this.currentHour !== 12) {
                this.value.setHours(this.currentHour + 12);
            } else {
                this.value.setHours(this.currentHour);
            }
            this.value.setMinutes(this.currentMinute);
            this.value.setSeconds(this.currentSecond);
        }
        this._isValid = true;
        this.updateModel();
        this.onSelect.emit(this.value);
    }

    updateModel() {
        if (this.dataType === 'date') {
            this.onModelChange(this.value);
        } else if (this.dataType === 'string') {
            if (this.timeOnly) {
                this.onModelChange(this.formatTime(this.value));
            } else {
            } this.onModelChange(this.formatDate(this.value, this.dateFormat));
        }
    }

    getFirstDayOfMonthIndex(month: number, year: number) {
        const day = new Date();
        day.setDate(1);
        day.setMonth(month);
        day.setFullYear(year);

        const dayIndex = day.getDay() + this.getSundayIndex();
        return dayIndex >= 7 ? dayIndex - 7 : dayIndex;
    }

    getDaysCountInMonth(month: number, year: number) {
        return 32 - this.daylightSavingAdjust(new Date(year, month, 32)).getDate();
    }

    getDaysCountInPrevMonth(month: number, year: number) {
        const prev = this.getPreviousMonthAndYear(month, year);
        return this.getDaysCountInMonth(prev.month, prev.year);
    }

    getPreviousMonthAndYear(month: number, year: number) {
        let m, y;

        if (month === 0) {
            m = 11;
            y = year - 1;
        } else {
            m = month - 1;
            y = year;
        }

        return { 'month': m, 'year': y };
    }

    getNextMonthAndYear(month: number, year: number) {
        let m, y;

        if (month === 11) {
            m = 0;
            y = year + 1;
        } else {
            m = month + 1;
            y = year;
        }

        return { 'month': m, 'year': y };
    }

    getSundayIndex() {
        return this.locale.firstDayOfWeek > 0 ? 7 - this.locale.firstDayOfWeek : 0;
    }

    isSelected(dateMeta): boolean {
        if (this.value) {
            return this.value.getDate() === dateMeta.day &&
                this.value.getMonth() === dateMeta.month && this.value.getFullYear() === dateMeta.year;
        } else {
            return false;
        }
    }

    isToday(today, day, month, year): boolean {
        return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    }

    isSelectable(day, month, year): boolean {
        let validMin = true;
        let validMax = true;
        let validDate = true;
        let validDay = true;

        if (this.minDate) {
            if (this.minDate.getFullYear() > year) {
                validMin = false;
            } else if (this.minDate.getFullYear() === year) {
                if (this.minDate.getMonth() > month) {
                    validMin = false;
                } else if (this.minDate.getMonth() === month) {
                    if (this.minDate.getDate() > day) {
                        validMin = false;
                    }
                }
            }
        }

        if (this.maxDate) {
            if (this.maxDate.getFullYear() < year) {
                validMax = false;
            } else if (this.maxDate.getFullYear() === year) {
                if (this.maxDate.getMonth() < month) {
                    validMax = false;
                } else if (this.maxDate.getMonth() === month) {
                    if (this.maxDate.getDate() < day) {
                        validMax = false;
                    }
                }
            }
        }

        if (this.disabledDates) {
            validDate = !this.isDateDisabled(day, month, year);
        }

        if (this.disabledDays) {
            validDay = !this.isDayDisabled(day, month, year);
        }

        return validMin && validMax && validDate && validDay;
    }

    isDateDisabled(day: number, month: number, year: number): boolean {
        if (this.disabledDates) {
            for (const disabledDate of this.disabledDates) {
                if (disabledDate.getFullYear() === year && disabledDate.getMonth() === month && disabledDate.getDate() === day) {
                    return true;
                }
            }
        }

        return false;
    }

    isDayDisabled(day: number, month: number, year: number): boolean {
        if (this.disabledDays) {
            const weekday = new Date(year, month, day);
            const weekdayNumber = weekday.getDay();
            return this.disabledDays.indexOf(weekdayNumber) !== -1;
        }
        return false;
    }

    onInputFocus(event: Event) {
        this.focus = true;
        if (this.showOnFocus) {
            this.showOverlay();
        }
        this.onFocus.emit(event);
    }

    onInputBlur(event: Event) {
        this.focus = false;
        this.onBlur.emit(event);
        this.updateInputfield();
        this.onModelTouched();
    }

    onButtonClick(event, inputfield) {
        this.closeOverlay = false;

        if (!this.overlayViewChild.nativeElement.offsetParent || this.overlayViewChild.nativeElement.style.display === 'none') {
            inputfield.focus();
            this.showOverlay();
        } else {
            this.closeOverlay = true;
        }
    }

    onInputKeydown(event) {
        this.isKeydown = true;
        if (event.keyCode === 9) {
            this.overlayVisible = false;
        }
    }

    onMonthDropdownChange(m: string) {
        this.currentMonth = parseInt(m, 16);
        this.createMonth(this.currentMonth, this.currentYear);
    }

    onYearDropdownChange(y: string) {
        this.currentYear = parseInt(y, 16);
        this.createMonth(this.currentMonth, this.currentYear);
    }

    incrementHour(event) {
        const newHour = this.currentHour + this.stepHour;
        if (this.hourFormat === '24') {
            this.currentHour = (newHour >= 24) ? (newHour - 24) : newHour;
        } else if (this.hourFormat === '12') {
            this.currentHour = (newHour >= 13) ? (newHour - 12) : newHour;
        }
        this.updateTime();

        event.preventDefault();
    }

    decrementHour(event) {
        const newHour = this.currentHour - this.stepHour;
        if (this.hourFormat === '24') {
            this.currentHour = (newHour < 0) ? (24 + newHour) : newHour;
        } else if (this.hourFormat === '12') {
            this.currentHour = (newHour <= 0) ? (12 + newHour) : newHour;
        }
        this.updateTime();

        event.preventDefault();
    }

    incrementMinute(event) {
        const newMinute = this.currentMinute + this.stepMinute;
        this.currentMinute = (newMinute > 59) ? newMinute - 60 : newMinute;

        this.updateTime();

        event.preventDefault();
    }

    decrementMinute(event) {
        const newMinute = this.currentMinute - this.stepMinute;
        this.currentMinute = (newMinute < 0) ? 60 + newMinute : newMinute;

        this.updateTime();

        event.preventDefault();
    }

    incrementSecond(event) {
        const newSecond = this.currentSecond + this.stepSecond;
        this.currentSecond = (newSecond > 59) ? newSecond - 60 : newSecond;

        this.updateTime();

        event.preventDefault();
    }

    decrementSecond(event) {
        const newSecond = this.currentSecond - this.stepSecond;
        this.currentSecond = (newSecond < 0) ? 60 + newSecond : newSecond;

        this.updateTime();

        event.preventDefault();
    }

    updateTime() {
        this.value = this.value || new Date();
        if (this.hourFormat === '12' && this.pm && this.currentHour !== 12) {
            this.value.setHours(this.currentHour + 12);
        } else {
            this.value.setHours(this.currentHour);
        }
        this.value.setMinutes(this.currentMinute);
        this.value.setSeconds(this.currentSecond);
        this.updateModel();
        this.onSelect.emit(this.value);
        this.updateInputfield();
    }

    toggleAMPM(event) {
        this.pm = !this.pm;
        this.updateTime();
        event.preventDefault();
    }

    onUserInput(event) {
        // IE 11 Workaround for input placeholder : https://github.com/primefaces/primeng/issues/2026
        if (!this.isKeydown) {
            return;
        }
        this.isKeydown = false;

        const val = event.target.value;
        try {
            this.value = this.parseValueFromString(val);
            this.updateUI();
            this._isValid = true;
        } catch (err) {
            // invalid date
            this.value = null;
            this._isValid = false;
        }

        this.filled = val != null && val.length;
        this.updateModel();
        this.onInput.emit(event);
    }

    parseValueFromString(text: string): Date {
        if (!text || text.trim().length === 0) {
            return null;
        }

        let dateValue;
        const parts: string[] = text.split(' ');

        if (this.timeOnly) {
            dateValue = new Date();
            this.populateTime(dateValue, parts[0], parts[1]);
        } else {
            if (this.showTime) {
                dateValue = this.parseDate(parts[0], this.dateFormat);
                this.populateTime(dateValue, parts[1], parts[2]);
            } else {
                dateValue = this.parseDate(text, this.dateFormat);
            }
        }

        return dateValue;
    }

    populateTime(value, timeString, ampm) {
        if (this.hourFormat === '12' && !ampm) {
            const error = 'Invalid Time';
            throw error;
        }

        this.pm = (ampm === 'PM' || ampm === 'pm');
        const time = this.parseTime(timeString);
        value.setHours(time.hour);
        value.setMinutes(time.minute);
        value.setSeconds(time.second);
    }

    updateUI() {
        const val = this.value || this.defaultDate || new Date();
        this.createMonth(val.getMonth(), val.getFullYear());

        if (this.showTime || this.timeOnly) {
            const hours = val.getHours();

            if (this.hourFormat === '12') {
                if (hours >= 12) {
                    this.currentHour = (hours === 12) ? 12 : hours - 12;
                } else {
                    this.currentHour = (hours === 0) ? 12 : hours;
                }
            } else {
                this.currentHour = val.getHours();
            }

            this.currentMinute = val.getMinutes();
            this.currentSecond = val.getSeconds();
        }
    }

    onDatePickerClick(event) {
        this.closeOverlay = this.dateClick;
    }

    showOverlay() {
        this.overlayVisible = true;
        this.overlayShown = true;
        this.overlayViewChild.nativeElement.style.zIndex = String(++DomHandler.zindex);

        this.bindDocumentClickListener();
    }

    alignOverlay() {
        if (this.appendTo) {
            this.domHandler.absolutePosition(this.overlayViewChild.nativeElement, this.inputfieldViewChild.nativeElement);
        } else {
            this.domHandler.relativePosition(this.overlayViewChild.nativeElement, this.inputfieldViewChild.nativeElement);
        }
    }

    writeValue(value: any): void {
        this.value = value;
        if (this.value && typeof this.value === 'string') {
            this.value = this.parseValueFromString(this.value);
        }

        this.updateInputfield();
        this.updateUI();
    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    setDisabledState(val: boolean): void {
        this.disabled = val;
    }

    // Ported from jquery-ui datepicker formatDate
    formatDate(date, format) {
        if (!date) {
            return '';
        }

        let iFormat;
        const lookAhead = (match: any) => {
            const matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
            if (matches) {
                iFormat++;
            }
            return matches;
        },
            formatNumber = (match, value, len) => {
                let num = '' + value;
                if (lookAhead(match)) {
                    while (num.length < len) {
                        num = '0' + num;
                    }
                }
                return num;
            },
            formatName = (match, value, shortNames, longNames) => {
                return (lookAhead(match) ? longNames[value] : shortNames[value]);
            },
            output = '';
        this.literal = false;

        if (date) {
            for (iFormat = 0; iFormat < format.length; iFormat++) {
                if (this.literal) {
                    if (format.charAt(iFormat) === (') && !lookAhead(')) {
                        this.literal = false;
                    } else {
                        this.output += format.charAt(iFormat);
                    }
                } else {
                    switch (format.charAt(iFormat)) {
                        case 'd':
                            this.output += formatNumber('d', date.getDate(), 2);
                            break;
                        case 'D':
                            this.output += formatName('D', date.getDay(), this.locale.dayNamesShort, this.locale.dayNames);
                            break;
                        case 'o':
                            this.output += formatNumber('o',
                                Math.round((new Date(date.getFullYear(), date.getMonth(),
                                    date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
                            break;
                        case 'm':
                            this.output += formatNumber('m', date.getMonth() + 1, 2);
                            break;
                        case 'M':
                            this.output += formatName('M', date.getMonth(), this.locale.monthNamesShort, this.locale.monthNames);
                            break;
                        case 'y':
                            this.output += (lookAhead('y') ? date.getFullYear() :
                                (date.getFullYear() % 100 < 10 ? '0' : '') + date.getFullYear() % 100);
                            break;
                        case '@':
                            this.output += date.getTime();
                            break;
                        case '!':
                            this.output += date.getTime() * 10000 + this.ticksTo1970;
                            break;
                        case '\'':
                            if (lookAhead('\'')) {
                                this.output += '\'';
                            } else {
                                this.literal = true;
                            }
                            break;
                        default:
                            this.output += format.charAt(iFormat);
                    }
                }
            }
        }
        return output;
    }

    formatTime(date) {
        if (!date) {
            return '';
        }

        let output = '';
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        if (this.hourFormat === '12' && hours > 11 && hours !== 12) {
            hours -= 12;
        }

        output += (hours < 10) ? '0' + hours : hours;
        output += ':';
        output += (minutes < 10) ? '0' + minutes : minutes;

        if (this.showSeconds) {
            output += ':';
            output += (seconds < 10) ? '0' + seconds : seconds;
        }

        if (this.hourFormat === '12') {
            output += date.getHours() > 11 ? ' PM' : ' AM';
        }

        return output;
    }

    parseTime(value) {
        const tokens: string[] = value.split(':');
        const validTokenLength = this.showSeconds ? 3 : 2;

        if (tokens.length !== validTokenLength) {
            const error = 'Invalid time';
            throw error;
        }

        let h = parseInt(tokens[0], 10);
        const m = parseInt(tokens[1], 10);
        const s = this.showSeconds ? parseInt(tokens[2], 10) : null;

        if (isNaN(h) || isNaN(m) || h > 23 || m > 59 || (this.hourFormat === '12' && h > 12)
            || (this.showSeconds && (isNaN(s) || s > 59))) {
            const error = 'Invalid time';
            throw error;
        } else {
            if (this.hourFormat === '12' && h !== 12 && this.pm) {
                h += 12;
            }

            return { hour: h, minute: m, second: s };
        }
    }

    // Ported from jquery-ui datepicker parseDate
    parseDate(value, format) {
        if (format == null || value == null) {
            const error = 'Invalid arguments';
            throw error;
        }

        value = (typeof value === 'object' ? value.toString() : value + '');
        if (value === '') {
            return null;
        }

        let iFormat;
        let dim;
        let extra;
        let iValue = 0;
        const shortYearCutoff = (typeof this.shortYearCutoff !== 'string' ? this.shortYearCutoff : new Date().getFullYear() % 100
            + parseInt(this.shortYearCutoff, 10));
        let year = -1,
            month = -1,
            day = -1,
            doy = -1,
            literal = false,
            date;
        const lookAhead = (match) => {
            const matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
            if (matches) {
                iFormat++;
            }
            return matches;
        };
        const getNumber = (match) => {
            const isDoubled = lookAhead(match),
                size = (match === '@' ? 14 : (match === '!' ? 20 :
                    (match === 'y' && isDoubled ? 4 : (match === 'o' ? 3 : 2)))),
                minSize = (match === 'y' ? size : 1),
                digits = new RegExp('^\\d{' + minSize + ',' + size + '}'),
                num = value.substring(iValue).match(digits);
            if (!num) {
                const error = 'Missing number at position';
                throw error + iValue;
            }
            iValue += num[0].length;
            return parseInt(num[0], 10);
        },
            getName = (match, shortNames, longNames) => {
                let index = -1;
                const arr = lookAhead(match) ? longNames : shortNames;
                const names = [];

                for (let i = 0; i < arr.length; i++) {
                    names.push([i, arr[i]]);
                }
                names.sort((a, b) => {
                    return -(a[1].length - b[1].length);
                });

                for (let i = 0; i < names.length; i++) {
                    const name = names[i][1];
                    if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
                        index = names[i][0];
                        iValue += name.length;
                        break;
                    }
                }

                if (index !== -1) {
                    return index + 1;
                } else {
                    const error = 'Unknown name at position ';
                    throw error + iValue;
                }
            },
            checkLiteral = () => {
                if (value.charAt(iValue) !== format.charAt(iFormat)) {
                    const error = 'Unexpected literal at position';
                    throw error + iValue;
                }
                iValue++;
            };

        for (iFormat = 0; iFormat < format.length; iFormat++) {
            if (literal) {
                if (format.charAt(iFormat) === '\'' && !lookAhead('\'')) {
                    literal = false;
                } else {
                    checkLiteral();
                }
            } else {
                switch (format.charAt(iFormat)) {
                    case 'd':
                        day = getNumber('d');
                        break;
                    case 'D':
                        getName('D', this.locale.dayNamesShort, this.locale.dayNames);
                        break;
                    case 'o':
                        doy = getNumber('o');
                        break;
                    case 'm':
                        month = getNumber('m');
                        break;
                    case 'M':
                        month = getName('M', this.locale.monthNamesShort, this.locale.monthNames);
                        break;
                    case 'y':
                        year = getNumber('y');
                        break;
                    case '@':
                        date = new Date(getNumber('@'));
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        break;
                    case '!':
                        date = new Date((getNumber('!') - this.ticksTo1970) / 10000);
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        break;
                    case '\'':
                        if (lookAhead('\'')) {
                            checkLiteral();
                        } else {
                            literal = true;
                        }
                        break;
                    default:
                        checkLiteral();
                }
            }
        }

        if (iValue < value.length) {
            extra = value.substr(iValue);
            if (!/^\s+/.test(extra)) {
                const error = 'Extra/unparsed characters found in date: ';
                throw error + extra;
            }
        }

        if (year === -1) {
            year = new Date().getFullYear();
        } else if (year < 100) {
            year += new Date().getFullYear() - new Date().getFullYear() % 100 +
                (year <= shortYearCutoff ? 0 : -100);
        }

        if (doy > -1) {
            month = 1;
            day = doy;
            do {
                dim = this.getDaysCountInMonth(year, month - 1);
                if (day <= dim) {
                    break;
                }
                month++;
                day -= dim;
            } while (true);
        }

        date = this.daylightSavingAdjust(new Date(year, month - 1, day));
        if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
            const error = 'Invalid date';
            throw error; // E.g. 31/02/00
        }
        return date;
    }

    daylightSavingAdjust(date) {
        if (!date) {
            return null;
        }
        date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
        return date;
    }

    updateFilledState() {
        this.filled = this.inputFieldValue && this.inputFieldValue !== '';
    }

    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', () => {
                if (this.closeOverlay) {
                    this.overlayVisible = false;
                    this.onClose.emit(event);
                }

                this.closeOverlay = true;
                this.dateClick = false;
                this.cd.detectChanges();
            });
        }
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }

    ngOnDestroy() {
        this.unbindDocumentClickListener();

        if (!this.inline && this.appendTo) {
            this.el.nativeElement.appendChild(this.overlayViewChild.nativeElement);
        }
    }

    validate(c: AbstractControl) {
        if (!this._isValid) {
            return { invalidDate: true };
        }

        return null;
    }
}

@NgModule({
    imports: [CommonModule, ButtonModule],
    exports: [CalendarComponent, ButtonModule],
    declarations: [CalendarComponent]
})
export class CalendarModule { }
