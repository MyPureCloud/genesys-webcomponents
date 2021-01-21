import { Component, Element, h, JSX, Listen, State } from '@stencil/core';
import { defaultColors } from './colors';

/**
 * @slot input - Required slot for input[type="color"]
 */
@Component({
  styleUrl: 'gux-color-select.less',
  tag: 'gux-color-select'
})
export class GuxColorSelect {
  private input: HTMLInputElement;

  @Element()
  private root: HTMLElement;

  @State()
  private color: string;

  @Listen('colorSelect')
  onColorSelect(event: MouseEvent): void {
    const colorOptionElement = event.target as HTMLGuxInputColorOptionElement;
    this.color = colorOptionElement.value;
    this.input.value = colorOptionElement.value;

    this.input.dispatchEvent(
      new Event('input', {
        bubbles: true,
        cancelable: true
      })
    );
    this.input.dispatchEvent(
      new Event('change', {
        bubbles: true
      })
    );
  }

  componentWillLoad(): void {
    this.input = this.root.querySelector('input[slot="input"]');
    this.color = this.input.value;
  }

  render(): JSX.Element {
    return [
      <div hidden>
        <slot name="input" />
      </div>,
      <div>
        <div class="gux-input-color-matrix">{this.renderDefaultTiles()}</div>
      </div>
    ];
  }

  private renderDefaultTiles(): HTMLGuxInputColorOptionElement[] {
    return defaultColors.map((color, index) => (
      <gux-input-color-option
        key={`${color}-${index}`}
        value={color}
        active={this.color.toLowerCase() === color.toLowerCase()}
      />
    ));
  }
}
