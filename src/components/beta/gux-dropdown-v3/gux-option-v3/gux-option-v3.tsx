import { Component, Element, h, Host, JSX, Prop } from '@stencil/core';

import { randomHTMLId } from '../../../../utils/dom/random-html-id';

@Component({
  styleUrl: 'gux-option-v3.less',
  tag: 'gux-option-v3'
})
export class GuxOptionV3 {
  @Element()
  root: HTMLElement;

  // text prop removed
  // @Prop()
  // text: string;

  @Prop()
  value: string;

  @Prop()
  active: boolean = false;

  @Prop()
  selected: boolean = false;

  @Prop()
  disabled: boolean = false;

  // shouldFilter method removed
  // @Method()
  // shouldFilter(searchInput: string): Promise<boolean> {
  // }

  componentWillLoad(): void {
    this.root.id = this.root.id || randomHTMLId('gux-option-v3');
  }

  private getAriaSelected(): boolean | string {
    if (this.disabled) {
      return false;
    }

    return this.selected ? 'true' : 'false';
  }

  render(): JSX.Element {
    return (
      <Host
        role="option"
        class={{
          'gux-active': this.active,
          'gux-selected': this.selected,
          'gux-disabled': this.disabled
        }}
        aria-selected={this.getAriaSelected()}
        aria-disabled={this.disabled}
      >
        <slot />
      </Host>
    );
  }
}
