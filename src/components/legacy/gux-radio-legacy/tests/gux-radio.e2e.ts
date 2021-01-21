import { newE2EPage } from '@stencil/core/testing';

describe('gux-radio-legacy', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<gux-radio-legacy></gux-radio-legacy>');
    const element = await page.find('gux-radio-legacy');
    expect(element).toHaveClass('hydrated');
  });

  it('switches between states when clicking different radios', async () => {
    const page = await newE2EPage();

    await page.setContent('<gux-radio-legacy>test label</gux-radio-legacy>');

    const radio = await page.find('gux-radio-legacy');
    const input = await radio.find('input');

    expect(await radio.getProperty('checked')).toEqual(false);

    await input.click();
    await page.waitForChanges();
    expect(await radio.getProperty('checked')).toEqual(true);
  });

  it('should render the assigned label', async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<gux-radio-legacy>my label is so cool</gux-radio-legacy>'
    );
    const component = await page.find('gux-radio-legacy');
    const label = await component.find('label');

    expect(label.textContent).toContain('my label is so cool');
  });
});
