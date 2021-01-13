import { newE2EPage } from '@stencil/core/testing';

describe('gux-input-radio-beta', () => {
  it('renders', async () => {
    const html = `
      <gux-input-radio-beta>
        <input type="range" slot="input"/>
      </gux-input-radio-beta>
    `;
    const page = await newE2EPage({ html });
    const element = await page.find('gux-input-radio-beta');

    expect(element).toHaveClass('hydrated');
  });
});
