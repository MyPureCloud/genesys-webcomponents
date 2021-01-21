import { newE2EPage } from '@stencil/core/testing';

describe('wem-annotations', () => {
  let page;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`
      <gux-spin-button-legacy
        lang="en"
        min="15"
        max="60"
        step="15"
        value="30">
      </<gux-spin-button-legacy>`);
    await page.content();
    await page.waitForChanges();
  });

  it('renders', async () => {
    const element = await page.find('gux-spin-button-legacy');
    expect(element).toHaveClass('hydrated');
  });
  it('should disable the decrement button', async () => {
    const decrementButton = await page.find('#gux-spin-button-decrement');
    await decrementButton.click(); // Down to 15
    await page.waitForChanges();

    expect(decrementButton).toHaveAttribute('disabled');
  });
  it('should disable the increment button', async () => {
    const incrementButton = await page.find('#gux-spin-button-increment');
    await incrementButton.click(); // Up to 45
    await page.waitForChanges();

    await incrementButton.click(); // Up to 60
    await page.waitForChanges();

    expect(incrementButton).toHaveAttribute('disabled');
  });
  it('should display an error message if present', async () => {
    expect(await page.find('.gux-error')).toBeFalsy();

    const component = await page.find('gux-spin-button-legacy');
    await component.setProperty('errorMessage', 'something went wrong');
    await page.waitForChanges();

    expect(await page.find('.gux-error')).toBeTruthy();
  });
  it('should not display an error message if ignoreValidation', async () => {
    expect(await page.find('.gux-error')).toBeFalsy();

    const component = await page.find('gux-spin-button-legacy');
    await component.setProperty('ignoreValidation', true);
    await component.setProperty('value', 90);
    const isValid = await component.callMethod('validate');
    await page.waitForChanges();

    expect(isValid).toBeFalsy();
    expect(await page.find('.gux-error')).toBeFalsy();
  });
  it('should allow manual input', async () => {
    const component = await page.find('gux-spin-button-legacy');
    expect(await component.getProperty('value')).toBe(30);

    const input = await page.find('gux-text-field-legacy input');
    await input.press('Backspace');
    await input.press('Backspace');
    await input.press('6');
    await input.press('0');
    await page.waitForChanges();

    expect(await component.getProperty('value')).toBe(60);
  });
  it('should clear validation when corrected', async () => {
    const component = await page.find('gux-spin-button-legacy');
    await component.setProperty('value', 90);
    await page.waitForChanges();

    expect(await component.getProperty('value')).toBe(90);
    expect(await page.find('.gux-error')).toBeTruthy();

    await component.setProperty('value', 60);
    await page.waitForChanges();

    expect(await component.getProperty('value')).toBe(60);
    expect(await page.find('.gux-error')).toBeFalsy();
  });
  it('should increment when up arrow is pressed', async () => {
    const component = await page.find('gux-spin-button-legacy');
    expect(await component.getProperty('value')).toBe(30);

    const input = await page.find('gux-text-field-legacy input');
    await input.press('ArrowUp');
    await page.waitForChanges();

    expect(await component.getProperty('value')).toBe(45);
  });
  it('should increment when down arrow is pressed', async () => {
    const component = await page.find('gux-spin-button-legacy');
    expect(await component.getProperty('value')).toBe(30);

    const input = await page.find('gux-text-field-legacy input');
    await input.press('ArrowDown');
    await page.waitForChanges();

    expect(await component.getProperty('value')).toBe(15);
  });
  it('entering NaN should show validation', async () => {
    const component = await page.find('gux-spin-button-legacy');
    await component.setProperty('value', 'randomString');
    await page.waitForChanges();
    expect(await page.find('.gux-error')).toBeTruthy();
    const isValid = await component.callMethod('validate');
    await page.waitForChanges();
    expect(isValid).toBeFalsy();
  });
});
