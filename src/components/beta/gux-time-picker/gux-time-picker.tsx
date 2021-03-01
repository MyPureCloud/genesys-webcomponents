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
import { KeyCode } from '../../../common-enums';
import { fromIsoTime } from '../../../utils/date/from-iso-time-string';
import { trackComponent } from '../../../usage-tracking';

const MAX_TIME: string = '23:59:59';
const MIN_TIME: string = '00:00:00';
const DEFAULT_INTERVAL: number = 15;

@Component({
  styleUrl: 'gux-time-picker.less',
  tag: 'gux-time-picker-beta'
})
export class GuxTimePicker {
  @Element()
  root: HTMLElement;

  @Prop({ mutable: true, reflectToAttr: true })
  value: string = '';

  @Prop({ mutable: true })
  interval: number = DEFAULT_INTERVAL;

  @Prop({ mutable: true })
  max: string = MAX_TIME;

  @Prop({ mutable: true })
  min: string = MIN_TIME;

  @State()
  active: boolean = false;

  @State()
  openDropdown: boolean = false;

  @State()
  suggestion: string = '00';

  @Event()
  changed: EventEmitter<any>;

  inputElement: HTMLInputElement;
  focusedField: HTMLInputElement;
  dropdownList: HTMLGuxListElement;
  maxTimeObj: Date;
  minTimeObj: Date;
  isPressEvent: boolean = false;

  @Watch('value')
  watchValue(newValue) {
    this.changed.emit(newValue);
  }

  @Listen('keydown', { passive: false })
  onKeyDown(e: KeyboardEvent) {
    this.focusedField = e.target as HTMLInputElement;
    if (this.focusedField === this.inputElement) {
      switch (e.keyCode) {
        case KeyCode.Enter:
        case KeyCode.Esc:
          this.focusedField.blur();
          break;
        case KeyCode.Backsp:
          e.preventDefault();
          this.handleBackspace();
          break;
        case KeyCode.Tab:
          break;
        case KeyCode.Down:
          if (this.dropdownList) {
            this.dropdownList.setFocusOnFirstItem();
          }
          break;
        case KeyCode.Up:
        case KeyCode.Right:
        case KeyCode.Left:
          e.preventDefault();
          break;
        default:
          e.preventDefault();
          if (48 <= e.keyCode && e.keyCode <= 57) {
            this.openDropdown = true;
            if (this.focusedField.value.length < 8) {
              let newValue = this.focusedField.value + parseInt(e.key, 10);
              const arr = newValue.split(':');
              if (newValue.length > 6 && Number(arr[2].padEnd(2, '0')) > 59) {
                return;
              }
              if (!this.canBeCompletedToAValidTime(newValue)) {
                return;
              }
              if (arr[arr.length - 1].length === 2 && newValue.length < 8) {
                newValue += ':';
              }
              this.focusedField.value = newValue;
              this.suggestion = arr[0].padEnd(2, '0');
            }
          }
      }
    }
  }

  canBeCompletedToAValidTime(str: string) {
    const max = fromIsoTime(str + this.max.slice(str.length));
    const min = fromIsoTime(str + this.min.slice(str.length));
    if (
      (this.minTimeObj <= max && max <= this.maxTimeObj) ||
      (this.minTimeObj <= min && min <= this.maxTimeObj)
    ) {
      return true;
    }
    return false;
  }

  handleBackspace() {
    this.openDropdown = true;
    if (this.focusedField.selectionStart === this.focusedField.selectionEnd) {
      const newEnd = this.focusedField.value.endsWith(':') ? -2 : -1;
      this.focusedField.value = this.focusedField.value.slice(0, newEnd);
      this.suggestion = this.focusedField.value.split(':')[0].padEnd(2, '0');
    } else {
      this.focusedField.value = '';
    }
  }

  @Listen('press', { passive: false })
  onPress(e: CustomEvent) {
    this.isPressEvent = true;
    const chosenTimeOption = e.target as HTMLGuxListItemElement;
    this.inputElement.value = chosenTimeOption.value;
    this.updateChosenValue();
  }

