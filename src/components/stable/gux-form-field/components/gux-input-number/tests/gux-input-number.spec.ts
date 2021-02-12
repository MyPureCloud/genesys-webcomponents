import { newSpecPage } from '@stencil/core/testing';
import { GuxInputNumber } from '../gux-input-number';

const components = [GuxInputNumber];
const language = 'en';

describe('gux-input-number', () => {
  it('should build', async () => {
    const html = `<gux-input-number><input slot="input" type="number"></gux-input-number>`;
    const page = await newSpecPage({ components, html, language });
    const component = page.rootInstance;

    expect(component).toBeInstanceOf(GuxInputNumber);
  });
});
