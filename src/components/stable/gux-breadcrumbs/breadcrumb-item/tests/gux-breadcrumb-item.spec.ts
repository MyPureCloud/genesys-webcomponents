import { newSpecPage } from '@stencil/core/testing';
import { GuxBreadcrumbItem } from '../gux-breadcrumb-item';

describe('gux-breadcrumb-item', () => {
  let component: GuxBreadcrumbItem;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxBreadcrumbItem],
      html: `<gux-breadcrumb-item></gux-breadcrumb-item>`,
      language: 'en'
    });

    component = page.rootInstance;
  });

  it('should build', async () => {
    expect(component).toBeInstanceOf(GuxBreadcrumbItem);
  });
});
