import { newSpecPage } from '@stencil/core/testing';
import { GuxAllRowSelect } from '../gux-all-row-select';

const components = [GuxAllRowSelect];
const language = 'en';

describe('gux-all-row-select', () => {
  it('should build', async () => {
    const html = '<gux-all-row-select></gux-all-row-select>';
    const page = await newSpecPage({ components, html, language });

    expect(page.rootInstance).toBeInstanceOf(GuxAllRowSelect);
  });
});
