import { Component, Element, h, JSX } from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';

@Component({
  styleUrl: 'gux-page-loading-spinner.less',
  tag: 'gux-page-loading-spinner'
})
export class GuxPageLoadingSpinner {
  @Element()
  private root: HTMLElement;

  componentWillLoad(): void {
    trackComponent(this.root);
  }

  render(): JSX.Element {
    return <gux-radial-loading context="full-page"></gux-radial-loading>;
  }
}
