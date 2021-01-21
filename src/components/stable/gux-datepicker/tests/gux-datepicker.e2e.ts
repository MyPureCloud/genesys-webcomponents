import { newE2EPage } from '@stencil/core/testing';

describe('gux-datepicker', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<gux-datepicker lang="en"></gux-datepicker>');
    const element = await page.find('gux-datepicker');
    expect(element).toHaveClass('hydrated');
  });
  it('updates the text input state when the datepicker’s value property is set', async () => {
    const page = await newE2EPage();

    await page.setContent('<gux-datepicker lang="en"></gux-datepicker>');
    const element = await page.find('gux-datepicker');

    await element.setProperty('value', '1985-12-01');
    await page.waitForChanges();

    const input = await page.find('gux-text-field-legacy input');
    const value = await input.getProperty('value');
    expect(value).toBe('12/01/1985');
  });
});
