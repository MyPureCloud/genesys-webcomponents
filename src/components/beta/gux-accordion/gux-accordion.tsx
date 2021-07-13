import { Component, Element, h } from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';

@Component({
  styleUrl: 'gux-accordion.less',
  tag: 'gux-accordion-beta',
  shadow: true
})
export class GuxAccordionBeta {
  @Element()
  root: HTMLElement;

  componentWillLoad() {
    trackComponent(this.root);
  }

  render() {
    return <slot></slot>;
  }
}
