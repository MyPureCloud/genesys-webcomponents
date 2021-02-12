import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('gux-tab-dropdown-option', () => {
  let page: E2EPage;
  let element: E2EElement;

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it('renders', async () => {
    await page.setContent(`
    <gux-tab-dropdown-option></gux-tab-dropdown-option>
    `);
    element = await page.find('gux-tab-dropdown-option');
    expect(element).toHaveClass('hydrated');
  });
});
