import { Component, Element, h, JSX, Prop } from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';

import { GuxRadialLoadingContext } from './gux-radial-loading.types';

@Component({
  styleUrl: 'gux-radial-loading.less',
  tag: 'gux-radial-loading'
})
export class GuxRadialLoading {
  @Element()
  private root: HTMLElement;

  /**
   * The display context the component is in.
   */
  @Prop()
  context: GuxRadialLoadingContext = 'modal';

  componentWillLoad(): void {
    trackComponent(this.root, { variant: this.context });
  }

  render(): JSX.Element {
    return (
      <div class={`gux-spinner-container gux-${this.context}`} aria-busy="true">
        <div class="gux-spin-circle" />
      </div>
    );
  }
}
