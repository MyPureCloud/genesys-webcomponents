import { newSpecPage, SpecPage } from '@stencil/core/testing';
import MutationObserver from 'mutation-observer';

import { GuxInputNumber } from '../gux-input-number';

const components = [GuxInputNumber];
const language = 'en';

describe('gux-input-number', () => {
  let page: SpecPage;

  beforeEach(async () => {
    global.MutationObserver = MutationObserver;

    page = await newSpecPage({
      components,
      html: `
        <gux-input-number>
          <input type="number" slot="input"/>
        </gux-input-number>
      `,
      language: 'en'
    });
  });

  it('should build', async () => {
    expect(page.rootInstance).toBeInstanceOf(GuxInputNumber);
  });

  it('should render', async () => {
    expect(page.root).toMatchSnapshot();
  });
});
