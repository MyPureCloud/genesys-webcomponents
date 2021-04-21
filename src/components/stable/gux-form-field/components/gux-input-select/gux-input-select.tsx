import {
  Component,
  Element,
  forceUpdate,
  h,
  Listen,
  JSX,
  State,
  Watch
} from '@stencil/core';
import { ClickOutside } from 'stencil-click-outside';
import { createPopper, Instance } from '@popperjs/core';

import simulateNativeEvent from '../../../../../utils/dom/simulate-native-event';
import {
  onDisabledChange,
  onMutation
} from '../../../../../utils/dom/on-attribute-change';
import { randomHTMLId } from '../../../../../utils/dom/random-html-id';

/**
 * @slot input - Required slot for select element
 */
@Component({
  styleUrl: 'gux-input-select.less',
  tag: 'gux-input-select'
})
export class GuxInputSelect {
  private input: HTMLSelectElement;
  private disabledObserver: MutationObserver;
  private mutationObserver: MutationObserver;
  private id: string = randomHTMLId('gux-input-select');
  private popperInstance: Instance;
  private fieldButtonElement: HTMLElement;
  private listboxElement: HTMLElement;

  @Element()
  private root: HTMLElement;

  @State()
  private listboxExpanded: boolean = false;

  @State()
  private disabled: boolean;

  @State()
  private value: string;

  @State()
  private valueWatcherId: NodeJS.Timeout;

  @Watch('listboxExpanded')
  watchListboxExpanded(listboxExpanded: boolean) {
    if (listboxExpanded) {
      const selectedIndex = this.input.selectedIndex;
      const target = this.listboxElement.children[selectedIndex] as HTMLUListElement;

      Array.from(this.listboxElement.children).forEach((child) => child.classList.remove('gux-active'));

      target.classList.add('gux-active');

      target && setTimeout(() => {
        target.scrollIntoView(false);
        this.listboxElement.focus();
      }, 0)

    } else {
      this.listboxElement.scroll(0, 0);
    }
  }

  @Listen('input')
  onInput(event: InputEvent): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;

    forceUpdate(this.root);
  }

  @Listen('keydown')
  onKeydown(event: KeyboardEvent): void {
    event.stopPropagation();

    if (this.listboxExpanded) {
      switch (event.key) {
        case 'Escape':
          this.listboxExpanded = false;
          this.fieldButtonElement.focus();
          return;

        case 'Enter':
          event.preventDefault();
          console.log('Enter');
          this.listboxExpanded = false;
          this.fieldButtonElement.focus();
          return;

        case 'ArrowDown': {
          event.preventDefault();
          console.log('ArrowDown');
          const activedescendant = this.listboxElement.querySelector('.gux-active');
          const nextActivedescendant = activedescendant.nextElementSibling;

          if (nextActivedescendant) {
            activedescendant.classList.remove('gux-active')
            nextActivedescendant.classList.add('gux-active')
          }
          console.log({ activedescendant, nextActivedescendant });
          return;
        }


        case 'ArrowUp': {
          event.preventDefault();
          console.log('ArrowUp');
          const activedescendant = this.listboxElement.querySelector('.gux-active');
          const nextActivedescendant = activedescendant.previousElementSibling;

          if (nextActivedescendant) {
            activedescendant.classList.remove('gux-active')
            nextActivedescendant.classList.add('gux-active')
          }
          console.log({ activedescendant, nextActivedescendant });
          return;
        }

        case 'Home':
          event.preventDefault();
          console.log('Home');
          return;

        case 'End':
          event.preventDefault();
          console.log('End');
          return;
      }
    }

    switch (event.key) {
      case 'Tab':
        this.listboxExpanded = false;
        return;
    }
  }

  @ClickOutside({ triggerEvents: 'mousedown' })
  checkForClickOutside() {
    if (this.listboxExpanded) {
      this.listboxExpanded = false;
    }
  }

  async connectedCallback(): Promise<void> {
    this.input = this.root.querySelector('select[slot="input"]');

    this.disabled = this.input.disabled;
    this.value = this.input.value;

    this.disabledObserver = onDisabledChange(
      this.input,
      (disabled: boolean) => {
        this.disabled = disabled;
      }
    );

    this.mutationObserver = onMutation(this.input, () => {
      forceUpdate(this.root);
    });

    this.valueWatcherId = setInterval(() => {
      if (this.value !== this.input.value) {
        this.value = this.input.value;
      }
    }, 100);
  }

  componentDidLoad(): void {
    this.runPopper();
  }

  disconnectedCallback(): void {
    this.disabledObserver.disconnect();
    this.mutationObserver.disconnect();
    clearInterval(this.valueWatcherId);
    this.destroyPopper();
  }

  private runPopper(): void {
    this.popperInstance = createPopper(
      this.fieldButtonElement,
      this.listboxElement,
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

  private destroyPopper(): void {
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  private getFieldButton(input: HTMLSelectElement): JSX.Element {
    return (
      <button
        type="button"
        class="gux-field-button"
        disabled={this.disabled}
        onClick={this.fieldButtonClick.bind(this)}
        aria-haspopup="listbox"
        aria-expanded={this.listboxExpanded}
        ref={el => (this.fieldButtonElement = el)}
      >
        <div class="gux-selected-option">
          {input.selectedIndex === -1
            ? 'Select...'
            : input.options[input.selectedIndex].textContent}
        </div>
        <gux-icon
          class="gux-expand-icon"
          decorative
          iconName="chevron-small-down"
        ></gux-icon>
      </button>
    );
  }

  private getListbox(input: HTMLSelectElement): JSX.Element {
    const optionElements = input.querySelectorAll('option');

    const listElements = Array.from(optionElements).map(
      (optionElement, index): JSX.Element => {
        return (
          <li
            class="gux-listbox-option"
            role="option"
            aria-selected={optionElement.selected}
            aria-disabled={this.disabled || optionElement.disabled}
            onClick={() => this.optionClick(index)}
          >
            {optionElement.textContent}
          </li>
        );
      }
    );

    const size = this.input.size;
    const maxHeight = size > 1 ? `${size * 32 + 24}px` : 'initial';

    return (
      <ul
        class="gux-listbox"
        role="listbox"
        tabIndex={-1}
        ref={el => (this.listboxElement = el)}
        style={{ maxHeight }}
        aria-activedescendant={ `-active` }
      >
        {listElements}
      </ul>
    );
  }

  private setSelect(index: number): void {
    this.input.selectedIndex = index;
    simulateNativeEvent(this.input, 'input');
    simulateNativeEvent(this.input, 'change');
  }

  private fieldButtonClick(): void {
    this.listboxExpanded = !this.listboxExpanded;
  }

  private optionClick(index: number): void {
    this.setSelect(index);
    this.listboxExpanded = false;
  }

  render(): JSX.Element {
    return (
      <div
        id={this.id}
        class={{
          'gux-disabled': this.disabled,
          'gux-listbox-expanded': this.listboxExpanded
        }}
      >
        <div class="gux-slot">
          <slot name="input" />
        </div>
        {this.getFieldButton(this.input)}
        {this.getListbox(this.input)}
      </div>
    );
  }
}
