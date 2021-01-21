import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core';

let nextCheckboxId = 1;
const classForCheckedState = (checked: boolean, indeterminate: boolean) => {
  if (indeterminate) {
    return 'gux-mixed';
  }

  return checked ? 'gux-checked' : 'gux-unchecked';
};

@Component({
  styleUrl: 'gux-checkbox.less',
  tag: 'gux-checkbox-legacy'
})
export class GuxCheckboxLegacy {
  /**
   * Whether or not the checkbox is checked.  Ignored when in an `indeterminate` state.
   */
  @Prop({
    mutable: true
  })
  checked: boolean;

  /**
   * If true, the checkbox will be displayed in an indeterminate state, and the `checked`
   * value will be ignored.
   */
  @Prop({
    mutable: true
  })
  indeterminate: boolean;

  /** Whether of not the checkbox input is disabled. */
  @Prop()
  disabled: boolean;

  @State()
  id: number;

  /** Emits when the checked state changes. */
  @Event()
  check: EventEmitter<boolean>;

  componentWillLoad() {
    this.id = nextCheckboxId++;
  }

  setChecked(checked: boolean) {
    this.checked = this.indeterminate ? true : checked;
    this.indeterminate = false;

    this.check.emit(checked);
  }

  render() {
    return (
      <div class="gux-checkbox-container">
        <input
          id={`gux-checkbox-${this.id}`}
          type="checkbox"
          checked={this.checked}
          disabled={this.disabled}
          onChange={e =>
            this.setChecked((e.target as HTMLInputElement).checked)
          }
        />
        <label
          htmlFor={`gux-checkbox-${this.id}`}
          class={classForCheckedState(this.checked, this.indeterminate)}
        >
          <slot />
        </label>
      </div>
    );
  }
}
