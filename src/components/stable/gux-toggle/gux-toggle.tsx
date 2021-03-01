import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';

import { GuxToggleLabelPosition } from './gux-toggle.types';

@Component({
  styleUrl: 'gux-toggle.less',
  tag: 'gux-toggle'
})
export class GuxToggle {
  @Element()
  root: HTMLElement;

  checkboxElement: HTMLInputElement;

  /**
   * Indicate if the toggle is checked or not
   */
  @Prop({ mutable: true })
  checked: boolean;

  /**
   * Indicate if the toggle is disabled or not
   */
  @Prop()
  disabled: boolean;

  /**
   * Indicate the checked label
   */
  @Prop()
  checkedLabel: string;

  /**
   * Indicate the unchecked label
   */
  @Prop()
  uncheckedLabel: string;

  @Prop()
  labelPosition: GuxToggleLabelPosition = 'right';

  /**
   * Triggered when the state of the component changed.
   * @return the checked boolean value
   */
  @Event()
  check: EventEmitter;
  emitInput(event) {
    event.preventDefault();
    event.stopPropagation();
    this.checked = event.target.checked;
    this.check.emit(this.checked);
  }

  toggle() {
    if (!this.disabled) {
      this.checkboxElement.click();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 32 || event.keyCode === 13) {
      this.toggle();
    }
  }

  getAriaLabel() {
    let label = this.checked ? this.checkedLabel : this.uncheckedLabel;
    if (!label) {
      label = this.root.getAttribute('aria-label') || this.root.title;
    }
    return label;
  }

  componentWillLoad(): void {
    trackComponent(this.root, {
      variant: this.checkedLabel || this.uncheckedLabel ? 'labled' : 'unlabled'
    });
  }

  render() {
    return (
      <div
        class={{
          'gux-switch-container': true,
          'gux-switch-label-left': this.labelPosition === 'left',
          'gux-checked': this.checked
        }}
        tabindex={this.disabled ? '' : '0'}
        role="checkbox"
        aria-checked={this.checked + ''}
        aria-label={this.getAriaLabel()}
        onClick={() => this.toggle()}
        onKeyDown={e => this.onKeyDown(e)}
      >
        <div class="gux-switch" role="presentation">
          <input
            type="checkbox"
            ref={el => (this.checkboxElement = el)}
            checked={this.checked}
            onInput={e => this.emitInput(e)}
            disabled={this.disabled}
          />
          <span class="gux-slider gux-round" />
        </div>
        {this.uncheckedLabel && this.checkedLabel ? (
          <div class="gux-switch-label">
            {this.checked ? this.checkedLabel : this.uncheckedLabel}
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
