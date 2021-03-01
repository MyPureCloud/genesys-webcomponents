import { Component, Element, h, State } from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';

@Component({
  styleUrl: 'gux-panel-frame.less',
  tag: 'gux-panel-frame-beta'
})
export class GuxPanelFrame {
  @Element()
  root: HTMLElement;

  @State()
  hasHeader: boolean = false;

  @State()
  hasBody: boolean = false;

  @State()
  hasFooter: boolean = false;

  initializeSections() {
    const children = Array.from(this.root.children);
    children.map(element => {
      const slot = element.getAttribute('slot');
      switch (slot) {
        case 'header':
          this.hasHeader = true;
          break;
        case 'body':
          this.hasBody = true;
          break;
        case 'footer':
          this.hasFooter = true;
          break;
      }
    });
  }

  componentWillLoad() {
    trackComponent(this.root);
    this.initializeSections();
  }

  render() {
    return (
      <div class="gux-panel-container">
        {this.hasHeader && (
          <div class="gux-panel-header">
            <slot name="header" />
          </div>
        )}
        {this.hasBody && (
          <div class="gux-panel-body">
            <slot name="body" />
          </div>
        )}
        {this.hasFooter && (
          <div class="gux-panel-footer">
            <slot name="footer" />
          </div>
        )}
      </div>
    );
  }
}
