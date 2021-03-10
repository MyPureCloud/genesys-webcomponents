import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Listen,
  Prop,
  State,
  Watch
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';
import { CalendarModes } from '../../../common-enums';
import {
  asIsoDateRange,
  asIsoDate,
  fromIsoDateRange,
  fromIsoDate
} from '../../../utils/date/iso-dates';
import { buildI18nForComponent, GetI18nValue } from '../../../i18n';

import translationResources from './i18n/en.json';
import {
  GuxDatepickerMode,
  GuxDatepickerIntervalRange
} from './gux-datepicker.types';
import {
  getCalendarLabels,
  isOutOfBoundsDate,
  incrementDay,
  incrementMonth,
  incrementYear,
  getFormattedDay,
  getFormattedMonth,
  getFormattedYear,
  getIntervalLetter,
  getFormatSeparator,
  getPreviousIntervalRange,
  getNextIntervalRange,
  getIntervalOrder,
  getIntervalRange
} from './gux-datepicker.service';

@Component({
  styleUrl: 'gux-datepicker.less',
  tag: 'gux-datepicker'
})
export class GuxDatepicker {
  yearFormat: string = 'yyyy';
  intervalOrder: string[];
  textFieldElement: HTMLGuxTextFieldLegacyElement;
  toTextFieldElement: HTMLGuxTextFieldLegacyElement;
  inputElement: HTMLInputElement;
  toInputElement: HTMLInputElement;
  calendarElement: HTMLGuxCalendarElement;
  fieldDatepickerElement: HTMLDivElement;
  intervalRange: GuxDatepickerIntervalRange;
  focusingRange: boolean = false;
  focusedField: HTMLInputElement;
  isSelectingRange: boolean = false;
  lastIntervalRange: GuxDatepickerIntervalRange;
  lastYear: number = new Date().getFullYear();
  i18n: GetI18nValue;

  @Element()
  root: HTMLElement;

  /**
   * The datepicker current value
   */
  @Prop({ mutable: true })
  value: string;

  /**
   * The datepicker label (can be a single label, or an array of two if it's a range datepicker)
   */
  @Prop()
  label: string | string[] = '';

  /**
   * The datepicker number of months displayed
   */
  @Prop({ mutable: true })
  numberOfMonths: number = 1;

  /**
   * The min date selectable
   */
  @Prop()
  minDate: string = '';

  /**
   * The max date selectable
   */
  @Prop()
  maxDate: string = '';

  /**
   * The calendar mode (can be single or range)
   */
  @Prop()
  mode: GuxDatepickerMode = CalendarModes.Single;

  /**
   * The datepicker date format (default to mm/dd/yyyy, or specified)
   */
  @Prop()
  format: string = 'mm/dd/yyyy';

  /**
   * The datepicker first week day (default to 0 (sunday))
   */
  @Prop()
  firstDayOfWeek: number = 0;

  /**
   * The datepicker current value
   */
  @State()
  formatedValue: string = '';

  @State()
  minDateDate: Date;

  @State()
  maxDateDate: Date;

  /**
   * The datepicker current value
   */
  @State()
  toFormatedValue: string = '';

  @State()
  active: boolean = false;

  @Watch('value')
  watchValue() {
    this.updateDate();
  }

  @Watch('minDate')
  watchMinDate(newDate: string) {
    if (newDate) {
      this.minDateDate = fromIsoDate(newDate);
    } else {
      this.minDateDate = null;
    }
  }

  @Watch('maxDate')
  watchMaxDate(newDate: string) {
    if (newDate) {
      this.maxDateDate = fromIsoDate(newDate);
    } else {
      this.maxDateDate = null;
    }
  }

  @Watch('format')
  watchFormat(newFormat: string) {
    if (!newFormat.includes('yyyy')) {
      this.yearFormat = 'yy';
    }

    this.intervalOrder = getIntervalOrder(newFormat);

    this.lastIntervalRange = getIntervalRange(
      this.format,
      getIntervalLetter(this.format, 0)
    );
  }

  /**
   * Triggered when user selects a date
   */
  @Event()
  input: EventEmitter<string>;

