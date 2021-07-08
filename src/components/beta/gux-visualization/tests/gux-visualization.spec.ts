import { newSpecPage } from '@stencil/core/testing';
import { GuxVisualization } from '../gux-visualization';

const components = [GuxVisualization];
const language = 'en';

describe('gux-visualization-beta', () => {
  describe('#render', () => {
    [
      {
        description: 'should render default button',
        html: '<gux-visualization-beta></gux-visualization-beta>'
      }
    ].forEach(({ description, html }) => {
      it(description, async () => {
        const page = await newSpecPage({ components, html, language });

        expect(page.rootInstance).toBeInstanceOf(GuxVisualization);
        expect(page.root).toMatchSnapshot();
      });
    });
  });
});
