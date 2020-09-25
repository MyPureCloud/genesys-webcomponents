import { Component, Element, h, JSX, Prop } from '@stencil/core';

@Component({
  styleUrl: 'gux-breadcrumb-item.less',
  tag: 'gux-breadcrumb-item'
})
export class GuxBreadcrumbItem {
  @Element()
  private root: HTMLGuxBreadcrumbItemElement;

  @Prop()
  href: string;

  private isLastBreadcrumb(): boolean {
    const parentNode = this.root.parentNode;
    const children = parentNode.children;

    return children[children.length - 1] === this.root;
  }

  private getBreadcrumb(): JSX.Element {
    if (this.href && !this.isLastBreadcrumb()) {
      return (
        <a class="gux-breadcrumb-content" href={this.href}>
          <slot />
        </a>
      );
    }

    return (
      <span class="gux-breadcrumb-content">
        <slot />
      </span>
    );
  }

  private getSeparatorIcon(): JSX.Element {
    if (this.isLastBreadcrumb()) {
      return null;
    }

    const container = this.root.closest('gux-breadcrumbs-beta');
    const accent = container.accent;

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
    return (
      <span class="gux-breadcrumb-generation">
        {this.getBreadcrumb()}
        {this.getSeparatorIcon()}
      </span>
    );
  }
}
