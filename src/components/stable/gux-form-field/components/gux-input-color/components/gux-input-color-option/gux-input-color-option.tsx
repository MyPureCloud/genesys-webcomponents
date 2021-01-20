import { Component, Event, EventEmitter, h, JSX, Prop } from '@stencil/core';

@Component({
  styleUrl: 'gux-input-color-option.less',
  tag: 'gux-input-color-option'
})
export class GuxInputColorOption {
  /**
   * Indicate if the tile is active
   */
  @Prop()
  active: boolean;

  /**
   * Indicate the color of the tile, if undefined, tile will be blank and be disabled
   */
  @Prop()
  value: string;

  /**
   * Triggers when a color is selected
   */
  @Event()
  private colorSelect: EventEmitter;

  render(): JSX.Element {
    return (
      <button
        type="button"
        value={this.value}
        class={this.active ? 'gux-input-color-option-active' : ''}
        disabled={!this.value}
        style={this.value && { 'background-color': this.value }}
        title={this.value}
        onClick={this.onColorOptionClickHandler.bind(this)}
      />
    );
  }

  private onColorOptionClickHandler(): void {
    this.colorSelect.emit(this.value);
  }
}
