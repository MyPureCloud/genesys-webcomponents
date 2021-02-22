import {
  Component,
  Event,
  EventEmitter,
  h,
  JSX,
  Prop,
  State,
  Watch
} from '@stencil/core';
import { setInterval, clearInterval } from 'requestanimationframe-timer';

@Component({
  styleUrl: 'gux-slider.less',
  tag: 'gux-slider-legacy'
})
export class GuxSliderLegacy {
  /**
   * Indicates the minimum value for the slider
   */
  @Prop({ mutable: true })
  min: number = 0;
  /**
   * Indicates the maximum value for the slider
   */
  @Prop()
  max: number = 100;
  /**
   * Inicates the step value of the slider
   */
  @Prop()
  step: number = 1;
  /**
   * Indicates the value of the slider
   */
  @Prop({ mutable: true, reflectToAttr: true })
  value: number = 0;
  /**
   * Indicates if the input box will be displayed
   */
  @Prop()
  displayTextBox: boolean = true;
  /**
   * Indicate if the value is a percentage
   */
  @Prop()
  isPercentage: boolean = false;

  /**
   * Whether or not the slider is disabled.
   */
  @Prop()
  disabled: boolean = false;

  /**
   * Set an invisible label for accessibility uses
   */
  @Prop()
  srLabel: string = '';

  @State()
  private valueWatcherId: number;

  @Watch('value')
  valueChanged(newValue: number, oldValue: number) {
    if (newValue === oldValue) {
      return;
    }

    this.update.emit(this.value);
    this.updatePosition();
  }
  sliderInput: HTMLInputElement;
  sliderMask: HTMLElement;
  sliderTooltip: HTMLElement;
  sliderTooltipContainer: HTMLElement;

  inputRegex = new RegExp('^(-?[0-9]+[.]?[0-9]*)%?$');

  /**
   * Triggered when the value is changed
   * @return the current value
   */
  @Event()
  update: EventEmitter<number>;

  updateValue(event: InputEvent): void {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);

    this.setValue(value);
  }

  setValue(value: number): void {
    const resultValue = value || this.min;
    this.value = Math.min(Math.max(resultValue, this.min), this.max);
  }

  /**
   * Once the component is loaded do the setup
   */
  componentDidLoad(): void {
    this.updatePosition();

    this.valueWatcherId = setInterval(() => {
      const inputValue = Number(this.sliderInput.value);
      if (this.value !== inputValue) {
        this.setValue(inputValue);
      }
    }, 100);
  }

  componentDidUnload(): void {
    clearInterval(this.valueWatcherId);
  }
  /**
   * When position is changed, via slider or text box, update position
   */
  updatePosition(): void {
    const placementPercentage =
      ((this.value - this.min) / (this.max - this.min)) * 100;
    if (this.sliderTooltip) {
      const width = this.sliderTooltipContainer.offsetWidth;
      const offset =
        placementPercentage - (placementPercentage / 8 / width) * 100;
      this.sliderTooltip.style.left = `${offset}%`;
    }
    this.sliderMask.style.width = `${placementPercentage}%`;
  }

  render(): JSX.Element {
    const value: string = this.isPercentage
      ? `${this.value}%`
      : `${this.value}`;
    return (
      <div class="gux-slider-component-container">
        <div class="gux-slider-container">
          <input
            type="range"
            role="slider"
            class="gux-range-input"
            min={this.min}
            max={this.max}
            step={this.step}
            value={this.value}
            aria-label={this.srLabel}
            ref={el => (this.sliderInput = el)}
            // onChange event required because IE11 doesn't support onInput for range inputs
            onChange={(e: InputEvent) => this.updateValue(e)}
            onInput={(e: InputEvent) => this.updateValue(e)}
            disabled={this.disabled}
          />
          <div class={`gux-mask${this.disabled ? ' gux-disabled' : ''}`}>
            <div class="gux-mask-slider" ref={el => (this.sliderMask = el)} />
            <div class="gux-mask-track-container">
              <div class="gux-mask-track" />
            </div>
          </div>
          <div
            class={
              'gux-range-tooltip-container' +
              (this.displayTextBox ? ' gux-hidden' : '')
            }
            ref={el => (this.sliderTooltipContainer = el)}
          >
            <div
              class="gux-range-tooltip"
              ref={el => (this.sliderTooltip = el)}
            >
              {value}
            </div>
          </div>
        </div>
        {this.displayTextBox && (
          <div class="gux-slider-display" aria-label={this.srLabel}>
            {value}
          </div>
        )}
      </div>
    );
  }
}
