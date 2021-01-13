import { newSpecPage } from '@stencil/core/testing';
import { GuxInputRadioBeta } from '../gux-input-radio-beta';

describe('gux-input-radio-beta', () => {
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [GuxInputRadioBeta],
      html: `
      <gux-input-radio-beta>
        <input slot="input" type="radio" id="dinner-sandwich" name="dinner" value="sandwich" disabled>
      </gux-input-radio-beta>
      `,
      language: 'en'
    });
  });

  it('should build', async () => {
    expect(page.rootInstance).toBeInstanceOf(GuxInputRadioBeta);
  });

  it('should render', async () => {
    expect(page.root).toMatchSnapshot();
  });
});
