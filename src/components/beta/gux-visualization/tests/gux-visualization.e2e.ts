import { newE2EPage } from '@stencil/core/testing';

const visualizationSpecLine = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: { url: 'https://vega.github.io/editor/data/seattle-weather.csv' },
  mark: {
    type: 'line',
    interpolate: 'monotone'
  },
  encoding: {
    x: { timeUnit: 'month', field: 'date', bandPosition: 0.5 },
    y: { aggregate: 'mean', field: 'temp_max' }
  }
};

describe('gux-visualization-beta', () => {
  describe('#render', () => {
    [
      {
        description: 'should render default button',
        html: '<gux-visualization-beta id="visualization-1"></gux-visualization-beta>'
      }
    ].forEach(({ description, html }) => {
      it(description, async () => {
        const page = await newE2EPage({ html });
        const element = await page.find('gux-visualization-beta');
        element.visualizationSpec = visualizationSpecLine;

        expect(element.outerHTML).toMatchSnapshot();
      });
    });
  });
});
