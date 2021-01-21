import { newSpecPage } from '@stencil/core/testing';
import { GuxColorPickerBeta } from '../gux-color-picker';

describe('gux-color-picker-legacy', () => {
  let component: GuxColorPickerBeta;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxColorPickerBeta],
      html: `<gux-color-picker-legacy></gux-color-picker-legacy>`,
      language: 'en'
    });

    component = page.rootInstance;
  });

  it('should build', async () => {
    expect(component).toBeInstanceOf(GuxColorPickerBeta);
  });
});
