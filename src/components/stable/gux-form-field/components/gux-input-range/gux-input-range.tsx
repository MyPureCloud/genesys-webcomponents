import { Component, Element, h, JSX, Listen, Prop, State } from '@stencil/core';
import { setInterval, clearInterval } from 'requestanimationframe-timer';

import { onDisabledChange } from '../../../../../utils/dom/on-attribute-change';

/**
 * @slot input - Required slot for input[type="range"]
 */
@Component({
  styleUrl: 'gux-input-range.less',
  tag: 'gux-input-range'
})
export class GuxInputRange {
  private input: HTMLInputElement;
  private progressElement: HTMLDivElement;
  private disabledObserver: MutationObserver;

  @Element()
  private root: HTMLElement;

  @Prop()
  displayUnits: string;

  @State()
  private disabled: boolean;

  @State()
  private value: string;

  @State()
  private active: boolean;

  @State()
  private valueWatcherId: number;

  @Listen('input')
  onInput(e: MouseEvent): void {
    const input = e.target as HTMLInputElement;
    this.updateValue(input.value);
  }

  @Listen('focusin')
  @Listen('mousedown')
  onMousedown(): void {
    if (!this.disabled) {
      this.active = true;
    }
  }

  @Listen('focusout')
  @Listen('mouseup')
  onMouseup(): void {
    this.active = false;
  }

  private updateValue(newValue: string): void {
    this.value = newValue;
    this.updatePosition();
  }

  private updatePosition(): void {
    const value = Number(this.input.value || 0);
    const min = Number(this.input.min || 0);
    const max = Number(this.input.max || 100);
    const placementPercentage = ((value - min) / (max - min)) * 100;

    this.progressElement.style.width = `${placementPercentage}%`;
  }

  private getDisplayValue(): string {
    if (this.displayUnits) {
      return `${this.value}${this.displayUnits}`;
    }

    return this.value;
  }

  connectedCallback(): void {
    this.input = this.root.querySelector('input[slot="input"]');
    this.disabled = this.input.disabled;
    this.value = this.input.value;

    this.disabledObserver = onDisabledChange(
      this.input,
      (disabled: boolean) => {
        this.disabled = disabled;
      }
    );

    this.valueWatcherId = setInterval(() => {
      if (this.value !== this.input.value) {
        this.updateValue(this.input.value);
      }
    }, 100);
  }

  componentDidLoad(): void {
    this.updatePosition();
  }

  disconnectedCallback(): void {
    this.disabledObserver.disconnect();
    clearInterval(this.valueWatcherId);
  }

  render(): JSX.Element {
    return (
      <div
        class={{
          'gux-container': true,
          'gux-disabled': this.disabled
        }}
      >
        <div
          class={{
            'gux-range': true,
            'gux-active': this.active
          }}
        >
          <div class="gux-track">
            <div
              class="gux-progress"
              ref={el => (this.progressElement = el)}
            ></div>
          </div>
          <slot name="input" />
        </div>
        <div
          class={{
            'gux-display': true,
            'gux-active': this.active
          }}
        >
          {this.getDisplayValue()}
        </div>
      </div>
    );
  }
}
