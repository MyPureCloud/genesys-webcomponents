jest.mock('../../../../utils/dom/random-html-id', () => ({
  randomHTMLId: () => 'random'
}));

import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { GuxRating } from '../gux-rating';

global.InputEvent = Event;

const components = [GuxRating];
const language = 'en';

describe('gux-rating', () => {
  it('should build', async () => {
    const html = `<gux-rating></gux-rating>`;
    const page = await newSpecPage({ components, html, language });

    expect(page.rootInstance).toBeInstanceOf(GuxRating);
  });

  describe('#render', () => {
    [
      '<gux-rating></gux-rating>',
      '<gux-rating value="0"></gux-rating>',
      '<gux-rating value="0.5"></gux-rating>',
      '<gux-rating value="1"></gux-rating>',
      '<gux-rating value="1.5"></gux-rating>',
      '<gux-rating value="2"></gux-rating>',
      '<gux-rating value="2.5"></gux-rating>',
      '<gux-rating value="3"></gux-rating>',
      '<gux-rating value="3.5"></gux-rating>',
      '<gux-rating value="4"></gux-rating>',
      '<gux-rating value="4.5"></gux-rating>',
      '<gux-rating value="5"></gux-rating>',
      '<gux-rating value="0" max-value=10></gux-rating>',
      '<gux-rating value="5" max-value=10></gux-rating>',
      '<gux-rating value="10" max-value=10></gux-rating>',
      '<gux-rating value="3" disabled></gux-rating>',
      '<gux-rating value="3" readonly></gux-rating>'
    ].forEach((html, index) => {
      it(`should render component as expected (${index + 1})`, async () => {
        const page = await newSpecPage({ components, html, language });

        expect(page.root).toMatchSnapshot();
      });
    });
  });

  describe('#interactions', () => {
    async function clickStar(page: SpecPage, position: number): Promise<void> {
      const ratingStarElements = page.doc.getElementsByTagName('gux-icon');
      const ratingElement = ratingStarElements[position - 1] as HTMLElement;

      ratingElement.click();

      await page.waitForChanges();
    }

    function getStarCounts(
      document
    ): { emptyStars: number; halfStars: number; fullStars: number } {
      return {
        emptyStars: document.getElementsByClassName('gux-rating-star-empty')
          .length,
        halfStars: document.getElementsByClassName('gux-rating-star-half')
          .length,
        fullStars: document.getElementsByClassName('gux-rating-star-full')
          .length
      };
    }

    describe('ratings', () => {
      let page: SpecPage;

      beforeEach(async () => {
        page = await newSpecPage({
          components,
          html: '<gux-rating></gux-rating>'
        });
      });

      it(`should render five empty stars if nothing is clicked`, async () => {
        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 5,
          fullStars: 0,
          halfStars: 0
        });
      });

      it(`should render 0.5 if the first one is clicked`, async () => {
        await clickStar(page, 1);

        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 4,
          fullStars: 0,
          halfStars: 1
        });
      });

      it(`should render 1.0 if the first one is clicked twice`, async () => {
        await clickStar(page, 1);
        await clickStar(page, 1);

        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 4,
          fullStars: 1,
          halfStars: 0
        });
      });

      it(`should render 0.0 if the first one is clicked three times`, async () => {
        await clickStar(page, 1);
        await clickStar(page, 1);
        await clickStar(page, 1);

        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 5,
          fullStars: 0,
          halfStars: 0
        });
      });

      it(`should render 1.5 if the second one is clicked`, async () => {
        await clickStar(page, 2);

        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 3,
          fullStars: 1,
          halfStars: 1
        });
      });

      it(`should render 2.0 if the second one is clicked twice`, async () => {
        await clickStar(page, 2);
        await clickStar(page, 2);

        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 3,
          fullStars: 2,
          halfStars: 0
        });
      });

      it(`should render 0.0 if the second one is clicked three times`, async () => {
        await clickStar(page, 2);
        await clickStar(page, 2);
        await clickStar(page, 2);

        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 5,
          fullStars: 0,
          halfStars: 0
        });
      });

      it(`should render 2.5 if the third one is clicked`, async () => {
        await clickStar(page, 3);

        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 2,
          fullStars: 2,
          halfStars: 1
        });
      });

      it(`should render 3.0 if the third one is clicked twice`, async () => {
        await clickStar(page, 3);
        await clickStar(page, 3);

        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 2,
          fullStars: 3,
          halfStars: 0
        });
      });

      it(`should render 0.0 if the third one is clicked three times`, async () => {
        await clickStar(page, 3);
        await clickStar(page, 3);
        await clickStar(page, 3);

        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 5,
          fullStars: 0,
          halfStars: 0
        });
      });

      it(`should render 3.5 if the third one is clicked`, async () => {
        await clickStar(page, 4);

        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 1,
          fullStars: 3,
          halfStars: 1
        });
      });

      it(`should render 4.0 if the third one is clicked twice`, async () => {
        await clickStar(page, 4);
        await clickStar(page, 4);

        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 1,
          fullStars: 4,
          halfStars: 0
        });
      });

      it(`should render 0.0 if the third one is clicked three times`, async () => {
        await clickStar(page, 4);
        await clickStar(page, 4);
        await clickStar(page, 4);

        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 5,
          fullStars: 0,
          halfStars: 0
        });
      });

      it(`should render 4.5 if the third one is clicked`, async () => {
        await clickStar(page, 5);

        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 0,
          fullStars: 4,
          halfStars: 1
        });
      });

      it(`should render 5.0 if the third one is clicked twice`, async () => {
        await clickStar(page, 5);
        await clickStar(page, 5);

        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 0,
          fullStars: 5,
          halfStars: 0
        });
      });

      it(`should render 0.0 if the third one is clicked three times`, async () => {
        await clickStar(page, 5);
        await clickStar(page, 5);
        await clickStar(page, 5);

        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 5,
          fullStars: 0,
          halfStars: 0
        });
      });
    });

    describe('disabled', () => {
      let page: SpecPage;

      beforeEach(async () => {
        page = await newSpecPage({
          components,
          html: '<gux-rating value="3" disabled></gux-rating>'
        });
      });

      it(`should render three full stars if nothing is clicked`, async () => {
        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 2,
          fullStars: 3,
          halfStars: 0
        });
      });

      it(`should render three full stars if anything is clicked`, async () => {
        await clickStar(page, 1);
        await clickStar(page, 2);
        await clickStar(page, 3);
        await clickStar(page, 4);
        await clickStar(page, 5);

        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 2,
          fullStars: 3,
          halfStars: 0
        });
      });
    });

    describe('readonly', () => {
      let page: SpecPage;

      beforeEach(async () => {
        page = await newSpecPage({
          components,
          html: '<gux-rating value="3" readonly></gux-rating>'
        });
      });

      it(`should render three full stars if nothing is clicked`, async () => {
        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 2,
          fullStars: 3,
          halfStars: 0
        });
      });

      it(`should render three full stars if anything is clicked`, async () => {
        await clickStar(page, 1);
        await clickStar(page, 2);
        await clickStar(page, 3);
        await clickStar(page, 4);
        await clickStar(page, 5);

        expect(getStarCounts(page.doc)).toEqual({
          emptyStars: 2,
          fullStars: 3,
          halfStars: 0
        });
      });
    });
  });
});
