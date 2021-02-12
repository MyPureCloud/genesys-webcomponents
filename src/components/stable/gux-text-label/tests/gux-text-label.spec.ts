import { newSpecPage } from '@stencil/core/testing';
import { GuxTextLabel } from '../gux-text-label';

describe('gux-text-label', () => {
  let component: GuxTextLabel;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxTextLabel],
      html: `
        <gux-text-label label="test">
          <gux-text-field-legacy></gux-text-field-legacy>
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
