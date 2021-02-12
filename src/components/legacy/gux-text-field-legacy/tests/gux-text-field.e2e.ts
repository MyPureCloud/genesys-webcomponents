import { newE2EPage } from '@stencil/core/testing';

describe('gux-text-field-legacy', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<gux-text-field-legacy lang="en"></gux-text-field-legacy>'
    );
    const element = await page.find('gux-text-field-legacy');
    const clearButton = await element.find('gux-text-field-legacy button');
    expect(clearButton).toBe(null);
    expect(element).toHaveClass('hydrated');
  });
  describe('clear button', () => {
    it('should appear when the value is not empty', async () => {
      const page = await newE2EPage();

      await page.setContent(
        '<gux-text-field-legacy lang="en"></gux-text-field-legacy>'
      );
      let element = await page.find('gux-text-field-legacy');
      let clearButton = await element.find('gux-text-field-legacy button');
      const input = await element.find('gux-text-field-legacy input');
      expect(clearButton).toBeNull();
      expect(element).toHaveClass('hydrated');
      await input.press('KeyT');
      await input.press('KeyE');
      await input.press('KeyS');
      await input.press('KeyT');
      await page.waitForChanges();
      clearButton = await element.find('gux-text-field-legacy button');
      element = await page.find('gux-text-field-legacy');
      expect(clearButton).not.toBeNull();
      let value = await input.getProperty('value');
      expect(value).toBe('test');
      clearButton.click();
      await page.waitForChanges();
      value = await input.getProperty('value');
      expect(value).toBe('');
    });
  });
});
