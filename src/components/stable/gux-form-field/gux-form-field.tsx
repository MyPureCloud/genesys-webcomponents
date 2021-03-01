import { Component, Element, h, JSX, Prop, State } from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';

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

  @Element()
  private root: HTMLElement;

  @Prop()
  clearable: boolean;

  @State()
  private type: string;

  @State()
  private labelPosition: 'above' | 'beside' = 'above';

  componentWillLoad() {
    this.input = this.root.querySelector(
      'input[slot="input"], select[slot="input"]'
    );
    this.label = this.root.querySelector('label[slot="label"]');
    this.type = this.input.getAttribute('type');

    trackComponent(this.root, { variant: this.type });
  }

  componentWillRender() {
    if (this.label) {
      this.labelPosition = this.label.offsetWidth < 40 ? 'beside' : 'above';
    }
  }

  private getInputCheckbox(): JSX.Element {
    return (
      <gux-input-checkbox>
        <slot name="input" />
        <slot name="label" />
      </gux-input-checkbox>
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

  private getInputColor(): JSX.Element {
    return (
      <div class="gux-label-and-input-and-error-container">
        <div class={`gux-label-and-input-container gux-${this.labelPosition}`}>
          <slot name="label" slot="label" />
          <gux-input-color>
            <slot name="input" />
          </gux-input-color>
        </div>
        <div class="gux-error">
          <slot name="error" />
        </div>
      </div>
    );
  }

  private getInputRange(): JSX.Element {
    return (
      <div class="guxlabel-and-input-and-error-container">
        <div class={`gux-label-and-input-container gux-${this.labelPosition}`}>
          <slot name="label" slot="label" />
          <gux-input-range>
            <slot name="input" />
          </gux-input-range>
        </div>
        <div class="gux-error">
          <slot name="error" />
        </div>
      </div>
    );
  }

  private getInputNumber(clearable: boolean): JSX.Element {
    return (
      <div class="gux-label-and-input-and-error-container">
        <div class={`gux-label-and-input-container gux-${this.labelPosition}`}>
          <slot name="label" slot="label" />
          <gux-input-number slot="input" clearable={clearable}>
            <slot name="input" />
          </gux-input-number>
        </div>
        <div class="gux-error">
          <slot name="error" />
        </div>
      </div>
    );
  }

  private getInputTextLike(clearable: boolean): JSX.Element {
    return (
      <div class="gux-label-and-input-and-error-container">
        <div class={`gux-label-and-input-container gux-${this.labelPosition}`}>
          <slot name="label" slot="label" />
          <gux-input-text-like slot="input" clearable={clearable}>
            <slot name="input" />
          </gux-input-text-like>
        </div>
        <div class="gux-error">
          <slot name="error" />
        </div>
      </div>
    );
  }

  render(): JSX.Element {
    switch (this.type) {
      case 'checkbox':
        return this.getInputCheckbox();
      case 'radio':
        return this.getInputRadio();
      case 'color':
        return this.getInputColor();
      case 'range':
        return this.getInputRange();
      case 'email':
      case 'password':
      case 'select':
      case 'text':
        return this.getInputTextLike(this.clearable);
      case 'number':
        return this.getInputNumber(this.clearable);
      case 'search':
        return this.getInputTextLike(false);
      default:
        return (
          <div>
            <slot name="label" />
            <slot name="input" />
          </div>
        );
    }
  }
}
