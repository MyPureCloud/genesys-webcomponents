import { newSpecPage } from '@stencil/core/testing';
import { GuxTab } from '../gux-tab';

describe('gux-tab', () => {
  let component: GuxTab;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxTab],
      html: `<gux-tab></gux-tab>`,
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
