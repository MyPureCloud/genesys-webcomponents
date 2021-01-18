import { newE2EPage } from '@stencil/core/testing';

describe('gux-input-radio', () => {
  it('renders', async () => {
    const html = `
      <gux-input-radio>
        <input type="range" slot="input"/>
      </gux-input-radio>
    `;
    const page = await newE2EPage({ html });
    const element = await page.find('gux-input-radio');

    expect(element).toHaveClass('hydrated');
  });
});
