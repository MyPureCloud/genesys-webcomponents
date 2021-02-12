import { Component, h, JSX, Prop } from '@stencil/core';

import { GuxRadialLoadingContext } from './gux-radial-loading.types';

@Component({
  styleUrl: 'gux-radial-loading.less',
  tag: 'gux-radial-loading'
})
export class GuxRadialLoading {
  /**
   * The display context the component is in.
   */
  @Prop()
  context: GuxRadialLoadingContext = 'modal';

  render(): JSX.Element {
    return (
      <div class={`gux-spinner-container gux-${this.context}`} aria-busy="true">
        <div class="gux-spin-circle" />
      </div>
    );
  }
}
