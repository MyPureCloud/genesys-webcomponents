import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { GuxInputCheckbox } from '../gux-input-checkbox';

describe('gux-input-checkbox', () => {
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [GuxInputCheckbox],
      html: `
        <gux-input-checkbox>
          <input slot="input" type="checkbox" id="pizza" name="food" value="pizza">
          <label slot="label" for="pizza">Pizza</label>
        </gux-input-checkbox>
      `,
      language: 'en'
    });
  });

  it('should build', async () => {
    expect(page.rootInstance).toBeInstanceOf(GuxInputCheckbox);
  });

  it('should render', async () => {
    expect(page.root).toMatchSnapshot();
  });
});
