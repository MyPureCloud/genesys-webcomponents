import { newSpecPage } from '@stencil/core/testing';
import { GuxRadioLegacy } from '../gux-radio';

describe('gux-radio-legacy', () => {
  let component: GuxRadioLegacy;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxRadioLegacy],
      html: `<gux-radio-legacy></gux-radio-legacy>`,
      language: 'en'
    });

    component = page.rootInstance;
  });

  it('should build', async () => {
    expect(component).toBeInstanceOf(GuxRadioLegacy);
  });
});
