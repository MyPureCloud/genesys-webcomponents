import { newE2EPage } from '@stencil/core/testing';

describe('gux-input-radio', () => {
  it('renders', async () => {
    const html = `
      <gux-input-radio>
        <input type="range" slot="input"/>
      </gux-input-radio>
    `;
    const page = await newE2EPage({ html });
<<<<<<< HEAD:src/components/stable/gux-form-field/components/gux-input-range/tests/gux-input-range.e2e.ts
    const element = await page.find('gux-input-radio');
=======
    const element = await page.find('gux-input-radio-beta');
>>>>>>> 0ba4b54... test(beta-components): improved tests in some beta components:src/components/beta/form/gux-form-field/components/gux-input-range-beta/tests/gux-input-range-beta.e2e.ts

    expect(element).toHaveClass('hydrated');
  });
});
