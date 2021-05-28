import { newE2EPage, E2EPage } from '@stencil/core/testing';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function newDeterministicE2EPage({
  html
}: {
  html: string;
}): Promise<E2EPage> {
  const page = await newE2EPage();

  await page.evaluateOnNewDocument(() => {
    Math.random = () => 0.5;
  });
  await page.setContent(html);
  await page.waitForChanges();

  return page;
}

describe('gux-tooltip', () => {
  describe('#render', () => {
    [
      `
        <div lang="en">
          <div>Element</div>
          <gux-tooltip>Tooltip</gux-tooltip>
        </div>
      `,
      `
        <div lang="en">
          <div id="element">Element</div>
          <gux-tooltip for="element">Tooltip</gux-tooltip>
        </div>
      `
    ].forEach((html, index) => {
      it(`should render component as expected (${index + 1})`, async () => {
        const page = await newDeterministicE2EPage({ html });
        const element = await page.find('div[lang]');

        expect(element.innerHTML).toMatchSnapshot();
      });
    });
  });
});
