import { newE2EPage } from '@stencil/core/testing';

describe('gux-color-option-legacy', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<gux-color-option-legacy></gux-color-option-legacy>'
    );
    const element = await page.find('gux-color-option-legacy');
    expect(element).toHaveClass('hydrated');
  });

  it('should be active', async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<gux-color-option-legacy active></gux-color-option-legacy>'
    );
    const component = await page.find('gux-color-option-legacy');
    expect(await page.find('.gux-color-option-active')).toBeTruthy();

    component.setProperty('active', false);
    await page.waitForChanges();
    expect(await page.find('.gux-color-option-active')).toBeFalsy();
  });
});
