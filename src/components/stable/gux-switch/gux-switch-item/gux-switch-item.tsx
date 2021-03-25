import { Component, h, Host, Listen, JSX, Prop } from '@stencil/core';

@Component({
  styleUrl: 'gux-switch-item.less',
  tag: 'gux-switch-item'
})
export class GuxSwitchItem {
  @Prop()
  value: string;

  @Prop()
  selected: boolean = false;

  @Prop()
  disabled: boolean = false;

  @Listen('click')
  onClick(e: MouseEvent): void {
    if (this.disabled) {
      e.stopPropagation();
    }
  }

  render(): JSX.Element {
    return (
      <Host class={{ 'gux-selected': this.selected }}>
        <button type="button" class="gux-switch-item" disabled={this.disabled}>
          <slot />
        </button>
      </Host>
    );
  }
}
