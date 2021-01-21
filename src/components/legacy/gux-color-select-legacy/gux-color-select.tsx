import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Listen,
  Prop,
  State,
  Watch
} from '@stencil/core';
import { defaultColors } from './colors';

@Component({
  styleUrl: 'gux-color-select.less',
  tag: 'gux-color-select-legacy'
})
export class GuxColorSelectBeta {
  @Element()
  root: HTMLElement;

  /**
   * Determines the state activeColor
   */
  @Prop()
  value: string;

  /**
   * Indicate the color that is active
   */
  @State()
  activeColor: string;

  /**
   * Triggers when a color is selected
   */
  @Event()
  input: EventEmitter;

  componentWillLoad() {
    this.activeColor = this.value;
  }

  onSelectColorHandler(e: MouseEvent & { target: HTMLInputElement }) {
    this.activeColor = e.target.value;
    this.input.emit(e.target.value);
  }

  @Watch('value')
  valueChangeHandler(newValue: string) {
    this.activeColor = newValue;
  }

  @Listen('tileClick')
  onClickHandler(ev: CustomEvent) {
    this.onSelectColorHandler(ev.detail);
  }

  renderDefaultTiles() {
    return defaultColors.map((color, index) => (
      <gux-color-option-legacy
        key={`${color}-${index}`}
        value={color}
        active={this.activeColor === color}
      />
    ));
  }

  renderBlankTiles() {
    const rowWidth = 5;
    const blankTiles = [];
    const hangingTiles =
      (defaultColors.length + this.root.children.length) % rowWidth;
    const blankTilesLength = hangingTiles === 0 ? 0 : rowWidth - hangingTiles;
    for (let i = 0; i < blankTilesLength; i += 1) {
      blankTiles.push(
        <gux-color-option-legacy key={`blank-tile-${i}`} aria-hidden="true" />
      );
    }
    return blankTiles;
  }

  render() {
    return (
      <div>
        <div class="gux-color-matrix">
          {this.renderDefaultTiles()}
          <slot />
          {this.renderBlankTiles()}
        </div>
      </div>
    );
  }
}
