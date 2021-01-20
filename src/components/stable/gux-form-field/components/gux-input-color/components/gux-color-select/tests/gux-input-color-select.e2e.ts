import { newE2EPage } from '@stencil/core/testing';

describe('gux-input-color-select', () => {
  it('renders', async () => {
    const html =
      '<gux-input-color-select><input slot="input" type="color" value="#75A8FF"></gux-input-color-select>';
    const page = await newE2EPage({ html });
    const element = await page.find('gux-input-color-select');

    expect(element).toHaveClass('hydrated');
  });
});