  @Listen('focusout')
  onFocusOut(e: FocusEvent) {
    if (!this.isPressEvent && !this.root.contains(e.relatedTarget as Node)) {
      this.updateChosenValue();
    }
    this.isPressEvent = false;
  }

  updateChosenValue() {
    this.inputElement.value = this.validateValue(this.inputElement.value);
    this.value = this.inputElement.value;
    this.active = false;
    this.openDropdown = false;
  }

  @Listen('mouseup')
  onMouseUp(e: MouseEvent) {
    this.focusedField = e.target as HTMLInputElement;
    if (this.focusedField === this.inputElement) {
      if (this.focusedField.selectionEnd !== this.inputElement.value.length) {
        this.inputElement.setSelectionRange(0, this.inputElement.value.length);
      } else {
        this.inputElement.setSelectionRange(
          this.inputElement.value.length,
          this.inputElement.value.length
        );
      }
    }
  }

  @Listen('focusin')
  onFocusIn(e: FocusEvent) {
    this.focusedField = e.target as HTMLInputElement;
    this.active = true;
  }

  isValidTime(time: string): boolean {
    const postionArray = time.split(':');
    const maxTimeArray = MAX_TIME.split(':');
    for (let i = 0; i < postionArray.length; i++) {
      if (Number(postionArray[i]) > Number(maxTimeArray[i])) {
        return false;
      }
    }
    return true;
  }

  validateUpperBound() {
    this.max = this.isInFormat(this.max) ? this.max : MAX_TIME;
    this.max = this.isValidTime(this.max) ? this.max : MAX_TIME;
  }

  validateLowerBound() {
    this.min = this.isInFormat(this.min) ? this.min : MIN_TIME;
    this.min = this.isValidTime(this.min) ? this.min : MIN_TIME;
  }

  validateBounds() {
    this.validateUpperBound();
    this.validateLowerBound();
    this.maxTimeObj = fromIsoTime(this.max);
    this.minTimeObj = fromIsoTime(this.min);
    if (this.maxTimeObj < this.minTimeObj) {
      this.max = MAX_TIME;
      this.min = MIN_TIME;
      this.maxTimeObj = fromIsoTime(this.max);
      this.minTimeObj = fromIsoTime(this.min);
    }
  }

  validateValue(value: string) {
    let validatedValue = this.isInFormat(value) ? value : '';
    validatedValue =
      validatedValue !== '' && this.isValidTime(validatedValue)
        ? validatedValue
        : '';
    if (validatedValue) {
      const valueTimeObj = fromIsoTime(validatedValue);
      validatedValue =
        this.minTimeObj <= valueTimeObj && valueTimeObj <= this.maxTimeObj
          ? validatedValue
          : '';
    }
    return validatedValue;
  }

  componentWillLoad() {
    trackComponent(this.root);
    this.validateBounds();
    this.value = this.validateValue(this.value);
  }

  isInFormat(value: string): boolean {
    const regex = /^\d{2}:\d{2}:\d{2}$/;
    return regex.test(value);
  }

  render() {
    return (
      <div>
        <div class="gux-input">
          <input
            type="text"
            value={this.value}
            size={9}
            class={this.active ? 'gux-focused' : ''}
            ref={el => (this.inputElement = el)}
          ></input>
        </div>
        {this.openDropdown === true && (
          <div class="gux-list-container">
            <gux-list ref={el => (this.dropdownList = el)}>
              {this.buildDropdownOptions().map(value => {
                return (
                  <gux-list-item value={value} text={value}></gux-list-item>
                );
              })}
            </gux-list>
          </div>
        )}
      </div>
    );
  }

  buildDropdownOptions(): string[] {
    const dropDownOptions: string[] = [];
    for (let i = 0; i < 60; i += this.interval) {
      const time = [
        this.suggestion.toString().padStart(2, '0'),
        i.toString().padStart(2, '0'),
        '00'
      ].join(':');
      const timeObj = fromIsoTime(time);
      if (this.minTimeObj <= timeObj && timeObj <= this.maxTimeObj) {
        dropDownOptions.push(time);
      }
    }
    return dropDownOptions;
  }
}
