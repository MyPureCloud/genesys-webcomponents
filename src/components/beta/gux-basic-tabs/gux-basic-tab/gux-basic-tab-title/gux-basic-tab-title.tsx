import { Component, h } from '@stencil/core';

@Component({
  //   styleUrl: 'gux-basic-tab-title.less',
  tag: 'gux-basic-tab-title'
})
export class GuxBasicTabTitle {
  render() {
    return <slot name="title" />;
  }
}
