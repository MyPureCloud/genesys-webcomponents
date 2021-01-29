import { newE2EPage } from '@stencil/core/testing';

describe('gux-input-number', () => {
  it('renders', async () => {
    const html = `<gux-input-number><input slot="input" type="number"></gux-input-number>`;
    const page = await newE2EPage({ html });
    const element = await page.find('gux-input-number');

    expect(element).toHaveClass('hydrated');
  });
});
