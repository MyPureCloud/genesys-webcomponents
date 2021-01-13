import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { GuxInputCheckboxBeta } from '../gux-input-checkbox-beta';

describe('gux-input-checkbox-beta', () => {
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [GuxInputCheckboxBeta],
      html: `
        <gux-input-checkbox-beta>
          <input slot="input" type="checkbox" id="pizza" name="food" value="pizza">
          <label slot="label" for="pizza">Pizza</label>
        </gux-input-checkbox-beta>
      `,
      language: 'en'
    });
  });

  it('should build', async () => {
    expect(page.rootInstance).toBeInstanceOf(GuxInputCheckboxBeta);
  });

  it('should render', async () => {
    expect(page.root).toMatchSnapshot();
  });
});
