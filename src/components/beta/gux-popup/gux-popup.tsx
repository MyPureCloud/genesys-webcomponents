import { Component, h, Prop } from '@stencil/core';

import { createPopper, Instance } from '@popperjs/core';

/**
 * @slot error - Required slot for error
 */
@Component({
  styleUrl: 'gux-popup.less',
  tag: 'gux-popup-beta'
})
export class GuxPopup {
  private popperInstance: Instance;
  private targetElementContainer: HTMLElement;
  private popupElementContainer: HTMLElement;

  @Prop()
  open: boolean = false;

  componentDidLoad(): void {
    this.popperInstance = createPopper(
      this.targetElementContainer,
      this.popupElementContainer,
      {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 1]
            }
          },
          {
            name: 'sameWidth',
            enabled: true,
            phase: 'beforeWrite',
            requires: ['computeStyles'],
            fn({ state }) {
              state.styles.popper.width = `${state.rects.reference.width}px`;
            },
            effect({ state }) {
              state.elements.popper.style.width = `${
                state.elements.reference.getBoundingClientRect().width
              }px`;
            }
          }
        ],
        placement: 'bottom-start'
      }
    );
  }

  disconnectedCallback(): void {
    this.popperInstance.destroy();
  }

  render() {
    return [
      <div
        class="gux-target-container"
        ref={el => (this.targetElementContainer = el)}
      >
        <slot name="target"></slot>
      </div>,
      <div
        class={{
          'gux-popup-container': true,
          'gux-open': this.open
        }}
        ref={el => (this.popupElementContainer = el)}
      >
        <slot name="popup"></slot>
      </div>
    ];
  }
}
