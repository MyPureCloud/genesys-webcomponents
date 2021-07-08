import { Component, Element, h, Host, JSX, Prop } from '@stencil/core';
import embed, { EmbedOptions, VisualizationSpec } from 'vega-embed';

import { getDesiredLocale } from '../../../i18n';
import { trackComponent } from '../../../usage-tracking';

import { timeFormatLocale } from './gux-visualization.locale';

@Component({
  styleUrl: 'gux-visualization.less',
  tag: 'gux-visualization-beta'
})
export class GuxVisualization {
  private defaultVisualizationSpec: VisualizationSpec = {};

  private defaultEmbedOptions: EmbedOptions = {
    actions: false,
    renderer: 'svg'
  };

  @Element()
  root: HTMLElement;

  @Prop()
  visualizationSpec: VisualizationSpec;

  @Prop()
  embedOptions: EmbedOptions;

  async componentWillLoad(): Promise<void> {
    trackComponent(this.root);

    const locale = getDesiredLocale(this.root);

    embed(
      this.root,
      Object.assign({}, this.defaultVisualizationSpec, this.visualizationSpec),
      Object.assign(
        {
          timeFormatLocale: timeFormatLocale[locale]
        },
        this.defaultEmbedOptions,
        this.embedOptions
      )
    );
  }

  render(): JSX.Element {
    return <Host></Host>;
  }
}
