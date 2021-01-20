import { newE2EPage } from '@stencil/core/testing';

describe('gux-input-radio', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <gux-input-radio>
        <input slot="input" type="radio" id="dinner-pizza" name="dinner" value="pizza">
        <label slot="label" for="dinner-pizza">Pizza</label>
      </gux-input-radio>
    `);
    const element = await page.find('gux-input-radio');

    expect(element).toHaveClass('hydrated');
  });

  it('switches between states when clicking different radios', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div>
        <gux-input-radio>
          <input slot="input" type="radio" id="dinner-pizza" name="dinner" value="pizza">
          <label slot="label" for="dinner-pizza">Pizza</label>
        </gux-input-radio>

        <gux-input-radio>
          <input slot="input" type="radio" id="dinner-pasta" name="dinner" value="pasta">
          <label slot="label" for="dinner-pasta">Pasta</label>
        </gux-input-radio>
      </div>
    `);
    const pizzaInput = await page.find('#dinner-pizza');
    const pastaInput = await page.find('#dinner-pasta');

    expect(await pizzaInput.getProperty('checked')).toEqual(false);
    expect(await pastaInput.getProperty('checked')).toEqual(false);

    await pizzaInput.click();
    await page.waitForChanges();

    expect(await pizzaInput.getProperty('checked')).toEqual(true);
    expect(await pastaInput.getProperty('checked')).toEqual(false);

    await pastaInput.click();
    await page.waitForChanges();

    expect(await pizzaInput.getProperty('checked')).toEqual(false);
    expect(await pastaInput.getProperty('checked')).toEqual(true);
  });

  it('should render the assigned label', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <gux-input-radio>
        <input slot="input" type="radio" id="dinner-pizza" name="dinner" value="pizza">
        <label slot="label" for="dinner-pizza">Pizza</label>
      </gux-input-radio>
    `);
    const component = await page.find('gux-input-radio');
    const label = await component.find('label');

    expect(label.textContent).toContain('Pizza');
  });
});
