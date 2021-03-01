import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';

import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import { ErrorMessageType } from '../../../common-enums';
import { trackComponent } from '../../../usage-tracking';

import textFieldResources from './i18n/en.json';

@Component({
  styleUrl: 'gux-text-field.less',
  tag: 'gux-text-field-legacy'
})
export class GuxTextFieldLegacy {
  @Element()
  root: HTMLElement;

  inputElement: HTMLInputElement;

  /**
   * Indicate the input value
   */
  @Prop({ mutable: true, reflectToAttr: true })
  value: string = '';

  /**
   * Indicate the input type
   */
  @Prop()
  type: 'text' | 'email' | 'password' | 'number' = 'text';

  /**
   * Disable the input and prevent interactions.
   */
  @Prop()
  disabled: boolean = false;

  /**
   * Set the input in readonly mode
   */
  @Prop()
  readonly: boolean = false;

  /**
   * The input placeholder.
   */
  @Prop()
  placeholder: string;

  /**
   * The input validation.
   */
  @Prop()
  validation: any | `(newValue: string) => any` | RegExp = null;

  /**
   * The message displayed on validation failure.
   */
  @Prop({ mutable: true })
  errorMessage: string = '';

  /**
   * The message type (warning or error)
   */
  @Prop({ mutable: true })
  errorMessageType: ErrorMessageType.Error | ErrorMessageType.Warning =
    ErrorMessageType.Error;

  /**
   * Timeout between input and validation.
   */
  @Prop()
  debounceTimeout: number = 500;

  /**
   * The label for the erase button
   */
  @Prop()
  eraseLabel: string = '';

  /**
   * Determines whether or not the 'x' clear button is displayed when the input
   * contains text.
   */
  @Prop()
  useClearButton: boolean = true;

  /**
   * Aria label to use in case the text field
   * does not have an actual label.
   */
  @Prop()
  srLabel: string;

  @State()
  srLabelledby: string;

  @State()
  classList: string[] = [];

  @State()
  internalErrorMessage: string;
  firstValue: string;
  timeout: any;

  showClearButton(): boolean {
    return this.useClearButton && this.value && !this.readonly;
  }

  /**
   * Triggered when user inputs.
   * @return The input value
   */
  @Event()
  input: EventEmitter;

  private i18n: GetI18nValue;

  emitInput(event) {
    event.preventDefault();
    event.stopPropagation();
    this.value = event.target.value;
    this.input.emit(event.target.value);
  }

  emitFocusEvent(event) {
    this.root.dispatchEvent(new FocusEvent(event.type, event));
  }

  @Watch('value')
  watchValue(newValue: string) {
    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      this._testValue(newValue);
    }, this.debounceTimeout);
  }

  _testValue(value: string) {
    if (!this.validation) {
      return;
    }
    if (this.validation instanceof RegExp) {
      if (!this.validation.test(value)) {
        this.errorMessageType = ErrorMessageType.Error;
        this.errorMessage = this.internalErrorMessage;
      } else {
        this.errorMessage = '';
      }
    } else if (typeof this.validation === 'function') {
      const validation = this.validation(value);
      if (validation) {
        if (validation.warning) {
          this.errorMessageType = ErrorMessageType.Warning;
          this.errorMessage = validation.warning;
        } else if (validation.error) {
          this.errorMessageType = ErrorMessageType.Error;
          this.errorMessage = validation.error;
        } else {
          this.errorMessage = '';
        }
      } else {
        this.errorMessageType = ErrorMessageType.Error;
        this.errorMessage = this.internalErrorMessage;
      }
    }
  }

  getClassList(): string {
    let classList = [];
    if (this.errorMessage) {
      classList = [...classList, `gux-${this.errorMessageType}`];
    }
    if (this.disabled) {
      classList = [...classList, 'gux-disabled'];
    }
    return classList.join(' ');
  }

  async componentWillLoad() {
    trackComponent(this.root, { variant: this.type });
    this.internalErrorMessage = this.errorMessage;
    this.i18n = await buildI18nForComponent(this.root, textFieldResources);
  }

  componentDidLoad() {
    this.firstValue = this.value;
    this._testValue(this.value);
  }

  getIconByMessageType(type) {
    return type === 'warning' ? 'ic-alert-triangle' : 'ic-alert-octo';
  }

  /**
   * Clears the input.
   */
  @Method()
  async clear() {
    if (this.disabled) {
      return;
    }
    this.value = '';
    this.inputElement.value = '';
    this.inputElement.focus();
    this.input.emit(this.value);
  }

  /**
   * Provides an aria-labelledby element for this component.
   * @param id The value for aria-labeledby.
   */
  @Method()
  async setLabelledBy(id: string) {
    this.srLabelledby = id;
  }

  /**
   * Sets the input focus to the text input.
   */
  @Method()
  async setInputFocus() {
    this.inputElement.focus();
  }

  render() {
    return (
      <div class={this.getClassList()}>
        <div class="gux-field">
          <input
            class={this.showClearButton() ? 'gux-text-clearable' : ''}
            type={this.type}
            value={this.value}
            ref={el => (this.inputElement = el)}
            aria-label={this.srLabel}
            aria-labelledby={this.srLabelledby}
            disabled={this.disabled}
            readonly={this.readonly}
            placeholder={this.placeholder}
            onInput={e => this.emitInput(e)}
            onFocus={e => this.emitFocusEvent(e)}
            onBlur={e => this.emitFocusEvent(e)}
          />
          {this.showClearButton() && (
            <button
              type="button"
              class="gux-clear-button"
              title={this.eraseLabel}
              aria-label={this.i18n('eraseBtnAria')}
              onClick={() => this.clear()}
            >
              <gux-icon decorative iconName="ic-close"></gux-icon>
            </button>
          )}
        </div>
        {this.errorMessage && (
          <div class="gux-error">
            <gux-icon
              decorative
              iconName={this.getIconByMessageType(this.errorMessageType)}
            />
            <label>{this.errorMessage}</label>
          </div>
        )}
      </div>
    );
  }
}
