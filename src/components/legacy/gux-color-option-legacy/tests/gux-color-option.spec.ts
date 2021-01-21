import { newSpecPage } from '@stencil/core/testing';
import { GuxColorOptionBeta } from '../gux-color-option';

describe('gux-color-option-legacy', () => {
  let component: GuxColorOptionBeta;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxColorOptionBeta],
      html: `<gux-color-option-legacy></gux-color-option-legacy>`,
      language: 'en'
    });

    component = page.rootInstance;
  });

  it('should build', async () => {
    expect(component).toBeInstanceOf(GuxColorOptionBeta);
  });
});
