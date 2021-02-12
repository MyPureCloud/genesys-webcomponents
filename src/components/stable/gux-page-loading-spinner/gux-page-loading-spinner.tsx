import { Component, h, JSX } from '@stencil/core';

@Component({
  styleUrl: 'gux-page-loading-spinner.less',
  tag: 'gux-page-loading-spinner'
})
export class GuxPageLoadingSpinner {
  render(): JSX.Element {
    return <gux-radial-loading context="full-page"></gux-radial-loading>;
  }
}
