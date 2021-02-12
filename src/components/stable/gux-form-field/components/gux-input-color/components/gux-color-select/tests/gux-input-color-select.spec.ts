import { newSpecPage } from '@stencil/core/testing';
import { GuxInputColorOption } from '../../gux-input-color-option/gux-input-color-option';
import { GuxColorSelect } from '../gux-color-select';

const components = [GuxColorSelect, GuxInputColorOption];
const language = 'en';

describe('gux-color-select', () => {
  it('should build', async () => {
    const html = `<gux-color-select><input slot="input" type="color" value="#75A8FF"></gux-color-select>`;
    const page = await newSpecPage({ components, html, language });
    const component = page.rootInstance;

    expect(component).toBeInstanceOf(GuxColorSelect);
  });
});
