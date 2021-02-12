import { newE2EPage } from '@stencil/core/testing';

describe('gux-color-select', () => {
  it('renders', async () => {
    const html =
      '<gux-color-select><input slot="input" type="color" value="#75A8FF"></gux-color-select>';
    const page = await newE2EPage({ html });
    const element = await page.find('gux-color-select');

    expect(element).toHaveClass('hydrated');
  });
});
