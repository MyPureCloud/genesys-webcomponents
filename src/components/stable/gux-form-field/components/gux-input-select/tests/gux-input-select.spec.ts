import { newSpecPage, SpecPage } from '@stencil/core/testing';
import * as popperjs from '@popperjs/core';
import MutationObserver from 'mutation-observer';

import { GuxInputSelect } from '../gux-input-select';

const components = [GuxInputSelect];
const language = 'en';

describe.skip('gux-input-select', () => {
  let page: SpecPage;

  beforeEach(async () => {
    global.MutationObserver = MutationObserver;

    jest.spyOn(popperjs, 'createPopper').mockReturnValue(({
      destroy: jest.fn()
    } as unknown) as popperjs.Instance);

    page = await newSpecPage({
      components,
      html: `
        <gux-input-select>
          <select slot="input">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </<gux-input-select>
      `,
      language
    });
  });

  it('should build', async () => {
    expect(page.rootInstance).toBeInstanceOf(GuxInputSelect);
  });

  it('should render', async () => {
    expect(page.root).toMatchSnapshot();
  });
});
