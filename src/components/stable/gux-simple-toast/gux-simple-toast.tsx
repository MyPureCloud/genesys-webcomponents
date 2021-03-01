import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  JSX,
  Prop
} from '@stencil/core';

import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import { trackComponent } from '../../../usage-tracking';

import modalComponentResources from './i18n/en.json';
import { GuxSimpleToastAccent } from './gux-simple-toast.types';

/**
 * @slot icon - Required slot for gux-icon
 * @slot message - Required slot for the simple toast message
 */
@Component({
  styleUrl: 'gux-simple-toast.less',
  tag: 'gux-simple-toast'
})
export class GuxSimpleToast {
  /**
   * The component accent.
   */
  @Prop()
  accent: GuxSimpleToastAccent = 'neutral';

  @Event()
  guxdismiss: EventEmitter<void>;

  private getI18nValue: GetI18nValue;

  @Element()
  private root: HTMLElement;

  async componentWillLoad(): Promise<void> {
    trackComponent(this.root, { variant: this.accent });
    this.getI18nValue = await buildI18nForComponent(
      this.root,
      modalComponentResources
    );
  }

  render(): JSX.Element {
    return (
      <Host>
        <div class={`gux-icon gux-${this.accent}`}>
          <slot name="icon" />
        </div>

        <div class="gux-message">
          <slot name="message" />
        </div>

        <button
          class="gux-dismiss-button"
          title={this.getI18nValue('dismiss')}
          onClick={this.onDismissClickHandler.bind(this)}
        >
          <gux-icon
            screenreader-text={this.getI18nValue('dismiss')}
            icon-name="ic-close"
          ></gux-icon>
        </button>
      </Host>
    );
  }

  private onDismissClickHandler(event: MouseEvent): void {
    event.stopPropagation();

    const dismissEvent = this.guxdismiss.emit();
    if (!dismissEvent.defaultPrevented) {
      this.root.remove();
    }
  }
}
