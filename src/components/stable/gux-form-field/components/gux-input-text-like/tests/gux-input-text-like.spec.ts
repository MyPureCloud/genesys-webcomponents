import { newSpecPage, SpecPage } from '@stencil/core/testing';
import MutationObserver from 'mutation-observer';

import { GuxInputTextLike } from '../gux-input-text-like';

const components = [GuxInputTextLike];
const language = 'en';

describe('gux-input-text-like', () => {
  let page: SpecPage;

  beforeEach(async () => {
    global.MutationObserver = MutationObserver;

    page = await newSpecPage({
      components,
      html: `
        <gux-input-text-like>
          <input type="text" slot="input"/>
        </gux-input-text-like>
      `,
      language: 'en'
    });
  });

  it('should build', async () => {
    expect(page.rootInstance).toBeInstanceOf(GuxInputTextLike);
  });

  it('should render', async () => {
    expect(page.root).toMatchSnapshot();
  });
});
