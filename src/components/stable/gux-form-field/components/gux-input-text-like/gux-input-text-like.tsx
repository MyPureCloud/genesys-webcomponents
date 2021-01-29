import { Component, Element, h, JSX, Prop, State } from '@stencil/core';

import { buildI18nForComponent, GetI18nValue } from '../../../../../i18n';
import setInputValue from '../../../../../utils/dom/set-input-value';

import modalComponentResources from './i18n/en.json';

/**
 * @slot input - Required slot for input[type="radio"]
 * @slot label - Required slot for label
 */
@Component({
  styleUrl: 'gux-input-text-like.less',
  tag: 'gux-input-text-like'
})
export class GuxInputTextLike {
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
      <div class="gux-input-container">
        <slot name="input" />
        {this.renderClearButton()}
      </div>
    );
  }
}
