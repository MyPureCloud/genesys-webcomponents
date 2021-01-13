import { newE2EPage } from '@stencil/core/testing';

describe('gux-error-message-beta', () => {
  it('renders', async () => {
    const html = `<gux-error-message-beta>This is an error message</gux-error-message-beta>`;
    const page = await newE2EPage({ html });
    const element = await page.find('gux-error-message-beta');

    expect(element.innerHTML).toMatchSnapshot();
  });
});
