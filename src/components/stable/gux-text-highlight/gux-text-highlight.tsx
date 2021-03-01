import { Component, Element, h, JSX, Prop } from '@stencil/core';
import {
  getFuzzyReplacements,
  matchesFuzzy
} from '../../../utils/string/search';

import { trackComponent } from '../../../usage-tracking';

import { GuxTextHighlightStrategy } from './gux-text-highlight.types';

@Component({
  tag: 'gux-text-highlight'
})
export class GuxTextHighlight {
  @Element()
  private root: HTMLElement;

  /**
   * The value to display.
   */
  @Prop()
  text: string;

  /**
   * The text to highlight.
   */
  @Prop()
  highlight: string;

  /**
   * The way the text should be highlighted.
   */
  @Prop()
  strategy: GuxTextHighlightStrategy = 'start';

  componentWillLoad(): void {
    trackComponent(this.root);
  }

  render(): JSX.Element {
    if (this.highlight && this.text) {
      switch (this.strategy) {
        case 'start':
          return this.renderStartsWith();
        case 'contains':
          return this.renderContains();
        case 'fuzzy':
          return this.renderFuzzy();
      }
    }

    return <span>{this.text}</span>;
  }

  private renderStartsWith(): HTMLSpanElement {
    if (this.text.toLowerCase().startsWith(this.highlight.toLowerCase())) {
      const highlight = this.text.substring(0, this.highlight.length);
      const after = this.text.substring(this.highlight.length);

      return (
        <span>
          <mark>{highlight}</mark>
          {after}
        </span>
      );
    }

    return <span>{this.text}</span>;
  }

  private renderContains(): HTMLSpanElement {
    const html = {
      highlighted: '',
      remaining: this.text
    };

    while (
      html.remaining.toLowerCase().includes(this.highlight.toLowerCase())
    ) {
      const index = html.remaining
        .toLowerCase()
        .indexOf(this.highlight.toLowerCase());
      const before = html.remaining.substring(0, index);
      const highlight = html.remaining.substring(
        index,
        index + this.highlight.length
      );
      html.highlighted += before + `<mark>${highlight}</mark>`;
      html.remaining = html.remaining.substring(index + highlight.length);
    }

    return <span innerHTML={html.highlighted + html.remaining} />;
  }

  private renderFuzzy(): HTMLSpanElement {
    if (matchesFuzzy(this.highlight, this.text)) {
      const html = getFuzzyReplacements(this.highlight).reduce(
        (acc, needle) => {
          const {
            0: highlight,
            index,
            input
          } = (acc.remaining as string).match(needle);
          const before = input.substring(0, index);
          const highlighted =
            acc.highlighted + before + `<mark>${highlight}</mark>`;
          const remaining = input.substring(index + highlight.length);

          return { highlighted, remaining };
        },
        {
          highlighted: '',
          remaining: this.text
        }
      );

      return <span innerHTML={html.highlighted + html.remaining} />;
    }

    return <span>{this.text}</span>;
  }
}
