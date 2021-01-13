import { newSpecPage } from '@stencil/core/testing';
import MutationObserver from 'mutation-observer';

import { GuxInputRangeBeta } from '../gux-input-range-beta';

const components = [GuxInputRangeBeta];
const language = 'en';

describe('gux-input-range-beta', () => {
  let page: SpecPage;

  beforeEach(async () => {
    global.MutationObserver = MutationObserver;

    page = await newSpecPage({
      components,
      html: `
        <gux-input-range-beta>
          <input type="range" slot="input"/>
        </gux-input-range-beta>
      `,
      language: 'en'
    });
  });

  it('should build', async () => {
    expect(page.rootInstance).toBeInstanceOf(GuxInputRangeBeta);
  });

  it('should render', async () => {
    expect(page.root).toMatchSnapshot();
  });
});
