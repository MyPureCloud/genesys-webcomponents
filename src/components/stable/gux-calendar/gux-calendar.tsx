import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Method,
  Prop,
  State
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';
import { CalendarModes, KeyCode } from '../../../common-enums';
import {
  asIsoDateRange,
  asIsoDate,
  fromIsoDateRange,
  fromIsoDate
} from '../../../utils/date/iso-dates';
import {
  addClassToElements,
  removeClassToElements
} from '../../../utils/dom/manipulate-elements-classes';
import { getDesiredLocale } from '../../../i18n';
import { GuxCalendarMode, IDateElement } from './gux-calendar.types';

@Component({
  styleUrl: 'gux-calendar.less',
  tag: 'gux-calendar'
})
export class GuxCalendar {
  @Element()
  root: HTMLElement;

  /**
   * The calendar current selected date
   */
  @Prop({ mutable: true })
  value: string = '';

  /**
   * The calendar first week day (default to 0 (sunday))
   */
  @Prop()
  firstDayOfWeek: number = 0;

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
  mode: GuxCalendarMode = CalendarModes.Single;

  /**
   * The calendar number of months displayed
   */
  @Prop()
  numberOfMonths: number = 1;

  @State()
  previewValue: Date = new Date();

  selectingDate: Date | null = null;

  /**
   * Triggered when user selects a date
   */
  @Event()
  input: EventEmitter<string>;

  private locale: string = 'en';

  emitInput() {
    this.input.emit(this.value);
  }

  /**
   * Sets new value and rerender the calendar
   */
  @Method()
  async setValue(value: Date | [Date, Date]) {
    if (this.mode === CalendarModes.Range && value instanceof Array) {
      const [date1, date2] = value;
      this.value = asIsoDateRange(date1, date2); // sorts
      this.previewValue = fromIsoDateRange(this.value)[0];
    } else {
      const selected = value as Date;
      this.value = asIsoDate(selected);
      this.previewValue = selected;
    }
  }

  /**
   * Focus the preview date
   */
  @Method()
  async focusPreviewDate() {
    const target: HTMLTableCellElement = this.root.querySelector(
      `td[data-date="${this.previewValue.getTime()}"]`
    );
    if (target) {
      target.focus();
    }
  }

  incrementPreviewDateByMonth(increment: number) {
    this.previewValue = new Date(
      this.previewValue.getFullYear(),
      this.previewValue.getMonth() + increment,
      15, // Don't use the day from the old value, because we'll skip a month on the 31st
      0,
      0,
      0
    );
    // Wait for render before focusing preview date
    setTimeout(() => {
      this.focusPreviewDate();
    });
  }

  async setValueAndEmit(value: Date | [Date, Date]) {
    this.setValue(value);
    this.emitInput();
  }

  getMonthLabel(index: number) {
    const month = new Date(this.previewValue.getTime());
    month.setMonth(month.getMonth() + index);
    const monthName = month.toLocaleString(this.locale, { month: 'long' });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  }

  firstDateInMonth(month: number, year: number) {
    const startDate = new Date(year, month, 1, 0, 0, 0, 0);
    const firstDayOfMonth = startDate.getDay();
    const firstDayOffset =
      (-1 * (this.firstDayOfWeek - firstDayOfMonth - 7)) % 7;
    return new Date(startDate.getTime() - firstDayOffset * (86400 * 1000));
  }

  outOfBounds(date: Date): boolean {
    return (
      (this.maxDate !== '' && fromIsoDate(this.maxDate) < date) ||
      (this.minDate !== '' && fromIsoDate(this.minDate) > date)
    );
  }

  generateDatesFrom(
    month: number,
    startDate: Date,
    length: number
  ): IDateElement[] {
    const arr = [];
    const currentDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      0,
      0,
      0,
      0
    );
    for (let i = 0; i < length; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        0,
        0,
        0,
        0
      );
      const classes = [];
      let hidden = false;
      if (date.getMonth() !== month) {
        classes.push('gux-not-in-month');
        if (this.mode === CalendarModes.Range) {
          classes.push('gux-hidden');
          hidden = true;
        }
      }

      let disabled = false;
      if (this.outOfBounds(date)) {
        classes.push('gux-disabled');
        disabled = true;
      }

