import { Component, Element, h, JSX, Listen, State } from '@stencil/core';

import { onDisabledChange } from '../../../../../utils/dom/on-attribute-change';

/**
 * @slot input - Required slot for input[type="color"]
 */
@Component({
  styleUrl: 'gux-input-color.less',
  tag: 'gux-input-color'
})
export class GuxInputColor {
  private input: HTMLInputElement;
  private disabledObserver: MutationObserver;

  @Element()
  private root: HTMLElement;

  @State()
  private disabled: boolean;

  @State()
  private color: string;

  @State()
  private opened: boolean;

  @State()
  private colorOnOpen: string;

  @Listen('click', { target: 'window' })
  onClick(e: MouseEvent): void {
    const element = e.target as HTMLElement;

    if (!this.root.contains(element as Node)) {
      this.setOpened(false);
    }
  }

  @Listen('input')
  onInput(e: MouseEvent): void {
    const input = e.target as HTMLInputElement;
    this.color = input.value;
  }

  componentWillLoad(): void {
    this.input = this.root.querySelector('input[slot="input"]');
    this.input.addEventListener('change', (e: MouseEvent) => {
      if (this.opened) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
      }
    });
    this.disabledObserver = onDisabledChange(
      this.input,
      (disabled: boolean) => {
        this.disabled = disabled;
      }
    );

    this.disabled = this.input.disabled;
    this.color = this.input.value;
  }

  componentDidUnload(): void {
    this.disabledObserver.disconnect();
  }

  render(): JSX.Element {
    return (
      <section>
        <button
          type="button"
          class={{
            'gux-input-color-main-element': true,
            'gux-opened': this.opened
          }}
          disabled={this.disabled}
          onClick={this.clickHandler.bind(this)}
        >
          <div
            class="gux-input-color-selected-color"
            style={{ background: this.color }}
          />
          <div class="gux-input-color-color-name">{this.color}</div>
          <gux-icon decorative iconName="ic-dropdown-arrow"></gux-icon>
        </button>
        <gux-color-select
          class={{
            'gux-input-color-color-select': true,
            'gux-opened': this.opened
          }}
        >
          <slot name="input" slot="input" />
        </gux-color-select>
      </section>
    );
  }

  private setOpened(opened: boolean): void {
    if (this.colorOnOpen && this.colorOnOpen !== this.color) {
      this.colorOnOpen = this.color;
      this.input.dispatchEvent(
        new Event('change', {
          bubbles: true
        })
      );
    }

    this.colorOnOpen = this.color;
    this.opened = opened;
  }

  private clickHandler(): void {
    if (!this.disabled) {
      this.setOpened(!this.opened);
    }
  }
}
