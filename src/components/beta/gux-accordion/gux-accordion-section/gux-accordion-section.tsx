import { Component, Element, h, JSX, Method, Prop, State } from '@stencil/core';

import { logError } from '../../../../utils/error/log-error';

import { GuxAccordionSectionArrowPosition } from './gux-accordion-section.types';

@Component({
  styleUrl: 'gux-accordion-section.less',
  tag: 'gux-accordion-section',
  shadow: true
})
export class GuxAccordionSection {
  @Element()
  root: HTMLElement;

  @Prop()
  arrowPosition: GuxAccordionSectionArrowPosition = 'default';

  @State()
  private expanded: boolean = false;

  @Method()
  async open() {
    this.expanded = true;
  }

  @Method()
  async close() {
    this.expanded = false;
  }

  @Method()
  async toggle() {
    this.expanded = !this.expanded;
  }

  private onHeaderSlotChange(): void {
    const header = this.root.querySelector('[slot="header"]');

    if (!header || !/^H[1-6]$/.test(header.nodeName)) {
      logError(
        'gux-accordion-section',
        'For accessibility reasons the header slot should be filled with a HTML heading tag (h1 - h6).'
      );
    }
  }

  private renderHeaderSpacer(
    arrowPosition: GuxAccordionSectionArrowPosition
  ): JSX.Element {
    if (arrowPosition === 'beside-text') {
      return null;
    }

    return <div class="gux-header-spacer"></div>;
  }

  render(): JSX.Element {
    return (
      <section>
        <button class="gux-header" onClick={this.toggle.bind(this)}>
          <div class="gux-header-text">
            <slot
              onSlotchange={this.onHeaderSlotChange.bind(this)}
              name="header"
            ></slot>
          </div>
          {this.renderHeaderSpacer(this.arrowPosition)}
          <div
            class={{
              'gux-header-icon': true,
              'gux-expanded': this.expanded
            }}
          >
            <gux-icon decorative icon-name="chevron-small-down"></gux-icon>
          </div>
        </button>
        <div
          class={{
            'gux-content': true,
            'gux-expanded': this.expanded
          }}
        >
          <slot name="content"></slot>
        </div>
      </section>
    );
  }
}
