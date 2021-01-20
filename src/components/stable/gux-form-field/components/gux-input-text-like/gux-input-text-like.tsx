import { Component, h, JSX } from '@stencil/core';

/**
 * @slot input - Required slot for input[type="radio"]
 * @slot label - Required slot for label
 */
@Component({
  styleUrl: 'gux-input-text-like.less',
  tag: 'gux-input-text-like'
})
export class GuxInputTextLike {
  render(): JSX.Element {
    return <slot name="input" />;
  }
}
