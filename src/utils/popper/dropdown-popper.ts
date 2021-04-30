import { createPopper, Instance } from '@popperjs/core';

export function createDropdownPopper(
  reference: Element,
  popper: HTMLElement
): Instance {
  return createPopper(reference, popper, {
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
  });
}

export { Instance as DropdownPopperInstance };
