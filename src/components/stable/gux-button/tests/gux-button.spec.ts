import { newSpecPage } from '@stencil/core/testing';
import { GuxButton } from '../../gux-button/gux-button';

const components = [GuxButton];
const language = 'en';

describe('gux-modal', () => {
  describe('#render', () => {
    [
      {
        description: 'should render default button',
        html: '<gux-button title="default">Button</gux-button>'
      },
      {
        description: 'should render primary button',
        html: '<gux-button title="Primary" accent="primary">Button</gux-button>'
      },
      {
        description: 'should render secondary button',
        html:
          '<gux-button title="Secondary" accent="secondary">Button</gux-button>'
      },
      {
        description: 'should render tertiary button',
        html:
          '<gux-button title="Tertiary" accent="tertiary">Button</gux-button>'
      },
      {
        description: 'should render invalid accent button',
        html:
          '<gux-button title="Invalid accent" accent="invalid">Invalid accent</gux-button>'
      },
      {
        description: 'should render disabled default button',
        html: '<gux-button title="default" disabled>Button</gux-button>'
      },
      {
        description: 'should render disabled primary button',
        html:
          '<gux-button title="Primary" accent="primary" disabled>Button</gux-button>'
      },
      {
        description: 'should render disabled secondary button',
        html:
          '<gux-button title="Secondary" accent="secondary" disabled>Button</gux-button>'
      },
      {
        description: 'should render disabled tertiary button',
        html:
          '<gux-button title="Tertiary" accent="tertiary" disabled>Button</gux-button>'
      },
      {
        description: 'should render disabled invalid accent button',
        html:
          '<gux-button title="Invalid accent" accent="invalid" disabled>Invalid accent</gux-button>'
      }
    ].forEach(({ description, html }) => {
      it(description, async () => {
        const page = await newSpecPage({ components, html, language });

        expect(page.rootInstance).toBeInstanceOf(GuxButton);
        expect(page.root).toMatchSnapshot();
      });
    });
  });

  describe('click', () => {
    it('should fire a click event when an enabled button is clicked', async () => {
      const html = '<gux-button title="default">Button</gux-button>';
      const page = await newSpecPage({ components, html, language });
      const element = page.root as HTMLElement;
      const button = page.root.querySelector('button') as HTMLButtonElement;
      const clickSpy = jest.fn();

      element.addEventListener('click', clickSpy);

      button.click();
      await page.waitForChanges();

      expect(clickSpy).toHaveBeenCalled();
    });

    it('should fire a click event when an enabled button slot content is clicked', async () => {
      const html = '<gux-button title="default"><span>Span</span></gux-button>';
      const page = await newSpecPage({ components, html, language });
      const element = page.root as HTMLElement;
      const span = page.root.querySelector('span') as HTMLButtonElement;
      const clickSpy = jest.fn();

      element.addEventListener('click', clickSpy);

      span.click();
      await page.waitForChanges();

      expect(clickSpy).toHaveBeenCalled();
    });

    it('should not fire a click event when a disabled button slot content is clicked', async () => {
      const html =
        '<gux-button title="default" disabled><span>Span</span></gux-button>';
      const page = await newSpecPage({ components, html, language });
      const element = page.root as HTMLElement;
      const span = page.root.querySelector('span') as HTMLButtonElement;
      const clickSpy = jest.fn();

      element.addEventListener('click', clickSpy);

      span.click();
      await page.waitForChanges();

      expect(clickSpy).not.toHaveBeenCalled();
    });
  });
});
