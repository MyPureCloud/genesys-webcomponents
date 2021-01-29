import { createPopper, Instance } from '@popperjs/core';
import {
  Component,
  Element,
  h,
  Host,
  Listen,
  JSX,
  Prop,
  State
} from '@stencil/core';

import { randomHTMLId } from '../../../utils/dom/random-html-id';

/**
 * @slot - Content of the tooltip
 */
@Component({
  styleUrl: 'gux-tooltip.less',
  tag: 'gux-tooltip'
})
export class GuxTooltip {
  private delayTimeout: NodeJS.Timer;
  private forElement: HTMLElement;
  private mouseenterHandler = () => this.show();
  private mouseleaveHandler = () => this.hide();
  private focusinHandler = () => this.show();
  private focusoutHandler = () => this.hide();
  private popperInstance: Instance;
  private id = randomHTMLId('gux-tooltip');

  @Element()
  private root: HTMLElement;

  /**
   * Indicates the id of the element the popover should anchor to. (If not supplied the parent element is used)
   */
  @Prop()
  for: string;

  /**
   * If tooltip is shown or not
   */
  @State()
  isShown = false;

  @Listen('keydown', { target: 'window', passive: true })
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isShown) {
      this.hide();
    }
  }

  private show(): void {
    this.delayTimeout = setTimeout(() => {
      this.isShown = true;
    }, 750); // the css transition is 250ms
  }

  private hide(): void {
    clearTimeout(this.delayTimeout);
    this.isShown = false;
  }

  componentWillLoad(): void {
    if (this.for) {
      this.forElement = document.getElementById(this.for);
    } else {
      this.forElement = this.root.parentElement;
    }
  }

  componentDidLoad(): void {
    if (this.forElement) {
      this.forElement.classList.add('gux-tooltip-for-element');
      this.forElement.setAttribute('aria-describedby', this.id);

      this.popperInstance = createPopper(this.forElement, this.root, {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 16]
            }
          }
        ],
        placement: 'bottom-start',
        strategy: 'fixed'
      });

      this.forElement.addEventListener('mouseenter', this.mouseenterHandler);
      this.forElement.addEventListener('mouseleave', this.mouseleaveHandler);
      this.forElement.addEventListener('focusin', this.focusinHandler);
      this.forElement.addEventListener('focusout', this.focusoutHandler);
    } else {
      console.error(
        `gux-tooltip: invalid element supplied to 'for': "${this.for}"`
      );
    }
  }

  componentDidUnload(): void {
    this.forElement.classList.remove('gux-tooltip-for-element');
    this.forElement.removeAttribute('aria-describedby');

    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }

    this.forElement.removeEventListener('mouseenter', this.mouseenterHandler);
    this.forElement.removeEventListener('mouseleave', this.mouseleaveHandler);
    this.forElement.removeEventListener('focusin', this.focusinHandler);
    this.forElement.removeEventListener('focusout', this.focusoutHandler);
  }

  render(): JSX.Element {
    return (
      <Host
        id={this.id}
        class={{ 'gux-show': this.isShown }}
        tabindex="0"
        role="tooltip"
      >
        <slot />
      </Host>
    );
  }
}
