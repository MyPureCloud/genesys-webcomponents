import { Component, Element, h, JSX, Prop } from '@stencil/core';

import { GuxBreadcrumbAccent } from '../gux-breadcrumbs.types';

@Component({
  styleUrl: 'gux-breadcrumb-item.less',
  tag: 'gux-breadcrumb-item'
})
export class GuxBreadcrumbItem {
  @Element()
  private root: HTMLElement;

  @Prop()
  href: string;

  private getAccent(): GuxBreadcrumbAccent {
    const container = this.root.closest('gux-breadcrumbs');

    if (container) {
      return container.accent;
    } else {
      console.error(
        `gux-breadcrumb-item: must be within a gux-breadcrumbs component`
      );
    }
  }

  private isLastBreadcrumb(): boolean {
    const parentNode = this.root.parentNode;
    const children = parentNode.children;

    return children[children.length - 1] === this.root;
  }

  private getBreadcrumb(): JSX.Element {
    if (!this.href || this.isLastBreadcrumb()) {
      return (
        <span class="gux-breadcrumb-content">
          <slot />
        </span>
      );
    }

    return (
      <a class="gux-breadcrumb-content gux-link" href={this.href}>
        <slot />
      </a>
    );
  }

  private getSeparatorIcon(accent: GuxBreadcrumbAccent): JSX.Element {
    if (this.isLastBreadcrumb()) {
      return null;
    }

    switch (accent) {
      case 'primary':
        return (
          <span class="gux-breadcrumb-separator" aria-hidden="true">
            /
          </span>
        );
      case 'secondary':
        return (
          <gux-icon
            class="gux-breadcrumb-separator"
            icon-name="ic-chevron-small-right"
            decorative
          ></gux-icon>
        );
      default:
        return (
          <span class="gux-breadcrumb-separator" aria-hidden="true">
            /
          </span>
        );
    }
  }

  render(): JSX.Element {
    const accent: GuxBreadcrumbAccent = this.getAccent();

    return (
      <span class={`gux-breadcrumb-generation gux-${accent}`}>
        {this.getBreadcrumb()}
        {this.getSeparatorIcon(accent)}
      </span>
    );
  }
}
