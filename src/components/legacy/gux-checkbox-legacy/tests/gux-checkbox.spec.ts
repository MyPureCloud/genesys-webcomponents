import { newSpecPage } from '@stencil/core/testing';
import { GuxCheckboxLegacy } from '../gux-checkbox';

describe('gux-checkbox-legacy', () => {
  let component: GuxCheckboxLegacy;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxCheckboxLegacy],
      html: `<gux-checkbox-legacy></gux-checkbox-legacy>`,
      language: 'en'
    });

    component = page.rootInstance;
  });

  it('should build', async () => {
    expect(component).toBeInstanceOf(GuxCheckboxLegacy);
  });
});
