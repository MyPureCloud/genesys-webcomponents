import { newSpecPage } from '@stencil/core/testing';
import { GuxRadialLoading } from '../gux-radial-loading';

describe('gux-radial-loading', () => {
  let component: GuxRadialLoading;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxRadialLoading],
      html: `<gux-radial-loading></gux-radial-loading>`,
      language: 'en'
    });

    component = page.rootInstance;
  });

  it('should build', async () => {
    expect(component).toBeInstanceOf(GuxRadialLoading);
  });

  describe('#render', () => {
    [
      '<gux-radial-loading></gux-radial-loading>',
      '<gux-radial-loading context="modal"></gux-radial-loading>',
      '<gux-radial-loading context="full-page"></gux-radial-loading>',
      '<gux-radial-loading context="input"></gux-radial-loading>'
    ].forEach((input, index) => {
      it(`should render component as expected (${index + 1})`, async () => {
        const page = await newSpecPage({
          components: [GuxRadialLoading],
          html: input,
          language: 'en'
        });

        expect(page.root).toMatchSnapshot();
      });
    });
  });
});
