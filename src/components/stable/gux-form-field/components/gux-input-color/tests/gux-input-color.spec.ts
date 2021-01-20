import { newSpecPage } from '@stencil/core/testing';
import MutationObserver from 'mutation-observer';

import { GuxInputColorOption } from '../../gux-input-color/components/gux-input-color-option/gux-input-color-option';
import { GuxInputColorSelect } from '../../gux-input-color/components/gux-color-select/gux-input-color-select';
import { GuxInputColor } from '../gux-input-color';

const components = [GuxInputColor, GuxInputColorSelect, GuxInputColorOption];
const language = 'en';

describe('gux-input-color', () => {
  beforeEach(() => {
    global.MutationObserver = MutationObserver;
  });

  it('should build', async () => {
    const html = `<gux-input-color><input slot="input" type="color" value="#75A8FF"></gux-input-color>`;
    const page = await newSpecPage({ components, html, language });
    const component = page.rootInstance;

    expect(component).toBeInstanceOf(GuxInputColor);
  });
});
