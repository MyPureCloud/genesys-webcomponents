import { Component, h } from '@stencil/core';

@Component({
  //   styleUrl: 'gux-basic-tab-icon-title.less',
  tag: 'gux-basic-tab-icon-title'
})
export class GuxBasicTabIconTitle {
  render() {
    return [<slot name="icon" />, <slot name="title"></slot>];
  }
}
