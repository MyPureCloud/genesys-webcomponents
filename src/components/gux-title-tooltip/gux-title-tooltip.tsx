import { Component, Element, h, JSX, State } from '@stencil/core';

@Component({
  tag: 'gux-title-tooltip'
})
export class GuxBasicTab {
  private titleName: string;

  @Element()
  private root: HTMLElement;

  @State() private showTooltip: boolean = true;

  componentWillLoad() {
    this.titleName = this.root.querySelector('[slot="title"]').innerHTML;
    this.checkForTooltipHideOrShow();
  }

  private checkForTooltipHideOrShow() {
    const clientWidth = this.root.clientWidth;
    // console.log(clientWidth, 'clientWidth')
    if (clientWidth < 113 && !this.root.querySelector('gux-basic-tab-icon')) {
      this.showTooltip = false;
    }
  }

  render(): JSX.Element {
    return [<slot />, this.renderTooltip()];
  }

  private renderTooltip() {
    if (this.showTooltip) {
      return <gux-tooltip>{this.titleName}</gux-tooltip>;
    }
  }
}
