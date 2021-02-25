import { newE2EPage } from '@stencil/core/testing';

describe('gux-toggle', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<gux-toggle></gux-toggle>');
    const element = await page.find('gux-toggle');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes if checked prop change', async () => {
    const page = await newE2EPage();

    await page.setContent('<gux-toggle></gux-toggle>');
    const component = await page.find('gux-toggle');
    const element = await page.find('gux-toggle > div');
    const input = await page.find('gux-toggle input');
    expect(element.className).toEqual('gux-switch-container');
    expect(input.getAttribute('type')).toEqual(`checkbox`);
    let inputCheckedProperty = await input.getProperty('checked');
    expect(inputCheckedProperty).toBeFalsy();
    component.setProperty('checked', true);
    await page.waitForChanges();
    expect(element.className).toEqual('gux-switch-container gux-checked');
    inputCheckedProperty = await input.getProperty('checked');
    expect(inputCheckedProperty).toEqual(true);
  });
});
