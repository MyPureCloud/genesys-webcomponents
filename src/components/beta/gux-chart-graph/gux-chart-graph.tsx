import { Component, Element, h, Host, JSX, Prop } from '@stencil/core';
import { default as embed, EmbedOptions, VisualizationSpec } from 'vega-embed';

import { getDesiredLocale } from '../../../i18n';
import { trackComponent } from '../../../usage-tracking';

import { timeFormatLocale } from './gux-chart-graph.locale';

@Component({
  styleUrl: 'gux-chart-graph.less',
  tag: 'gux-chart-graph-beta'
})
export class GuxChartGraph {
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
