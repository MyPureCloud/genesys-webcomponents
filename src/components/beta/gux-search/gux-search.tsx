import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';

@Component({
  styleUrl: 'gux-search.less',
  tag: 'gux-search-beta'
})
export class GuxSearch {
  @Element()
  root: HTMLElement;

  textFieldElement: HTMLGuxTextFieldLegacyElement;

  /**
   * Indicate the input search value
   */
  @Prop({ mutable: true, reflectToAttr: true })
  value: string = '';

  /**
   * Disable the input and prevent interactions.
   */
  @Prop()
  disabled: boolean = false;

  /**
   * The input placeholder.
   */
  @Prop()
  placeholder: string;

  /**
   * Operate the search control using dynamic searching
   * as the input value is updated.  Searches debounced
   * to execute every searchTimeout.
   */
  @Prop()
  dynamicSearch: boolean = false;

  /**
   * Timeout between input and search.
   */
  @Prop()
  searchTimeout: number = 500;

  /**
   * Aria label for the search box.
   */
  @Prop()
  srLabel: string;

  /**
   * Triggered when a search is requested.
   */
  @Event()
  search: EventEmitter;

  /**
   * Triggered when the user inputs data into the control.
   * @return The input value.
   */
  @Event()
  input: EventEmitter;

  @State()
  timeout: number;

  @Watch('value')
  watchValue() {
    if (!this.dynamicSearch) {
      return;
    }

    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      this._emitSearch();
    }, this.searchTimeout);
  }

  /**
   * Provides an aria-labeledby element for this component.
   */
  @Method()
  async setLabeledBy(labeledBy: string) {
    this.textFieldElement.setLabelledBy(labeledBy);
  }

  /**
   * Sets the input focus to the search input.
   */
  @Method()
  async setInputFocus() {
    this.textFieldElement.setInputFocus();
  }

  componentWillLoad(): void {
    trackComponent(this.root);
  }

  render() {
    return (
      <div class={this.getClassList()}>
        <div class="gux-search-input">
          <gux-text-field-legacy
            ref={el =>
              (this.textFieldElement = el as HTMLGuxTextFieldLegacyElement)
            }
            value={this.value}
            disabled={this.disabled}
            placeholder={this.placeholder}
            srLabel={this.srLabel}
            onInput={e => this._onInput(e)}
            onKeyDown={e => this._onKeyDown(e)}
          />
          <div class="gux-search-icon">
            <gux-icon decorative iconName="ic-search"></gux-icon>
          </div>
        </div>
      </div>
    );
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this._emitSearch();
    }
  }

  private _onInput(event: any) {
    this.value = event.target.value;
    this.input.emit(event);
  }

  private _emitSearch() {
    this.search.emit(this.value);
  }

  private getClassList(): string {
    let classList = [];
    if (this.disabled) {
      classList = [...classList, 'gux-disabled'];
    }
    return classList.join(' ');
  }
}
