import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Prop
} from '@stencil/core';

import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import { trackComponent } from '../../../usage-tracking';

import modalComponentResources from './i18n/en.json';
import { GuxModalSize } from './gux-modal.types';

/**
 * @slot content - Required slot for the modal content
 * @slot left-align-buttons - Optional slot to set gux-buttons aligned to the left of the modal
 * @slot right-align-buttons - Optional slot to set gux-buttons aligned to the left of the modal
 * @slot title - Optional slot to set the modal title
 */
@Component({
  styleUrl: 'gux-modal.less',
  tag: 'gux-modal'
})
export class GuxModal {
  /**
   * Indicates the size of the modal (small, medium or large)
   */
  @Prop()
  size: GuxModalSize = 'dynamic';

  /**
   * Fired when a user dismisses the modal (The default behaviour is to remove the component from the DOM)
   */
  @Event()
  guxdismiss: EventEmitter<void>;
  private getI18nValue: GetI18nValue;

  @Element()
  private root: HTMLElement;

  async componentWillLoad(): Promise<void> {
    trackComponent(this.root, { variant: this.size });
    this.getI18nValue = await buildI18nForComponent(
      this.root,
      modalComponentResources
    );
  }

  render(): JSX.Element {
    const hasModalTitleSlot = this.hasModalTitleSlot();
    const hasFooterButtons = this.hasFooterButtons();

    return (
      <div class="gux-modal">
        <div class={`gux-modal-container gux-${this.size}`}>
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

          {hasModalTitleSlot && (
            <h1 class="gux-modal-header">
              <slot name="title" />
            </h1>
          )}

          <div
            class={{
              'gux-modal-content': true,
              'gux-no-buttons': !hasFooterButtons
            }}
          >
            <p>
              <slot name="content" />
            </p>
          </div>

          {hasFooterButtons && (
            <div class="gux-button-footer">
              <div class="gux-left-align-buttons">
                <slot name="left-align-buttons" />
              </div>

              <div class="gux-right-align-buttons">
                <slot name="right-align-buttons" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  private hasModalTitleSlot(): boolean {
    return Boolean(this.root.querySelector('[slot="title"]'));
  }

  private hasFooterButtons(): boolean {
    return (
      Boolean(this.root.querySelector('[slot="left-align-buttons"]')) ||
      Boolean(this.root.querySelector('[slot="right-align-buttons"]'))
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
