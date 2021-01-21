import { newSpecPage } from '@stencil/core/testing';
import { GuxRadioGroupLegacy } from '../gux-radio-group';

describe('gux-radio-group-legacy', () => {
  let component: GuxRadioGroupLegacy;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxRadioGroupLegacy],
      html: `<gux-radio-group-legacy></gux-radio-group-legacy>`,
      language: 'en'
    });

    component = page.rootInstance;
  });

  it('should build', async () => {
    expect(component).toBeInstanceOf(GuxRadioGroupLegacy);
  });
});
