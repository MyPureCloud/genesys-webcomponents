import { newSpecPage, SpecPage } from '@stencil/core/testing';
import MutationObserver from 'mutation-observer';

import { GuxInputRange } from '../gux-input-range';

const components = [GuxInputRange];
const language = 'en';

describe('gux-input-range', () => {
  let page: SpecPage;

  beforeEach(async () => {
    global.MutationObserver = MutationObserver;

    page = await newSpecPage({
      components,
      html: `
        <gux-input-range>
          <input type="range" slot="input"/>
        </gux-input-range>
      `,
      language: 'en'
    });
  });

  it('should build', async () => {
    expect(page.rootInstance).toBeInstanceOf(GuxInputRange);
  });

  it('should render', async () => {
    expect(page.root).toMatchSnapshot();
  });
});
