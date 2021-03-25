import {
  Component,
  Element,
  h,
  Host,
  Listen,
  JSX,
  Prop,
  State
} from '@stencil/core';

import { GuxSwitchAllowedLayouts } from './gux-switch.types';

import simulateNativeEvent from '../../../utils/dom/simulate-native-event';
import { trackComponent } from '../../../usage-tracking';

/**
 * @slot - list of gux-switch-item elements
 */
@Component({
  styleUrl: 'gux-switch.less',
  tag: 'gux-switch',
  shadow: true
})
export class GuxSwitch {
  @Element()
  root: HTMLElement;

  @Prop({ mutable: true })
  value: string;

  @Prop()
  layout: GuxSwitchAllowedLayouts = 'default';

  @State()
  switchItems: HTMLGuxSwitchItemElement[] = [];

  @Listen('click')
  onClick(e: MouseEvent): void {
    e.stopPropagation();

    const switchItem = (e.target as HTMLElement).closest('gux-switch-item');

    if (switchItem && this.value !== switchItem.value) {
      this.value = switchItem.value;

      simulateNativeEvent(this.root, 'input');
      simulateNativeEvent(this.root, 'change');
    }
  }

  private slotChanged(): void {
    this.switchItems = Array.from(
      this.root.children
    ) as HTMLGuxSwitchItemElement[];
  }

  componentWillLoad(): void {
    trackComponent(this.root, { variant: this.layout });
  }

  componentWillRender(): void {
    this.switchItems.forEach(switchItem => {
      switchItem.selected = switchItem.value === this.value;
    });
  }

  render(): JSX.Element {
    return (
      <Host role="group" class={`gux-${this.layout}`}>
        <slot onSlotchange={() => this.slotChanged()} />
      </Host>
    );
  }
}
