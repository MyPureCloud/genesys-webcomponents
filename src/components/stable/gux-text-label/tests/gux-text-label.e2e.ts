import { newE2EPage } from '@stencil/core/testing';

describe('gux-text-label', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <gux-text-label lang="en" label="Test Item">
        <gux-text-field-legacy></gux-text-field-legacy>
      </gux-text-label>
    `);
    await page.waitForChanges();

    const element = await page.find('gux-text-label');
    expect(element).toHaveClass('hydrated');
  });

  it('uses the correct label when simple label value provided', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <gux-text-label lang="en" label="Test Item">
        <gux-text-field-legacy></gux-text-field-legacy>
      </gux-text-label>
    `);
    await page.waitForChanges();

    const element = await page.find('gux-text-label label');
    expect(element).toEqualText('Test Item');
  });

  it('uses the correct label when slotted label provided', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <gux-text-label lang="en">
        <div slot="label">Test Item</div>
        <gux-text-field-legacy></gux-text-field-legacy>
      </gux-text-label>
    `);
    await page.waitForChanges();

    const element = await page.find('gux-text-label label');
    expect(element).toEqualText('Test Item');
  });

  it('provides an aria-labelledby on its content', async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<gux-text-label lang="en" label="Test Item"><gux-text-field-legacy></gux-text-field-legacy></gux-text-label>'
    );
    await page.waitForChanges();

    const textLabel = await page.find('gux-text-label label');
    const labelId = textLabel.id;

    const textField = await page.find(
      'gux-text-label gux-text-field-legacy input'
    );
    const label = textField.getAttribute('aria-labelledby');
    expect(label).toEqual(labelId);
  });
});
