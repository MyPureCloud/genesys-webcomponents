import { newSpecPage } from '@stencil/core/testing';
import { GuxInputColorOption } from '../../gux-input-color-option/gux-input-color-option';
import { GuxInputColorSelect } from '../gux-input-color-select';

const components = [GuxInputColorSelect, GuxInputColorOption];
const language = 'en';

describe('gux-input-color-select', () => {
  it('should build', async () => {
    const html = `<gux-input-color-select><input slot="input" type="color" value="#75A8FF"></gux-input-color-select>`;
    const page = await newSpecPage({ components, html, language });
    const component = page.rootInstance;

    expect(component).toBeInstanceOf(GuxInputColorSelect);
  });
});
