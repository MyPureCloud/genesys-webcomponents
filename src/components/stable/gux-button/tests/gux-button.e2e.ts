import { newE2EPage } from '@stencil/core/testing';

describe('gux-button', () => {
  describe('#render', () => {
    [
      {
        clickable: true,
        description: 'should render default button',
        html: '<gux-button title="default">Button</gux-button>'
      },
      {
        clickable: true,
        description: 'should render primary button',
        html: '<gux-button title="Primary" accent="primary">Button</gux-button>'
      },
      {
        clickable: true,
        description: 'should render secondary button',
        html:
          '<gux-button title="Secondary" accent="secondary">Button</gux-button>'
      },
      {
        clickable: true,
        description: 'should render tertiary button',
        html:
          '<gux-button title="Tertiary" accent="tertiary">Button</gux-button>'
      },
      {
        clickable: true,
        description: 'should render invalid button',
        html:
          '<gux-button title="Invalid accent" accent="invalid">Invalid accent</gux-button>'
      },
      {
        clickable: false,
        description: 'should render disabled default button',
        html: '<gux-button title="default" disabled>Button</gux-button>'
      },
      {
        clickable: false,
        description: 'should render disabled primary button',
        html:
          '<gux-button title="default" accent="primary" disabled>Button</gux-button>'
      },
      {
        clickable: false,
        description: 'should render disabled secondary button',
        html:
          '<gux-button title="default" accent="secondary" disabled>Button</gux-button>'
      },
      {
        clickable: false,
        description: 'should render disabled tertiary button',
        html:
          '<gux-button title="Tertiary" accent="tertiary" disabled>Button</gux-button>'
      },
      {
        clickable: false,
        description: 'should render disabled invalid button',
        html:
          '<gux-button title="Invalid accent" accent="invalid" disabled>Invalid accent</gux-button>'
      }
    ].forEach(({ description, html, clickable }) => {
      it(description, async () => {
        const page = await newE2EPage({ html });
        const element = await page.find('gux-button');
        const onClickSpy = await element.spyOnEvent('click');
        const expectOnclickEvents = clickable ? 1 : 0;

        expect(element.outerHTML).toMatchSnapshot();

        await element.click();
        await page.waitForChanges();

        expect(onClickSpy).toHaveReceivedEventTimes(expectOnclickEvents);
      });
    });
  });

  describe('click', () => {
    it('should fire a click event when an enabled button slot content is clicked', async () => {
      const html = '<gux-button title="default"><span>Span</span></gux-button>';
      const page = await newE2EPage({ html });
      const element = await page.find('gux-button');
      const onClickSpy = await element.spyOnEvent('click');
      const span = await page.find('span');

      span.click();
      await page.waitForChanges();

      expect(onClickSpy).toHaveReceivedEventTimes(1);
    });

    it('should not fire a click event when a disabled button slot content is clicked', async () => {
      const html =
        '<gux-button title="default" disabled><span>Span</span></gux-button>';
      const page = await newE2EPage({ html });
      const element = await page.find('gux-button');
      const onClickSpy = await element.spyOnEvent('click');
      const span = await page.find('span');

      span.click();
      await page.waitForChanges();

      expect(onClickSpy).toHaveReceivedEventTimes(0);
    });
  });
});
