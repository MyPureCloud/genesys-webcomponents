import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('gux-tab', () => {
  let page: E2EPage;
  let element: E2EElement;

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it('renders', async () => {
    await page.setContent(`
    <gux-tab></gux-tab>
    `);
    element = await page.find('gux-tab');
    expect(element).toHaveClass('hydrated');
  });
});
