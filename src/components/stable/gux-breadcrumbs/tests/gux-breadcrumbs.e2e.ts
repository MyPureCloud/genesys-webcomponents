import { newE2EPage } from '@stencil/core/testing';

describe('gux-breadcrumbs', () => {
  [
    `<gux-breadcrumbs lang="en"></gux-breadcrumbs>`,
    `
      <gux-breadcrumbs lang="en">
        <gux-breadcrumb-item>Category</gux-breadcrumb-item>
        <gux-breadcrumb-item href="#">Parent</gux-breadcrumb-item>
        <gux-breadcrumb-item>Current</gux-breadcrumb-item>
      </gux-breadcrumbs>
    `,
    `
      <gux-breadcrumbs lang="en">
        <gux-breadcrumb-item>Category</gux-breadcrumb-item>
        <gux-breadcrumb-item href="#">Parent</gux-breadcrumb-item>
        <gux-breadcrumb-item href="#">Current</gux-breadcrumb-item>
      </gux-breadcrumbs>
    `,
    `
      <gux-breadcrumbs lang="en" accent="primary">
        <gux-breadcrumb-item>Category</gux-breadcrumb-item>
        <gux-breadcrumb-item href="#">Parent</gux-breadcrumb-item>
        <gux-breadcrumb-item>Current</gux-breadcrumb-item>
      </gux-breadcrumbs>
    `,
    `
      <gux-breadcrumbs lang="en" accent="secondary">
        <gux-breadcrumb-item>Category</gux-breadcrumb-item>
        <gux-breadcrumb-item href="#">Parent</gux-breadcrumb-item>
        <gux-breadcrumb-item>Current</gux-breadcrumb-item>
      </gux-breadcrumbs>
    `,
    `
      <gux-breadcrumbs lang="en" accent="invalid">
        <gux-breadcrumb-item>Category</gux-breadcrumb-item>
        <gux-breadcrumb-item href="#">Parent</gux-breadcrumb-item>
        <gux-breadcrumb-item>Current</gux-breadcrumb-item>
      </gux-breadcrumbs>
    `
  ].forEach((content, index) => {
    it(`should display component as expected (${index + 1})`, async () => {
      const page = await newE2EPage();

      await page.setContent(content);

      const element = await page.find('gux-breadcrumbs');

      expect(element.outerHTML).toMatchSnapshot();
    });
  });
});
