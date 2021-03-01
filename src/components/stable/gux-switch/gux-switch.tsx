import { Component, Element, h, Host, Listen, JSX, Prop } from '@stencil/core';

import { GuxSwitchAllowedLayouts } from './gux-switch.types';

import simulateNativeEvent from '../../../utils/dom/simulate-native-event';
import { trackComponent } from '../../../usage-tracking';

/**
 * @slot - list of gux-switch-item elements
 */
@Component({
  styleUrl: 'gux-switch.less',
  tag: 'gux-switch'
})
export class GuxSwitch {
  @Element()
  root: HTMLElement;

  /**
   * Used to keep track of the currently selected value
   */
  @Prop({ mutable: true })
  value: string;

  /**
   * The allowed sizes
   */
  @Prop()
  layout: GuxSwitchAllowedLayouts = 'default';

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

  private updateSelectedItem(switchItems: HTMLGuxSwitchItemElement[]): void {
    switchItems.forEach(switchItem => {
      if (switchItem.value === this.value) {
        switchItem.classList.add('gux-selected');
      } else {
        switchItem.classList.remove('gux-selected');
      }
    });
  }

  componentWillLoad(): void {
    trackComponent(this.root, { variant: this.layout });
  }

  render(): JSX.Element {
    this.updateSelectedItem(
      Array.from(this.root.children) as HTMLGuxSwitchItemElement[]
    );

    return (
      <Host role="group" class={`gux-${this.layout}`}>
        <slot />
      </Host>
    );
  }
}