  @Listen('keydown', { passive: false })
  onKeyDown(event: KeyboardEvent) {
    if (this.isFocusedFieldEvent(event)) {
      this.focusedField = this.getInputFieldFromEvent(event);

      switch (event.key) {
        case 'Enter':
        case 'Escape':
          this.focusedField.blur();
          this.active = false;
          break;
        case 'Tab':
          if (!event.shiftKey) {
            event.preventDefault();
            this.calendarElement.focusPreviewDate();
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          this.increment(-1);
          this.setCursorRange();
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.increment(1);
          this.setCursorRange();
          break;
        case 'ArrowLeft':
          event.preventDefault();

          const previousIntervalRange = getPreviousIntervalRange(
            this.format,
            this.intervalRange
          );
          this.setIntervalRange(previousIntervalRange);
          this.setCursorRange();
          break;
        case 'ArrowRight':
          event.preventDefault();

          const nextIntervalRange = getNextIntervalRange(
            this.format,
            this.intervalRange
          );
          this.setIntervalRange(nextIntervalRange);
          this.setCursorRange();
          break;
        default:
          event.preventDefault();

          this.setIntervalRange({
            selectionStart: this.focusedField.selectionStart,
            selectionEnd: this.focusedField.selectionEnd
          });
          this.updateIntervalValue(event);

          this.setCursorRange();
          break;
      }
    }
  }

  @Listen('focusin')
  onFocusIn(event: FocusEvent) {
    if (this.isFocusedFieldEvent(event)) {
      if (!this.isSelectingRange) {
        this.focusedField = this.getInputFieldFromEvent(event);
        this.setRange();
      }
    }
  }

  @Listen('focusout')
  onFocusOut(event: FocusEvent) {
    if (!this.root.contains(event.relatedTarget as Node)) {
      this.lastIntervalRange = getIntervalRange(
        this.format,
        getIntervalLetter(this.format, 0)
      );
      this.active = false;
    }
  }

  @Listen('mousedown')
  onMouseDown(event: MouseEvent) {
    if (this.isFocusedFieldEvent(event)) {
      this.isSelectingRange = true;
    }
  }

  @Listen('mouseup', { passive: false })
  onMouseUp(event: MouseEvent) {
    event.preventDefault();

    if (this.isSelectingRange && this.isFocusedFieldEvent(event)) {
      this.focusedField = this.getInputFieldFromEvent(event);
      this.lastIntervalRange = getIntervalRange(
        this.format,
        getIntervalLetter(this.format, this.focusedField.selectionStart)
      );
      this.setRange();
    }
  }

  isFocusedFieldEvent(event: Event): boolean {
    return (
      event.target === this.inputElement || event.target === this.toInputElement
    );
  }

  getInputFieldFromEvent(event: Event): HTMLInputElement {
    return event.target as HTMLInputElement;
  }

  updateIntervalValue(event: KeyboardEvent): void {
    const inputNumber = parseInt(event.key, 10);

    if (!isNaN(inputNumber)) {
      const currentSectionValue = this.focusedField.value.slice(
        this.focusedField.selectionStart,
        this.focusedField.selectionEnd
      );

      if (
        getIntervalLetter(this.format, this.focusedField.selectionStart) ===
          'y' &&
        this.yearFormat === 'yyyy'
      ) {
        this.typeYearValue(currentSectionValue, event.key);
      } else {
        if (this.canSetDate(inputNumber)) {
          this.updateSelection(
            this.focusedField,
            `${currentSectionValue[1]}${event.key}`
          );
          this.setValue();
        } else {
          this.updateSelection(
            this.focusedField,
            `0${event.key}`.replace('00', '01')
          );
          this.setValue();
        }
      }
    }
  }

  updateSelection(field: HTMLInputElement, text: string): void {
    field.value =
      field.value.substr(0, this.intervalRange.selectionStart) +
      text +
      field.value.substr(this.intervalRange.selectionEnd);
  }

  getCalendarLabels(): string[] {
    return getCalendarLabels([].concat(this.label || []), this.mode, [
      this.i18n('start'),
      this.i18n('end')
    ]);
  }

  stringToDate(stringDate: string) {
    const formatSeperator = getFormatSeparator(this.format);
    const formatItems = this.format.toLowerCase().split(formatSeperator);
    const dateItems = stringDate.split(formatSeperator);
    const year = parseInt(dateItems[formatItems.indexOf(this.yearFormat)], 10);
    const month = parseInt(dateItems[formatItems.indexOf('mm')], 10) - 1;
    const day = parseInt(dateItems[formatItems.indexOf('dd')], 10);
    const date = new Date(year, month, day);

    if (
      this.yearFormat === 'yy' &&
      date.getFullYear() < 1970 &&
      this.lastYear > 1970
    ) {
      date.setFullYear(date.getFullYear() + 100);
    }

    return date;
  }

  onCalendarSelect(inputEvent: Event) {
    const calendar = inputEvent.target as HTMLGuxCalendarElement;
    this.value = calendar.value;
    inputEvent.stopPropagation(); // Don't let both events bubble.
    this.input.emit(this.value);
    this.updateDate();
    this.inputElement.value = this.formatedValue;
    if (this.mode === CalendarModes.Range) {
      this.toInputElement.value = this.toFormatedValue;
    }
    if (
      document.activeElement !== this.inputElement ||
      document.activeElement !== this.toInputElement
    ) {
      this.active = false;
    }
  }

  setValue() {
    if (this.mode === CalendarModes.Range) {
      const fromValue = this.stringToDate(this.inputElement.value);
      const toValue = this.stringToDate(this.toInputElement.value);
      this.value = asIsoDateRange(fromValue, toValue);
      this.updateDate();
      this.calendarElement.setValue([fromValue, toValue]);
    } else {
      const date = this.stringToDate(this.inputElement.value);
      this.value = asIsoDate(date);
      this.updateDate();
      this.calendarElement.setValue(date);
    }
    this.input.emit(this.value);
  }

  setRange() {
    this.active = true;
    this.isSelectingRange = false;
    this.setIntervalRange(this.lastIntervalRange);
    this.setCursorRange();
  }

  typeYearValue(selection: string, key: string) {
    if (selection[0] !== ' ') {
      this.updateSelection(this.focusedField, `   ${key}`);
    } else {
      this.updateSelection(this.focusedField, `${selection.substr(1)}${key}`);
      if (!(selection.substr(1) + key).includes(' ')) {
        this.setValue();
      }
    }
  }

  canSetDate(key: number) {
    const newValue = parseInt(
      [
        this.focusedField.value[this.intervalRange.selectionEnd - 1].toString(),
        key
      ].join(''),
      10
    );

    if (newValue) {
      switch (
        getIntervalLetter(this.format, this.focusedField.selectionStart)
      ) {
        case 'd':
          const dateValue = fromIsoDate(this.value);
          if (
            newValue <=
            new Date(
              dateValue.getFullYear(),
              dateValue.getMonth() + 1,
              0
            ).getDate()
          ) {
            return true;
          }
          break;
        case 'm':
          if (newValue <= 12) {
            return true;
          }
          break;
        case 'y':
          return true;
      }
    }

    return false;
  }

  getMapAndRegexFromField(value: Date) {
    const map: any = {
      dd: `0${value.getDate()}`.slice(-2),
      mm: `0${value.getMonth() + 1}`.slice(-2)
    };
    if (this.yearFormat === 'yyyy') {
      map.yyyy = value.getFullYear().toString();
    } else {
      map.yy = value.getFullYear().toString().slice(-2);
    }
    const regexp = new RegExp(Object.keys(map).join('|'), 'gi');
    return {
      map,
      regexp
    };
  }

  updateDate() {
    if (this.mode === CalendarModes.Range) {
      const [from, to] = fromIsoDateRange(this.value);
      const { map: map1, regexp: regexp1 } = this.getMapAndRegexFromField(from);
      this.formatedValue = this.format.replace(regexp1, match => {
        return map1[match];
      });
      const { map: map2, regexp: regexp2 } = this.getMapAndRegexFromField(to);
      this.toFormatedValue = this.format.replace(regexp2, match => {
        return map2[match];
      });
    } else {
      const dateValue = fromIsoDate(this.value);
      const { map: map3, regexp: regexp3 } = this.getMapAndRegexFromField(
        dateValue
      );
      this.formatedValue = this.format.replace(regexp3, match => {
        return map3[match];
      });
    }
  }

  setCursorRange() {
    if (this.intervalRange) {
      this.focusedField.setSelectionRange(
        this.intervalRange.selectionStart,
        this.intervalRange.selectionEnd
      );
    }
  }

  toggleCalendar() {
    this.active = !this.active;
    if (this.active) {
      // Wait for render before focusing preview date
      setTimeout(() => {
        this.calendarElement.focusPreviewDate();
      });
    }
  }

  setIntervalRange(intervalRange: GuxDatepickerIntervalRange): void {
    this.intervalRange = intervalRange;
  }

  getCombinedFocusedDateValue(): Date {
    return this.mode === CalendarModes.Range
      ? this.getRangeFocusedDateValue()
      : this.getFocusedDateValue();
  }

  getFocusedDateValue(): Date {
    return fromIsoDate(this.value);
  }

  getRangeFocusedDateValue(): Date {
    const [start, end] = fromIsoDateRange(this.value);

    return this.focusedField === this.inputElement ? start : end;
  }

  increment(delta: number) {
    let selectionText = document.getSelection().toString();

    const interval = getIntervalLetter(
      this.format,
      this.focusedField.selectionStart
    );
    const focusedDateValue = this.getCombinedFocusedDateValue();

    switch (interval) {
      case 'd':
        selectionText = this.incrementDay(delta, focusedDateValue);
        break;
      case 'm':
        selectionText = this.incrementMonth(delta, focusedDateValue);
        break;
      case 'y':
        selectionText = this.incrementYear(delta, focusedDateValue);
        break;
    }

    this.setIntervalRange({
      selectionStart: this.focusedField.selectionStart,
      selectionEnd: this.focusedField.selectionEnd
    });

    this.updateSelection(this.focusedField, selectionText);
    this.setValue();
  }

  incrementDay(delta: number, focusedDateValue: Date): string {
    const incrementedDay = incrementDay(delta, focusedDateValue);

    if (isOutOfBoundsDate(incrementedDay, this.minDateDate, this.maxDateDate)) {
      return getFormattedDay(focusedDateValue);
    }

    return getFormattedDay(incrementedDay);
  }

  incrementMonth(delta: number, focusedDateValue: Date): string {
    const incrementedMonth = incrementMonth(delta, focusedDateValue);

    if (
      isOutOfBoundsDate(incrementedMonth, this.minDateDate, this.maxDateDate)
    ) {
      return getFormattedMonth(focusedDateValue);
    }

    return getFormattedMonth(incrementedMonth);
  }

  incrementYear(delta: number, focusedDateValue: Date): string {
    const incrementedYear = incrementYear(delta, focusedDateValue);

    if (
      isOutOfBoundsDate(incrementedYear, this.minDateDate, this.maxDateDate)
    ) {
      return getFormattedYear(focusedDateValue, this.yearFormat);
    }

    this.lastYear = incrementedYear.getFullYear();

    return getFormattedYear(incrementedYear, this.yearFormat);
  }

  async componentWillLoad() {
    trackComponent(this.root, { variant: this.mode });
    this.i18n = await buildI18nForComponent(this.root, translationResources);

    this.watchMinDate(this.minDate);
    this.watchMaxDate(this.maxDate);
    this.watchFormat(this.format);

    if (!this.value) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (this.mode === CalendarModes.Range) {
        this.value = asIsoDateRange(now, now);
      } else {
        this.value = asIsoDate(now);
      }
      if (this.mode === CalendarModes.Range && this.numberOfMonths < 2) {
        this.numberOfMonths = 2;
      }
    }
  }

