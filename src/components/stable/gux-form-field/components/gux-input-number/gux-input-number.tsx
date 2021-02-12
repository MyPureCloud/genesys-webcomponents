import { Component, Element, h, JSX, Prop, State } from '@stencil/core';

import { buildI18nForComponent, GetI18nValue } from '../../../../../i18n';
import setInputValue from '../../../../../utils/dom/set-input-value';
import simulateNativeEvent from '../../../../../utils/dom/simulate-native-event';

import modalComponentResources from './i18n/en.json';

/**
 * @slot input - Required slot for input[type="radio"]
 * @slot label - Required slot for label
 */
@Component({
  styleUrl: 'gux-input-number.less',
  tag: 'gux-input-number'
})
export class GuxInputNumber {
  private input: HTMLInputElement;
  private getI18nValue: GetI18nValue;

  @Element()
  private root: HTMLElement;

  @Prop()
  clearable: boolean;

  @State()
  private hasContent: boolean = false;

  private clearInput(): void {
    setInputValue(this.input, '', true);
  }

  private setHasContent(): void {
    this.hasContent = Boolean(this.input.value);
  }

  private simulateNativeInputAndChangeEvents(): void {
    simulateNativeEvent(this.input, 'input');
    simulateNativeEvent(this.input, 'change');
  }

  private stepUp(): void {
    if (this.input.value === '') {
      setInputValue(this.input, this.input.min || '0', false);
    } else {
      this.input.stepUp();
      this.simulateNativeInputAndChangeEvents();
    }
  }

  private stepDown(): void {
    if (this.input.value === '') {
      setInputValue(this.input, this.input.min || '0', false);
    } else {
      this.input.stepDown();
      this.simulateNativeInputAndChangeEvents();
    }
  }

  private renderClearButton(): JSX.Element {
    if (this.clearable && this.hasContent) {
      return (
        <button
          class="gux-clear-button"
          type="button"
          title={this.getI18nValue('clear')}
          onClick={this.clearInput.bind(this)}
        >
          <gux-icon iconName="ic-close" decorative></gux-icon>
        </button>
      );
    }

    return null;
  }

  private renderStepButtons(): JSX.Element {
    return (
      <div class="gux-step-buttons-container">
        <button
          class="gux-step-button"
          type="button"
          title={this.getI18nValue('increment')}
          onClick={() => this.stepUp()}
        >
          <gux-icon iconName="angle-up" decorative></gux-icon>
        </button>

        <button
          class="gux-step-button"
          type="button"
          title={this.getI18nValue('decrement')}
          onClick={() => this.stepDown()}
        >
          <gux-icon iconName="angle-down" decorative></gux-icon>
        </button>
      </div>
    );
  }

  async componentWillLoad(): Promise<void> {
    this.getI18nValue = await buildI18nForComponent(
      this.root,
      modalComponentResources
    );

    this.input = this.root.querySelector(
      'input[slot="input"], select[slot="input"]'
    );

    this.input.addEventListener('input', () => {
      this.setHasContent();
    });
  }

  render(): JSX.Element {
    return (
      <div class="gux-input-number-container">
        <div class="gux-input-container">
          <slot name="input" />
          {this.renderClearButton()}
        </div>
        {this.renderStepButtons()}
      </div>
    );
  }
}
