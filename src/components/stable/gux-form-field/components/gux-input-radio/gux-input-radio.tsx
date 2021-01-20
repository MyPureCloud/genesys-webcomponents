import { Component, h, JSX } from '@stencil/core';

/**
 * @slot input - Required slot for input[type="radio"]
 * @slot label - Required slot for label
 */
@Component({
  styleUrl: 'gux-input-radio.less',
  tag: 'gux-input-radio'
})
export class GuxInputRadio {
  render(): JSX.Element {
    return (
      <div class="gux-input-radio-container">
        <slot name="input" />
        <slot name="label" />
      </div>
    );
  }
}
