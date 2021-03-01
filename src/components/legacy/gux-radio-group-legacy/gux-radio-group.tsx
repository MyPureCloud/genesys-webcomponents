import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Listen,
  Prop,
  Watch
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';

import { GuxRadioLegacy } from '../gux-radio-legacy/gux-radio';

@Component({
  tag: 'gux-radio-group-legacy'
})
export class GuxRadioGroupLegacy {
  @Element()
  private root: HTMLElement;

  /**
   * Fires when the selected radio value changes, with the groups new value.
   */
  @Event()
  input: EventEmitter<any>;

  /**
   * The name of the radio group.  Automatically propagates down to gux-radio-legacys.
   */
  @Prop()
  name: string;

  /**
   * The selected value of the radio group.
   */
  @Prop({ mutable: true, reflectToAttr: true })
  value: any;

  private radios: GuxRadioLegacy[] = [];

  @Listen('guxRadioWillLoad')
  radioWillLoad(ev: CustomEvent<GuxRadioLegacy>) {
    const radio = ev.detail;
    this.radios.push(radio);

    if (this.value === undefined && radio.checked) {
      this.value = radio.value;
    }

    if (this.name) {
      radio.name = this.name;
    }
  }

  @Listen('guxRadioWillUnload')
  radioWillUnload(ev: CustomEvent<GuxRadioLegacy>) {
    this.radios = this.radios.filter(r => r !== ev.detail);
  }

  @Listen('check')
  radioChecked(ev: CustomEvent<boolean>) {
    const radio = (ev.target as unknown) as GuxRadioLegacy;
    if (!ev.detail) {
      return;
    }

    this.value = radio.value;
  }

  @Watch('value')
  valueChanged(newValue: any) {
    this.updateRadioButtons();
    this.input.emit(newValue);
  }

  hostData() {
    return {
      role: 'radiogroup'
      // TODO: Should we include an optional header/label?
      // 'aria-labelledby': this.labelId
    };
  }

  componentWillLoad(): void {
    trackComponent(this.root);
  }

  render() {
    return (
      <div>
        <slot />
      </div>
    );
  }

  private updateRadioButtons() {
    this.radios.forEach(r => (r.checked = r.value === this.value));
  }
}
