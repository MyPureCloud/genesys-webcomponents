import { newSpecPage } from '@stencil/core/testing';
import { GuxTextLabel } from '../gux-text-label';

describe('gux-text-label', () => {
  let component: GuxTextLabel;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxTextLabel],
      html: `
        <gux-text-label label="test">
          <gux-input-text-like>
            <input slot="input" type="text">
          </gux-input-text-like>
        </gux-text-label>
      `,
      language: 'en'
    });

    component = page.rootInstance;
  });

  it('should build', async () => {
    expect(component).toBeInstanceOf(GuxTextLabel);
  });
});
