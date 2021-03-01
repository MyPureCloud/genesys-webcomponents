import { Component, Element, h, Host, Listen, JSX, Prop } from '@stencil/core';

import simulateNativeEvent from '../../../utils/dom/simulate-native-event';
import clamp from '../../../utils/number/clamp';
import { trackComponent } from '../../../usage-tracking';

@Component({
  styleUrl: 'gux-rating.less',
  tag: 'gux-rating'
})
export class GuxRating {
  private ratingElement: HTMLDivElement;

  @Element()
  root: HTMLElement;

  @Prop({ mutable: true })
  value: number = 0;

  @Prop()
  maxValue: number = 5;

  @Prop()
  disabled: boolean = false;

  @Prop()
  readonly: boolean = false;

  @Listen('click')
  onClick(event: MouseEvent): void {
    event.stopPropagation();

    if (this.disabled || this.readonly) {
      return;
    }

    const ratingStar = (event.target as HTMLElement).closest('gux-icon');
    const clickedStarIndex = Array.from(this.ratingElement.children).findIndex(
      child => child === ratingStar
    );
    const clickedStarNominalValue = clickedStarIndex + 1;

    if (clickedStarNominalValue === this.value + 0.5) {
      this.updateRatingValue(clickedStarNominalValue);
    } else if (clickedStarNominalValue === this.value) {
      this.updateRatingValue(0);
    } else if (clickedStarNominalValue !== Math.floor(this.value)) {
      this.updateRatingValue(clickedStarNominalValue - 0.5);
    }
  }

  @Listen('keydown')
  onKeyDown(event: KeyboardEvent): void {
    event.stopPropagation();

    if (this.disabled || this.readonly) {
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        this.updateRatingValue(this.value - 0.5);
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        this.updateRatingValue(this.value + 0.5);
        break;
      case 'End':
        event.preventDefault();
        this.updateRatingValue(Infinity);
        break;
      case 'Home':
        event.preventDefault();
        this.updateRatingValue(-Infinity);
        break;
    }
  }

  private updateRatingValue(newValue: number): void {
    const validatedNewValue = clamp(
      newValue,
      0,
      Array.from(this.ratingElement.children).length
    );

    if (this.value !== validatedNewValue) {
      this.value = validatedNewValue;

      simulateNativeEvent(this.root, 'input');
      simulateNativeEvent(this.root, 'change');
    }
  }

  private getRatingStarElements(): JSX.Element {
    return [...Array(this.maxValue).keys()].reduce((acc, cv) => {
      if (cv + 0.5 === this.value) {
        return acc.concat(
          <gux-icon
            class="gux-rating-star-half"
            icon-name="ic-star-half"
            decorative
          ></gux-icon>
        );
      } else if (cv + 1 <= this.value) {
        return acc.concat(
          <gux-icon
            class="gux-rating-star-full"
            icon-name="ic-stars"
            decorative
          ></gux-icon>
        );
      }

      return acc.concat(
        <gux-icon
          class="gux-rating-star-empty"
          icon-name="ic-star-outline"
          decorative
        ></gux-icon>
      );
    }, []);
  }

  private getTabIndex(): number {
    return this.disabled ? -1 : 0;
  }

  componentWillLoad(): void {
    trackComponent(this.root);
  }

  render(): JSX.Element {
    return (
      <Host
        role="spinbutton"
        tabindex={this.getTabIndex()}
        aria-readonly={this.readonly}
        aria-valuenow={this.value}
        aria-valuemin="0"
        aria-valuemax={this.maxValue}
      >
        <div
          ref={(el: HTMLDivElement) => (this.ratingElement = el)}
          class={{
            'gux-rating-start-container': true,
            'gux-disabled': this.disabled
          }}
        >
          {this.getRatingStarElements()}
        </div>
      </Host>
    );
  }
}
