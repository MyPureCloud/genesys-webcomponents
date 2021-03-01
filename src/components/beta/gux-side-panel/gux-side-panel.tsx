import { Component, Element, h, Prop } from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';

@Component({
  styleUrl: 'gux-side-panel.less',
  tag: 'gux-side-panel-beta'
})
export class GuxSidePanel {
  @Element()
  private root: HTMLElement;

  @Prop()
  isOpen = false;

  @Prop()
  position: 'left' | 'right' = 'left';

  get containerClass(): string {
    return `gux-${this.position} gux-${this.isOpen ? 'open' : 'closed'}`;
  }

  get contentClass(): string {
    return `gux-panel-content gux-${this.isOpen ? 'open' : 'closed'}`;
  }

  componentWillLoad(): void {
    trackComponent(this.root, { variant: this.position });
  }

  render() {
    return (
      <aside class={this.containerClass}>
        <div class="gux-panel-icons">
          <slot name="side-panel-icons" />
        </div>
        <div class={this.contentClass}>
          <slot name="side-panel-content" />
        </div>
      </aside>
    );
  }
}
