import { newSpecPage } from '@stencil/core/testing';
import { GuxTable } from '../gux-table';
import MutationObserver from 'mutation-observer';

const components = [GuxTable];
const language = 'en';

describe('gux-table-beta', () => {
  beforeEach(async () => {
    global.MutationObserver = MutationObserver;
  });
  it('should build', async () => {
    const html = `
      <gux-table-beta>
        <table slot="data">
          <thead>
            <tr>
              <th>First name</th>
              <th>Last name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John</td>
              <td>Doe</td>
            </tr>
          </tbody>
        </table>
      </gux-table-beta>
    `;
    const page = await newSpecPage({ components, html, language });

    expect(page.rootInstance).toBeInstanceOf(GuxTable);
  });
});
