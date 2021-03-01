import { Component, Element, h } from '@stencil/core';
import { trackComponent } from '../../../usage-tracking';

/**
 * @slot error - Required slot for error
 */
@Component({
  styleUrl: 'gux-error-message-beta.less',
  tag: 'gux-error-message-beta'
})
export class GuxErrorMessageBeta {
  @Element()
  private root: HTMLElement;

  componentWillLoad(): void {
    trackComponent(this.root);
  }

  render() {
    return (
      <div class="gux-container">
        <div class="gux-icon">
          <gux-icon icon-name="ic-error-bold" decorative></gux-icon>
        </div>
        <div class="gux-message">
          <slot slot="error" />
        </div>
      </div>
    );
  }
}
