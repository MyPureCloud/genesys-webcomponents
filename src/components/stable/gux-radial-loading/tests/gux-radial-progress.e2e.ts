import { newE2EPage } from '@stencil/core/testing';

describe('gux-radial-loading', () => {
  [
    '<gux-radial-loading></gux-radial-loading>',
    '<gux-radial-loading context="modal"></gux-radial-loading>',
    '<gux-radial-loading context="input"></gux-radial-loading>',
    '<gux-radial-loading context="full-page"></gux-radial-loading>'
  ].forEach((content, index) => {
    it(`should display component as expected (${index + 1})`, async () => {
      const page = await newE2EPage();

      await page.setContent(content);

      const element = await page.find('gux-radial-loading');

      expect(element.innerHTML).toMatchSnapshot();
    });
  });
});
