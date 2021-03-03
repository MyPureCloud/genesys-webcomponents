import { createPopper, Instance } from '@popperjs/core';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Listen,
  Prop,
  State,
  Watch
} from '@stencil/core';
import { ClickOutside } from 'stencil-click-outside';

import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import { onHiddenChange } from '../../../utils/dom/on-attribute-change';
import { trackComponent } from '../../../usage-tracking';

import modalComponentResources from './i18n/en.json';
import { PopperPosition } from './gux-popover.types';

@Component({
  styleUrl: 'gux-popover.less',
  tag: 'gux-popover'
})
export class GuxPopover {
  private i18n: GetI18nValue;
  private popperInstance: Instance;
  private forElement: HTMLElement;
  private hiddenObserver: MutationObserver;

  @Element()
  private root: HTMLElement;

  /**
   * Indicates the id of the element the popover should anchor to
   */
  @Prop()
  for: string;

  /**
   * Indicate position of popover element arrow (follow popper js position attribute api)
   */
  @Prop()
  position: PopperPosition = 'bottom';

  /**
   * Indicate if the dismiss button is displayed
   */
  @Prop()
  displayDismissButton: boolean;

  /**
   * Close popover when the user clicks outside of its bounds
   */
  @Prop()
  closeOnClickOutside: boolean = false;

  /**
   * Fired when a user dismisses the popover
   */
  @Event()
  guxdismiss: EventEmitter<void>;

  @Watch('hidden')
  watchHidden() {
    if (this.popperInstance) {
      this.popperInstance.forceUpdate();
    }
  }

  @State()
  hidden: boolean = true;

  @Listen('click', { target: 'window' })
  onClickAway(e: FocusEvent) {
    if (!this.displayDismissButton && !this.hidden) {
      if (!e.relatedTarget || !this.root.contains(e.relatedTarget as Node)) {
        this.dismiss();
      }
    }
  }

  @Watch('hidden')
  hiddenHandler(hidden: boolean) {
    if (!hidden && !this.popperInstance) {
      this.runPopper();
    }
  }

  @ClickOutside()
  checkForClickOutside() {
    if (this.closeOnClickOutside && !this.hidden) {
      this.dismiss();
    }
  }

  private runPopper(): void {
    if (this.forElement) {
      this.popperInstance = createPopper(this.forElement, this.root, {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 7]
            }
          },
          {
            name: 'arrow',
            options: {
              padding: 16
            }
          }
        ],
        placement: this.position
      });
    } else {
      console.error(
        `GUX-Popover: invalid element supplied to 'for': "${this.for}"`
      );
    }
  }

  private destroyPopper(): void {
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  private dismiss(): void {
    const dismissEvent = this.guxdismiss.emit();
    if (!dismissEvent.defaultPrevented) {
      this.root.setAttribute('hidden', '');
    }
  }

  async componentWillLoad(): Promise<void> {
    trackComponent(this.root, { variant: this.position });

    this.forElement = document.getElementById(this.for);

    this.i18n = await buildI18nForComponent(this.root, modalComponentResources);

    this.hiddenObserver = onHiddenChange(this.root, (hidden: boolean) => {
      this.hidden = hidden;
    });

    this.hidden = this.root.hidden;
  }

  componentDidLoad(): void {
    this.runPopper();
  }

  componentDidUnload(): void {
    this.destroyPopper();
    this.hiddenObserver.disconnect();
  }

  render(): JSX.Element {
    return (
      <div class="gux-popover-wrapper">
        <div class="gux-arrow" data-popper-arrow />
        {this.displayDismissButton && (
          <div class="gux-title-bar">
            <gux-icon
              class="gux-dismiss"
              icon-name="close"
              screenreader-text={this.i18n('dismiss')}
              onClick={this.dismiss.bind(this)}
            />
          </div>
        )}
        <div class="gux-popover-content">
          <slot />
        </div>
      </div>
    );
  }
}