  componentDidLoad() {
    this.inputElement = this.textFieldElement.querySelector('input');

    if (this.mode === CalendarModes.Range) {
      this.toInputElement = this.toTextFieldElement.querySelector('input');
    }

    this.updateDate();
  }

  render() {
    return (
      <div class={`gux-datepicker ${this.active ? 'gux-active' : ''}`}>
        <div
          class="gux-datepicker-field"
          ref={(el: HTMLDivElement) => (this.fieldDatepickerElement = el)}
        >
          <gux-text-label label={this.getCalendarLabels()[0]} position="beside">
            <gux-text-field-legacy
              type="text"
              ref={(el: HTMLGuxTextFieldLegacyElement) =>
                (this.textFieldElement = el)
              }
              value={this.formatedValue}
            >
              <button
                aria-hidden="true"
                type="button"
                onClick={() => {
                  this.toggleCalendar();
                }}
                tabindex="-1"
              >
                <gux-icon decorative iconName="ic-calendar-generic"></gux-icon>
              </button>
              <gux-calendar
                ref={(el: HTMLGuxCalendarElement) =>
                  (this.calendarElement = el)
                }
                value={this.value}
                mode={this.mode}
                onInput={(event: CustomEvent) => this.onCalendarSelect(event)}
                minDate={this.minDate}
                maxDate={this.maxDate}
                firstDayOfWeek={this.firstDayOfWeek}
                numberOfMonths={this.numberOfMonths}
              />
            </gux-text-field-legacy>
          </gux-text-label>
        </div>
        {this.mode === CalendarModes.Range && (
          <div
            class="gux-datepicker-field"
            ref={(el: HTMLDivElement) => (this.fieldDatepickerElement = el)}
          >
            <gux-text-label
              label={this.getCalendarLabels()[1]}
              position="beside"
            >
              <gux-text-field-legacy
                type="text"
                ref={(el: HTMLGuxTextFieldLegacyElement) =>
                  (this.toTextFieldElement = el)
                }
                value={this.toFormatedValue}
              >
                <button
                  aria-hidden="true"
                  type="button"
                  onClick={() => {
                    this.toggleCalendar();
                  }}
                  tabindex="-1"
                >
                  <gux-icon
                    decorative
                    iconName="ic-calendar-generic"
                  ></gux-icon>
                </button>
              </gux-text-field-legacy>
            </gux-text-label>
          </div>
        )}
      </div>
    );
  }
}
