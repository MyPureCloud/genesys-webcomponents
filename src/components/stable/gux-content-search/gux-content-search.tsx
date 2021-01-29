import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Method,
  Prop,
  State
} from '@stencil/core';

import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import contentSearchResources from './i18n/en.json';
import { onDisabledChange } from '../../../utils/dom/on-attribute-change';

/**
 * @slot  - Required slot for input tag
 */

@Component({
  styleUrl: 'gux-content-search.less',
  tag: 'gux-content-search'
})
export class GuxContentSearch {
  private inputSlottedElement: HTMLInputElement;
  private disabledObserver: MutationObserver;

  @Element()
  private root: HTMLElement;

  /**
   * The Match Count
   */
  @Prop({ mutable: true })
  matchCount: number = 0;

  /**
   * The Current match count which needs to highlighted
   */
  @Prop({ mutable: true })
  currentMatch: number = 0;

  @State()
  private disabled: boolean;

  @State()
  private value: string;

  /**
   * Triggered when Current match value changes
   * @return The Current match value
   */
  @Event()
  guxcurrentmatchchanged: EventEmitter<number>;

  private i18n: GetI18nValue;

  /**
   * Clears the input.
   */
  @Method()
  async clear(): Promise<void> {
    if (this.disabled) {
      return;
    }
    this.matchCount = 0;
    this.currentMatch = 0;
    this.value = '';
    this.emitCurrentMatchChanged();
    this.resetInputSlottedElement();
  }

  async componentWillLoad() {
    this.i18n = await buildI18nForComponent(this.root, contentSearchResources);
    this.inputSlottedElement = this.root.querySelector('input');
    this.disabled = this.inputSlottedElement.disabled;
    this.value = this.inputSlottedElement.value;
    this.disabledObserver = onDisabledChange(
      this.inputSlottedElement,
      (disabled: boolean) => {
        this.disabled = disabled;
      }
    );
    this.inputSlottedElement.addEventListener('input', e => this.onInput(e));
  }

  componentDidUnload(): void {
    this.disabledObserver.disconnect();
  }

  render() {
    return (
      <div class={{ 'gux-disabled': this.disabled, 'gux-content': true }}>
        <div class="gux-search-icon">
          <gux-icon decorative iconName="ic-search"></gux-icon>
        </div>
        <slot />
        {this.getNavigationPanel()}
      </div>
    );
  }

  private getNavigationPanel(): JSX.Element {
    if (this.showNavigationPanel()) {
      const disableNavigationPanel = this.disableNavigationPanel();
      return (
        <div class="gux-content-control-panel">
          <div
            class={{
              'gux-navigation-panel': true,
              'gux-navigation-disabled': disableNavigationPanel
            }}
            title={this.matchCountResult()}
          >
            <span
              class={{
                'gux-navigation-result': true,
                'gux-navigation-result-disabled': disableNavigationPanel
              }}
              aria-label={this.matchCountResult()}
            >
              {this.matchCountResult()}
            </span>
            <button
              type="button"
              class="gux-previous-button"
              title={this.i18n('navigatePreviousBtn')}
              aria-label={this.i18n('navigatePreviousBtn')}
              onClick={() => this.previousClick()}
              disabled={disableNavigationPanel}
            >
              <gux-icon decorative iconName="ic-arrow-solid-up"></gux-icon>
            </button>
            <button
              type="button"
              class="gux-next-button"
              title={this.i18n('navigateNextBtn')}
              aria-label={this.i18n('navigateNextBtn')}
              onClick={() => this.nextClick()}
              disabled={disableNavigationPanel}
            >
              <gux-icon decorative iconName="ic-arrow-solid-down"></gux-icon>
            </button>
          </div>
          <button
            type="button"
            class="gux-clear-button"
            title={this.i18n('eraseBtnAria')}
            aria-label={this.i18n('eraseBtnAria')}
            onClick={() => this.clear()}
            disabled={this.disabled}
          >
            <gux-icon decorative iconName="ic-close"></gux-icon>
          </button>
        </div>
      );
    }

    return null;
  }

  private matchCountResult(): string {
    return this.i18n('totalMatches', {
      currentMatch: this.getNormalizedCurrentMatch(),
      matchCount: this.getNormalizedMatchCount()
    });
  }

  private showNavigationPanel(): boolean {
    return this.value !== '' ? true : false;
  }

  private disableNavigationPanel(): boolean {
    return this.disabled || this.getNormalizedMatchCount() <= 0;
  }

  private getNormalizedMatchCount(): number {
    return this.matchCount &&
      Number.isInteger(this.matchCount) &&
      this.matchCount >= 0
      ? Number(this.matchCount)
      : 0;
  }

  private getNormalizedCurrentMatch(): number {
    return this.currentMatch &&
      Number.isInteger(this.currentMatch) &&
      this.currentMatch >= 0 &&
      this.currentMatch <= this.getNormalizedMatchCount() &&
      this.getNormalizedMatchCount() > 0
      ? Number(this.currentMatch)
      : 0;
  }

  private resetInputSlottedElement() {
    this.inputSlottedElement.value = '';
    this.inputSlottedElement.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        cancelable: true
      })
    );
    this.inputSlottedElement.dispatchEvent(
      new InputEvent('change', {
        bubbles: true
      })
    );
  }

  private nextClick(): void {
    if (this.disableNavigationPanel()) {
      return;
    }
    if (this.getNormalizedCurrentMatch() === this.getNormalizedMatchCount()) {
      this.currentMatch = 1;
    } else {
      this.currentMatch = this.getNormalizedCurrentMatch() + 1;
    }
    this.emitCurrentMatchChanged();
  }

  private previousClick(): void {
    if (this.disableNavigationPanel()) {
      return;
    }
    if (
      this.getNormalizedCurrentMatch() === 1 ||
      this.getNormalizedCurrentMatch() === 0
    ) {
      this.currentMatch = this.getNormalizedMatchCount();
    } else {
      this.currentMatch = this.getNormalizedCurrentMatch() - 1;
    }
    this.emitCurrentMatchChanged();
  }

  private onInput(event): void {
    this.value = event.target.value;
  }

  private emitCurrentMatchChanged(): void {
    this.guxcurrentmatchchanged.emit(this.getNormalizedCurrentMatch());
  }
}
