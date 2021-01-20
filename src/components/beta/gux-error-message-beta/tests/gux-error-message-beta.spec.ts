import { newSpecPage } from '@stencil/core/testing';
import { GuxErrorMessageBeta } from '../gux-error-message-beta';

const components = [GuxErrorMessageBeta];
const language = 'en';

describe('gux-error-message-beta', () => {
  it('should build', async () => {
    const html = `<gux-error-message-beta>This is an error message</gux-error-message-beta>`;
    const page = await newSpecPage({ components, html, language });
    const component = page.rootInstance;

    expect(component).toBeInstanceOf(GuxErrorMessageBeta);
  });

  describe('#render', () => {
    it(`should render component as expected`, async () => {
      const html = `<gux-error-message-beta>This is an error message</gux-error-message-beta>`;
      const page = await newSpecPage({ components, html, language });

      expect(page.root).toMatchSnapshot();
    });
  });
});