      let isSelected = false;
      if (this.mode === CalendarModes.Range) {
        const [start, end] = fromIsoDateRange(this.value);
        const fromTimeStamp = start.getTime();
        const toTimeStamp = end.getTime();
        if (
          date.getTime() === fromTimeStamp ||
          date.getTime() === toTimeStamp
        ) {
          isSelected = true;
          classes.push('gux-selected');
        }
      } else {
        const selectedTimestamp = fromIsoDate(this.value).getTime();
        if (date.getTime() === selectedTimestamp) {
          isSelected = true;
          classes.push('gux-selected');
        }
      }
      arr.push({
        class: classes.join(' '),
        date,
        hidden,
        disabled,
        selected: isSelected
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return arr;
  }

  create2DArray(arr: any[], chunkSize: number): IDateElement[][] {
    const result = [];
    for (let i = 0; i < chunkSize - 1; i++) {
      const week = arr.slice(i * chunkSize, i * chunkSize + chunkSize);
      if (this.weekShouldBeDisplayed(week)) {
        result.push(week);
      }
    }
    return result;
  }

  weekShouldBeDisplayed(week: IDateElement[]): boolean {
    const hasNonHiddenDate = week.find(date => {
      return !date.hidden;
    });
    return week.length && !!hasNonHiddenDate;
  }

  getMonthDays(index: number): IDateElement[][] {
    const month = new Date(this.previewValue.getTime());
    month.setMonth(month.getMonth() + index);
    const monthIndex = month.getMonth();
    const year = month.getFullYear();
    const startDate = this.firstDateInMonth(monthIndex, year);
    const datesArray = this.generateDatesFrom(monthIndex, startDate, 42);
    return this.create2DArray(datesArray, 7);
  }

  addDays(date: Date, days: number): Date {
    const newDate = new Date(date.valueOf());
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  getAllDatesElements(): HTMLTableDataCellElement[] {
    const targets = this.root.querySelectorAll('td');
    return Array.from(targets);
  }

  getAllSelectableDatesElements(): HTMLTableDataCellElement[] {
    const targets = this.root.querySelectorAll(
      'td[tabindex="0"]'
    ) as NodeListOf<HTMLTableDataCellElement>;
    return Array.from(targets);
  }

  getRangeDatesElements(from: Date, to: Date): HTMLTableCellElement[] {
    const elements = [];
    let rangeDates;
    if (to < from) {
      rangeDates = this.getRangeDates(to, from);
    } else {
      rangeDates = this.getRangeDates(from, to);
    }
    for (const date of rangeDates) {
      const target: HTMLTableCellElement = this.root.querySelector(
        `td[data-date="${date.getTime()}"]:not(.hidden)`
      );
      if (target) {
        elements.push(target);
      }
    }
    return elements;
  }

  getRangeDates(from: Date, to: Date): Date[] {
    const array = [];
    let currentDate = from;
    while (currentDate <= to) {
      array.push(new Date(currentDate));
      currentDate = this.addDays(currentDate, 1);
    }
    return array;
  }

  onDateClick(date: Date) {
    if (!this.outOfBounds(date)) {
      if (this.mode !== CalendarModes.Range) {
        this.setValueAndEmit(date);
      } else {
        if (this.selectingDate === null) {
          // First click
          removeClassToElements(this.getAllDatesElements(), 'gux-hovered');
          this.selectingDate = date;
          this.value = asIsoDateRange(date, date);
        } else {
          // Second click
          const target: HTMLTableCellElement = this.root.querySelector(
            `td[data-date="${date.getTime()}"]`
          );
          if (target) {
            target.classList.add('gux-selected');
          }
          this.updateRangeElements();
          this.setValueAndEmit([this.selectingDate, date]);
          this.selectingDate = null;
        }
      }
      this.focusPreviewDate();
    }
  }

  onDateMouseEnter(date: Date) {
    if (this.mode === CalendarModes.Range && this.selectingDate !== null) {
      this.value = asIsoDateRange(date, this.selectingDate);
      this.updateRangeElements();
    }
  }

  updateRangeElements() {
    if (this.mode === CalendarModes.Range) {
      removeClassToElements(this.getAllDatesElements(), 'gux-hovered');
      const [start, end] = fromIsoDateRange(this.value);
      const rangeElements = this.getRangeDatesElements(start, end);
      addClassToElements(rangeElements, 'gux-hovered');
    }
  }

  onKeyDown(e: KeyboardEvent) {
    switch (e.keyCode) {
      case KeyCode.Enter:
      case KeyCode.Space:
        this.onDateClick(this.previewValue);
        break;
      case KeyCode.Down:
        this.previewValue = new Date(
          this.previewValue.setDate(this.previewValue.getDate() + 7)
        );
        this.onDateMouseEnter(this.previewValue);
        this.focusPreviewDate();
        break;
      case KeyCode.Up:
        this.previewValue = new Date(
          this.previewValue.setDate(this.previewValue.getDate() - 7)
        );
        this.onDateMouseEnter(this.previewValue);
        this.focusPreviewDate();
        break;
      case KeyCode.Left:
        this.previewValue = new Date(
          this.previewValue.setDate(this.previewValue.getDate() - 1)
        );
        this.onDateMouseEnter(this.previewValue);
        this.focusPreviewDate();
        break;
      case KeyCode.Right:
        this.previewValue = new Date(
          this.previewValue.setDate(this.previewValue.getDate() + 1)
        );
        this.onDateMouseEnter(this.previewValue);
        this.focusPreviewDate();
        break;
      case KeyCode.PageUp:
        this.incrementPreviewDateByMonth(1);
        this.onDateMouseEnter(this.previewValue);
        break;
      case KeyCode.PageDown:
        this.incrementPreviewDateByMonth(-1);
        this.onDateMouseEnter(this.previewValue);
        break;
    }
  }

  shiftArray(arr: string[], n: number): string[] {
    const times = n > arr.length ? n % arr.length : n;
    return arr.concat(arr.splice(0, times));
  }

  getWeekdays(): string[] {
    const days = [];
    // Sunday
    const day = new Date(1970, 0, 4);
    for (let i = 0; i < 7; i++) {
      const weekday = day.toLocaleString(this.locale, { weekday: 'narrow' });
      days.push(weekday);
      day.setDate(day.getDate() + 1);
    }
    return this.shiftArray(days, this.firstDayOfWeek);
  }

  componentWillLoad() {
    trackComponent(this.root, { variant: this.mode });
    this.locale = getDesiredLocale(this.root);

    if (!this.value) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (this.mode === CalendarModes.Range) {
        this.value = asIsoDateRange(now, now);
      } else {
        this.value = asIsoDate(now);
      }
    }
    this.previewValue = fromIsoDate(this.value);
  }

  componentDidRender() {
    this.updateRangeElements();
  }

  renderMonthHeader() {
    return (
      <div class="gux-month-list">
        {Array.from(Array(this.numberOfMonths).keys()).map(index => (
          <label>
            {this.getMonthLabel(index)} {this.previewValue.getFullYear()}
          </label>
        ))}
      </div>
    );
  }

  renderCalendarTable(index) {
    return (
      <table cellPadding="2">
        <tr>
          {this.getWeekdays().map(day => (
            <th>{day}</th>
          ))}
        </tr>
        {this.getMonthDays(index).map(week => (
          <tr>
            {week.map(day => (
              <td
                tabindex={day.selected ? '0' : '-1'}
                class={day.class}
                aria-hidden={day.hidden ? 'true' : 'false'}
                data-date={day.date.getTime()}
                onClick={() => this.onDateClick(day.date)}
                onMouseEnter={() => this.onDateMouseEnter(day.date)}
                onKeyDown={e => this.onKeyDown(e)}
              >
                {day.date.getDate()}
              </td>
            ))}
          </tr>
        ))}
      </table>
    );
  }

  render() {
    return (
      <div class="gux-calendar">
        <div class="gux-header">
          <button
            type="button"
            class="gux-left"
            onClick={() => this.incrementPreviewDateByMonth(-1)}
            tabindex="-1"
            aria-hidden="true"
          >
            <gux-icon decorative iconName="ic-chevron-small-left"></gux-icon>
          </button>
          {this.renderMonthHeader()}
          <button
            type="button"
            class="gux-right"
            onClick={() => this.incrementPreviewDateByMonth(1)}
            tabindex="-1"
            aria-hidden="true"
          >
            <gux-icon decorative iconName="ic-chevron-small-right"></gux-icon>
          </button>
        </div>
        <div class="gux-content">
          {Array.from(Array(this.numberOfMonths).keys()).map(index =>
            this.renderCalendarTable(index)
          )}
        </div>
      </div>
    );
  }
}
