import { newE2EPage } from '@stencil/core/testing';

describe('gux-input-text-like', () => {
  it('renders', async () => {
    const html = `<gux-input-text-like><input slot="input" type="test"></gux-input-text-like>`;
    const page = await newE2EPage({ html });
    const element = await page.find('gux-input-text-like');

    expect(element).toHaveClass('hydrated');
  });
});
