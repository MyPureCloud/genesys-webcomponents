import { Component, h } from '@stencil/core';

@Component({
  styleUrl: 'gux-basic-tab-icon.less',
  tag: 'gux-basic-tab-icon'
})
export class GuxBasicTabTitle {
  render() {
    return [
      <slot name="icon" />,
      <span class="gux-hidden">
        <slot name="title" />
      </span>
    ];
  }
}
