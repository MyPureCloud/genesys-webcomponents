import { Component, Element, h, JSX, Prop, State } from '@stencil/core';

import { randomHTMLId } from '../../../utils/dom/random-html-id';
import { OnMutation } from '../../../utils/decorator/on-mutation';
import { onRequiredChange } from '../../../utils/dom/on-attribute-change';
import { trackComponent } from '../../../usage-tracking';

import { GuxInputTextAreaResize } from './components/gux-input-textarea/gux-input-textarea.types';
/**
 * @slot input - Required slot for input tag
 * @slot label - Required slot for label tag
 */
@Component({
  styleUrl: 'gux-form-field.less',
  tag: 'gux-form-field'
})
export class GuxFormField {
  private input: HTMLInputElement;
  private label: HTMLLabelElement;
  private requiredObserver: MutationObserver;
  private errorID = randomHTMLId('gux-form-field');

  @Element()
  private root: HTMLElement;

  @Prop()
  clearable: boolean;

  @Prop()
  resize: GuxInputTextAreaResize;

  @Prop()
  displayUnits: string;

  @Prop()
  valueInTooltip: boolean;

  @State()
  private slottedElementType: string = 'input' || 'select' || 'textarea';

  @State()
  private labelPosition: 'above' | 'beside' = 'above';

  @State()
  private required: boolean = true;

  @State()
  private hasError: boolean = false;

  @OnMutation({ childList: true, subtree: true })
  onMutation(): void {
    this.hasError = Boolean(this.root.querySelector('[slot="error"]'));
  }

  componentWillLoad() {
    this.input = this.root.querySelector(
      'input[slot="input"], select[slot="input"], textarea[slot="input"]'
    );
    this.label = this.root.querySelector('label[slot="label"]');

    const type = this.input.getAttribute('type');
    this.slottedElementType = this.input.tagName.toLowerCase();

    // stops the html5 validation styling
    this.input.addEventListener('invalid', event => {
      event.preventDefault();
    });

    let variant = this.slottedElementType;
    if (this.slottedElementType === 'input') {
      variant = this.slottedElementType.concat('-').concat(type);
    }

    trackComponent(this.root, { variant });

    this.required = this.input.required;

    this.requiredObserver = onRequiredChange(
      this.input,
      (required: boolean) => {
        this.required = required;
      }
    );
  }

  componentWillRender() {
    if (this.label) {
      this.labelPosition =
        this.label.offsetWidth > 1 && this.label.offsetWidth < 40
          ? 'beside'
          : 'above';
    }
  }

  disconnectedCallback(): void {
    this.requiredObserver.disconnect();
  }

  private getInputCheckbox(hasError: boolean): JSX.Element {
    return (
      <div>
        <gux-input-checkbox
          class={{ 'gux-input-error': hasError }}
          aria-describedby={this.errorID}
        >
          <slot name="input" />
          <slot name="label" />
        </gux-input-checkbox>
        {this.getError(hasError)}
      </div>
    );
  }

  private getInputRadio(): JSX.Element {
    return (
      <gux-input-radio>
        <slot name="input" />
        <slot name="label" />
      </gux-input-radio>
    );
  }

  private getInputColor(hasError: boolean): JSX.Element {
    return (
      <div
        class={`gux-label-and-input-and-error-container gux-${this.labelPosition}`}
      >
        <div class="gux-label-and-input-container">
          <div
            class={{
              'gux-label-container': true,
              'gux-required': this.required
            }}
          >
            <slot name="label" slot="label" />
          </div>
          <gux-input-color
            class={{
              'gux-input-error': hasError
            }}
            aria-describedby={this.errorID}
          >
            <slot name="input" />
          </gux-input-color>
        </div>
        {this.getError(hasError)}
      </div>
    );
  }

  private getInputRange(
    displayUnits: string,
    valueInTooltip: boolean
  ): JSX.Element {
    return (
      <div
        class={`gux-label-and-input-and-error-container gux-${this.labelPosition}`}
      >
        <div class="gux-label-and-input-container">
          <div
            class={{
              'gux-label-container': true,
              'gux-required': this.required
            }}
          >
            <slot name="label" slot="label" />
          </div>
          <gux-input-range
            display-units={displayUnits}
            value-in-tooltip={valueInTooltip}
          >
            <slot name="input" />
          </gux-input-range>
        </div>
      </div>
    );
  }

