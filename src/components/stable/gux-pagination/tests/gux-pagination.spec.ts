import { newSpecPage } from '@stencil/core/testing';
import { GuxPagination } from '../gux-pagination';

import { GuxButton } from '../../gux-button/gux-button';
import { GuxDropdown } from '../../gux-dropdown/gux-dropdown';
import { GuxOption } from '../../gux-dropdown/gux-option/gux-option';
import { GuxPaginationButtons } from '../gux-pagination-buttons/gux-pagination-buttons';
import { GuxPaginationItemCounts } from '../gux-pagination-item-counts/gux-pagination-item-counts';
import { GuxPaginationItemsPerPage } from '../gux-pagination-items-per-page/gux-pagination-items-per-page';
import { GuxTextFieldLegacy } from '../../../legacy/gux-text-field-legacy/gux-text-field';

const components = [
  GuxButton,
  GuxDropdown,
  GuxOption,
  GuxPagination,
  GuxPaginationButtons,
  GuxPaginationItemCounts,
  GuxPaginationItemsPerPage,
  GuxTextFieldLegacy
];
const language = 'en';

describe('gux-pagination', () => {
  describe('#render', () => {
    [
      { currentPage: 1, totalItems: 1000, itemsPerPage: 25, layout: 'full' },
      { currentPage: 1, totalItems: 1000, itemsPerPage: 50, layout: 'full' },
      { currentPage: 1, totalItems: 1000, itemsPerPage: 75, layout: 'full' },
      { currentPage: 1, totalItems: 1000, itemsPerPage: 100, layout: 'full' },
      { currentPage: 1, totalItems: 1000, itemsPerPage: 25, layout: 'full' },
      { currentPage: 10, totalItems: 1000, itemsPerPage: 25, layout: 'full' },
      { currentPage: 10, totalItems: 1000, itemsPerPage: 50, layout: 'full' },
      { currentPage: 10, totalItems: 1000, itemsPerPage: 75, layout: 'full' },
      { currentPage: 10, totalItems: 1000, itemsPerPage: 100, layout: 'full' },
      { currentPage: 1, totalItems: 1000, itemsPerPage: 25, layout: 'small' },
      { currentPage: 1, totalItems: 1000, itemsPerPage: 25, layout: 'expanded' }
    ].forEach(({ currentPage, totalItems, itemsPerPage, layout }, index) => {
      it(`should render as expected (${index + 1})`, async () => {
        const html = `
          <gux-pagination
            current-page="${currentPage}"
            total-items="${totalItems}"
            items-per-page="${itemsPerPage}"
            layout="${layout}"
          ></gux-pagination>
        `;
        const page = await newSpecPage({ components, html, language });

        expect(page.rootInstance).toBeInstanceOf(GuxPagination);

        expect(page.root).toMatchSnapshot();
      });
    });
  });
});
