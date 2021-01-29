import { newSpecPage } from '@stencil/core/testing';

import { GuxBreadcrumbs } from '../gux-breadcrumbs';
import { GuxBreadcrumbItem } from '../breadcrumb-item/gux-breadcrumb-item';

const components = [GuxBreadcrumbs, GuxBreadcrumbItem];
const language = 'en';

describe('gux-breadcrumbs', () => {
  let component: GuxBreadcrumbs;

  beforeEach(async () => {
    const page = await newSpecPage({
      components,
      html: `<gux-breadcrumbs></gux-breadcrumbs>`,
      language
    });

    component = page.rootInstance;
  });

  it('should build', async () => {
    expect(component).toBeInstanceOf(GuxBreadcrumbs);
  });

  describe('#render', () => {
    [
      `<gux-breadcrumbs></gux-breadcrumbs>`,
      `
        <gux-breadcrumbs>
          <gux-breadcrumb-item>Category</gux-breadcrumb-item>
          <gux-breadcrumb-item href="#">Parent</gux-breadcrumb-item>
          <gux-breadcrumb-item>Current</gux-breadcrumb-item>
        </gux-breadcrumbs>
      `,
      `
        <gux-breadcrumbs>
          <gux-breadcrumb-item>Category</gux-breadcrumb-item>
          <gux-breadcrumb-item href="#">Parent</gux-breadcrumb-item>
          <gux-breadcrumb-item href="#">Current</gux-breadcrumb-item>
        </gux-breadcrumbs>
      `,
      `
        <gux-breadcrumbs accent="primary">
          <gux-breadcrumb-item>Category</gux-breadcrumb-item>
          <gux-breadcrumb-item href="#">Parent</gux-breadcrumb-item>
          <gux-breadcrumb-item>Current</gux-breadcrumb-item>
        </gux-breadcrumbs>
      `,
      `
        <gux-breadcrumbs accent="secondary">
          <gux-breadcrumb-item>Category</gux-breadcrumb-item>
          <gux-breadcrumb-item href="#">Parent</gux-breadcrumb-item>
          <gux-breadcrumb-item>Current</gux-breadcrumb-item>
        </gux-breadcrumbs>
      `,
      `
        <gux-breadcrumbs accent="invalid">
          <gux-breadcrumb-item>Category</gux-breadcrumb-item>
          <gux-breadcrumb-item href="#">Parent</gux-breadcrumb-item>
          <gux-breadcrumb-item>Current</gux-breadcrumb-item>
        </gux-breadcrumbs>
      `
    ].forEach((html, index) => {
      it(`should render component as expected (${index + 1})`, async () => {
        const page = await newSpecPage({ components, html, language });

        expect(page.root).toMatchSnapshot();
      });
    });
  });
});
