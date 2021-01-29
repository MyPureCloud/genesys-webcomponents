import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('gux-tabs', () => {
  it('renders', async () => {
    const html = `
      <gux-tabs id="interactive">
        <gux-tab tab-id="1" tab-icon-name="ic-locked">
          <span slot="title"> Hello World </span>
          <span slot="dropdown-options">
            <gux-tab-dropdown-option
              option-id="1"
              icon-name="ic-pencil"
              onclick="notify(event)"
            >
              Edit
            </gux-tab-dropdown-option>
            <gux-tab-dropdown-option
              option-id="2"
              icon-name="ic-clone"
              onclick="notify(event)"
            >
              Clone
            </gux-tab-dropdown-option>
            <gux-tab-dropdown-option
              option-id="3"
              icon-name="ic-share"
              onclick="notify(event)"
            >
              Share
            </gux-tab-dropdown-option>
            <gux-tab-dropdown-option
              option-id="4"
              icon-name="ic-download"
              onclick="notify(event)"
            >
              Download
            </gux-tab-dropdown-option>
          </span>
        </gux-tab>

        <gux-tab tab-id="2" tab-icon-name="ic-locked">
          <span slot="title"> Hello World 2 </span>
        </gux-tab>
      </gux-tabs>
    `;
    const page = await newE2EPage({ html });
    const element = await page.find('gux-tabs');

    expect(element.innerHTML).toMatchSnapshot();
  });
});
