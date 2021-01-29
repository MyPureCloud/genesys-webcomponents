import { newSpecPage } from '@stencil/core/testing';
import { GuxTabDropdownOption } from '../gux-tab-dropdown-option';

describe('gux-tab-dropdown-option', () => {
  let component: GuxTabDropdownOption;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxTabDropdownOption],
      html: `<gux-tab-dropdown-option></gux-tab-dropdown-option>`,
      language: 'en'
    });

    component = page.rootInstance;
  });

  describe('Class Logic', () => {
    it('should pass', () => {
      expect(true).toBeTruthy();
    });
  });
});
