import { Component, h, Element, Host, JSX } from '@stencil/core';
import { trackComponent } from '../../../usage-tracking';

/**
 * @slot icon - Required slot for gux-icon
 * @slot title - Required slot for the action toast title
 * @slot message - Required slot for the action toast message
 * @slot negitive-button - Required slot for the action toast negitive button
 * @slot positive-button - Required slot for the action toast positive button
 */
@Component({
  styleUrl: 'gux-action-toast.less',
  tag: 'gux-action-toast'
})
export class GuxActionToast {
  @Element()
  private root: HTMLElement;

  componentWillLoad() {
    trackComponent(this.root);
  }

  render(): JSX.Element {
    return (
      <Host>
        <div class="gux-header">
          <div class="gux-icon">
            <slot name="icon" />
          </div>

          <div class="gux-title">
            <slot name="title" />
          </div>
        </div>

        <div class="gux-message">
          <slot name="message" />
        </div>

        <div class="gux-action-buttons">
          <div class="gux-negitive-button">
            <slot name="negitive-button" />
          </div>

          <div class="gux-positive-button">
            <slot name="positive-button" />
          </div>
        </div>
      </Host>
    );
  }
}
