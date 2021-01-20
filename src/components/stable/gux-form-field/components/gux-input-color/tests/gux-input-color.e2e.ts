import { newE2EPage } from '@stencil/core/testing';

describe('gux-input-color', () => {
  it('renders', async () => {
    const html =
      '<gux-input-color><input slot="input" type="color" value="#75A8FF"></gux-input-color>';
    const page = await newE2EPage({ html });
    const element = await page.find('gux-input-color');

    expect(element).toHaveClass('hydrated');
  });
});
