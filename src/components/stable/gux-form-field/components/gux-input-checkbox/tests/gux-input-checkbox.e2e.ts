import { newE2EPage } from '@stencil/core/testing';

describe('gux-input-checkbox', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <gux-input-checkbox>
        <input slot="input" type="checkbox" id="pizza" name="food" value="pizza">
        <label slot="label" for="pizza">Pizza</label>
      </gux-input-checkbox>
    `);
    const element = await page.find('gux-input-checkbox');

    expect(element).toHaveClass('hydrated');
  });

  it('switches between states when clicked', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <gux-input-checkbox>
        <input slot="input" type="checkbox" id="pizza" name="food" value="pizza">
        <label slot="label" for="pizza">Pizza</label>
      </gux-input-checkbox>
    `);
    const component = await page.find('gux-input-checkbox');
    const label = await component.find('label');

    await label.click();
    await page.waitForChanges();
    expect(label.className).toContain('gux-checked');

    await label.click();
    await page.waitForChanges();
    expect(label.className).toContain('gux-unchecked');

    await label.click();
    await page.waitForChanges();
    expect(label.className).toContain('gux-checked');
  });

  it('should render the assigned label', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <gux-input-checkbox>
        <input slot="input" type="checkbox" id="pizza" name="food" value="pizza">
        <label slot="label" for="pizza">Pizza</label>
      </gux-input-checkbox>
    `);
    const component = await page.find('gux-input-checkbox');
    const label = await component.find('label');

    expect(label.textContent).toContain('Pizza');
  });
});
