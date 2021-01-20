import { newSpecPage } from '@stencil/core/testing';
import { GuxInputTextLike } from '../gux-input-text-like';

const components = [GuxInputTextLike];
const language = 'en';

describe('gux-input-text-like', () => {
  it('should build', async () => {
    const html = `<gux-input-text-like><input slot="input" type="test"></gux-input-text-like>`;
    const page = await newSpecPage({ components, html, language });
    const component = page.rootInstance;

    expect(component).toBeInstanceOf(GuxInputTextLike);
  });
});