  private getInputNumber(clearable: boolean, hasError: boolean): JSX.Element {
    return (
      <div
        class={`gux-label-and-input-and-error-container gux-${this.labelPosition}`}
      >
        <div class="gux-label-and-input-container">
          <div
            class={{
              'gux-label-container': true,
              'gux-required': this.required
            }}
          >
            <slot name="label" slot="label" />
          </div>
          <gux-input-number
            class={{
              'gux-input-error': hasError
            }}
            slot="input"
            clearable={clearable}
            aria-describedby={this.errorID}
          >
            <slot name="input" />
          </gux-input-number>
        </div>
        {this.getError(hasError)}
      </div>
    );
  }

  private getInputSelect(hasError: boolean): JSX.Element {
    return (
      <div
        class={`gux-label-and-input-and-error-container gux-${this.labelPosition}`}
      >
        <div class="gux-label-and-input-container">
          <div
            class={{
              'gux-label-container': true,
              'gux-required': this.required
            }}
          >
            <slot name="label" slot="label" />
          </div>
          <gux-input-select
            slot="input"
            class={{
              'gux-input-error': hasError
            }}
            aria-describedby={this.errorID}
          >
            <slot name="input" />
          </gux-input-select>
        </div>
        {this.getError(hasError)}
      </div>
    );
  }

  private getInputTextLike(clearable: boolean, hasError: boolean): JSX.Element {
    return (
      <div
        class={`gux-label-and-input-and-error-container gux-${this.labelPosition}`}
      >
        <div class="gux-label-and-input-container">
          <div
            class={{
              'gux-label-container': true,
              'gux-required': this.required
            }}
          >
            <slot name="label" slot="label" />
          </div>
          <gux-input-text-like
            class={{
              'gux-input-error': hasError
            }}
            slot="input"
            clearable={clearable}
            aria-describedby={this.errorID}
          >
            <slot name="input" />
          </gux-input-text-like>
        </div>
        {this.getError(hasError)}
      </div>
    );
  }

  private getInputSearch(hasError: boolean): JSX.Element {
    return (
      <div
        class={`gux-label-and-input-and-error-container gux-${this.labelPosition}`}
      >
        <div class="gux-label-and-input-container">
          <div
            class={{
              'gux-label-container': true,
              'gux-required': this.required
            }}
          >
            <slot name="label" slot="label" />
          </div>
          <gux-input-search>
            <slot name="input" />
          </gux-input-search>
        </div>
        {this.getError(hasError)}
      </div>
    );
  }

  private getInputTextArea(hasError: boolean): JSX.Element {
    return (
      <div
        class={`gux-label-and-input-and-error-container gux-${this.labelPosition}`}
      >
        <div class="gux-label-and-input-container">
          <div
            class={{
              'gux-label-container': true,
              'gux-required': this.required
            }}
          >
            <slot name="label" slot="label" />
          </div>
          <gux-input-textarea
            class={{
              'gux-input-error': hasError
            }}
            slot="input"
            aria-describedby={this.errorID}
            resize={this.resize}
          >
            <slot name="input" />
          </gux-input-textarea>
        </div>
        {this.getError(hasError)}
      </div>
    );
  }

  render(): JSX.Element {
    const type = this.input.getAttribute('type');

    switch (this.slottedElementType) {
      case 'input':
        switch (type) {
          case 'checkbox':
            return this.getInputCheckbox(this.hasError);
          case 'radio':
            return this.getInputRadio();
          case 'color':
            return this.getInputColor(this.hasError);
          case 'range':
            return this.getInputRange(this.displayUnits, this.valueInTooltip);
          case 'email':
          case 'password':
          case 'text':
            return this.getInputTextLike(this.clearable, this.hasError);
          case 'number':
            return this.getInputNumber(this.clearable, this.hasError);
          case 'search':
            return this.getInputSearch(this.hasError);
          default:
            return (
              <div>
                <slot name="label" />
                <slot name="input" />
                <slot name="error" />
              </div>
            );
        }
      case 'select':
        return this.getInputSelect(this.hasError);
      case 'textarea':
        return this.getInputTextArea(this.hasError);
      default:
        return (
          <div>
            <slot name="label" />
            <slot name="input" />
            <slot name="error" />
          </div>
        );
    }
  }

  private getError(hasError: boolean): JSX.Element {
    return (
      <div
        id={this.errorID}
        class={{
          'gux-error': true,
          'gux-show': hasError
        }}
      >
        <gux-error-message-beta>
          <slot name="error" />
        </gux-error-message-beta>
      </div>
    );
  }
}
