import { newSpecPage } from '@stencil/core/testing';
import MutationObserver from 'mutation-observer';
import { GuxContentSearch } from '../gux-content-search';

const components = [GuxContentSearch];
const language = 'en';

describe('gux-content-search', () => {
  beforeEach(async () => {
    (global as any).MutationObserver = MutationObserver;
  });

  describe('#render', () => {
    [
      {
        description: 'should render default control no props',
        html: '<gux-content-search><input type="text"/></gux-content-search>'
      },
      {
        description: 'should render default control no props With placeholder',
        html:
          '<gux-content-search><input type="text" placeholder="Search"/></gux-content-search>'
      },
      {
        description: 'should render default control with all props',
        html: `<gux-content-search current-match="1"match-count="10">
          <input type="text" placeholder="Search" value="Default Search Text"/>
        </gux-content-search>`
      },
      {
        description:
          'should render default control with all props with no match',
        html: `<gux-content-search current-match="0" match-count="0">
          <input type="text" placeholder="Search" value="Default Search Text"/>
        </gux-content-search>`
      },
      {
        description:
          'should render default control with all props with long text no match',
        html: `<gux-content-search current-match="0" match-count="0">
          <input type="text" placeholder="Search" value="Lorem ipsum dolor sit amet, lacinia blandit ultricies lorem aliquam, dui quam a viverra vivamus pellentesque, rhoncus aliquet proin eleifend."/>
         </gux-content-search>`
      },
      {
        description:
          'should render default control with all props with long text 1 match',
        html: `<gux-content-search current-match="1" match-count="1">
          <input type="text" placeholder="Search" value="Lorem ipsum dolor sit amet, lacinia blandit ultricies lorem aliquam, dui quam a viverra vivamus pellentesque, rhoncus aliquet proin eleifend."/>
        </gux-content-search>`
      },
      {
        description:
          'should render default control with all props with short text 100000 match',
        html: `<gux-content-search current-match="1000" match-count="100000">
          <input type="text" placeholder="Search" value="Lorem ipsum dolor "/>
        </gux-content-search>`
      },
      {
        description:
          'should render default control with all props with long text 100000 match',
        html: `<gux-content-search current-match="1000" match-count="100000">
          <input type="text" placeholder="Search" value="Lorem ipsum dolor sit amet, lacinia blandit ultricies lorem aliquam, dui quam a viverra vivamus pellentesque, rhoncus aliquet proin eleifend."/>
        </gux-content-search>`
      },
      {
        description:
          'should render default control with all props with invalid  match count',
        html: `<gux-content-search current-match="1000" match-count="abc">
          <input type="text" placeholder="Search" value="Lorem ipsum dolor sit amet, lacinia blandit ultricies lorem aliquam, dui quam a viverra vivamus pellentesque, rhoncus aliquet proin eleifend."/>
        </gux-content-search>`
      },
      {
        description:
          'should render default control with all props with invalid current match',
        html: `<gux-content-search current-match="100000" match-count="100">
          <input type="text" placeholder="Search" value="Lorem ipsum dolor sit amet, lacinia blandit ultricies lorem aliquam, dui quam a viverra vivamus pellentesque, rhoncus aliquet proin eleifend."/>
        </gux-content-search>`
      },
      {
        description:
          'should render default control with all props in disable mode',
        html: `<gux-content-search current-match="10" match-count="10">
          <input type="text" disabled="true" placeholder="Search" value="Search Disabled"/>
        </gux-content-search>`
      },
      {
        description:
          'should render default control with all props in disable mode with no match',
        html: `<gux-content-search current-match="0" match-count="0">
          <input type="text" disabled="true" placeholder="Search" value="Search Disabled with no Match"/>
        </gux-content-search>`
      },
      {
        description:
          'should render default control with all props in disable mode with 1 match',
        html: `<gux-content-search current-match="1" match-count="1">
          <input type="text" disabled="true" placeholder="Search" value="Search Disabled with 1 match"/>
        </gux-content-search>`
      },
      {
        description:
          'should render default control with all props in disable mode with 100000000 match',
        html: `<gux-content-search current-match="10000" match-count="100000000">
          <input type="text" disabled="true" placeholder="Search" value="Search Disabled with big match"/>
        </gux-content-search>`
      },
      {
        description:
          'should render default control with all props in disable mode with long value',
        html: `<gux-content-search current-match="1" match-count="1">
          <input type="text" disabled="true" placeholder="Search" value="Lorem ipsum dolor sit amet, lacinia blandit ultricies lorem aliquam, dui quam a viverra vivamus pellentesque, rhoncus aliquet proin eleifend."/>
        </gux-content-search>`
      },
      {
        description:
          'should render default control with all props in disable mode with long value with 100000000 match',
        html: `<gux-content-search current-match="1100" match-count="100000001">
          <input type="text" disabled="true" placeholder="Search" value="Lorem ipsum dolor sit amet, lacinia blandit ultricies lorem aliquam, dui quam a viverra vivamus pellentesque, rhoncus aliquet proin eleifend."/>
        </gux-content-search>`
      }
    ].forEach(({ description, html }) => {
      it(description, async () => {
        const page = await newSpecPage({ components, html, language });
        const component = page.rootInstance;
        expect(component).toBeInstanceOf(GuxContentSearch);
        expect(page.root).toMatchSnapshot();
      });
    });
  });

  describe('Class Logic', () => {
    let component: GuxContentSearch;

    beforeEach(async () => {
      const page = await newSpecPage({
        components: [GuxContentSearch],
        html: `<gux-content-search current-match="1" match-count="10"><input type="text" placeholder="Search" value="Default Search Text"/></gux-content-search>`,
        language: 'en'
      });
      component = page.rootInstance;
    });

    it('builds', async () => {
      await component.componentWillLoad();
      component.render();
      expect(component).toBeTruthy();
    });

    it('componentWillLoad with invalid match value', async () => {
      component.matchCount = -1;
      await component.componentWillLoad();
      component.render();
      expect(component.matchCount).toBe(-1);
    });

    it('componentWillLoad with invalid currentMatch', async () => {
      component.currentMatch = -1;
      component.matchCount = 1;
      await component.componentWillLoad();
      component.render();
      expect(component.matchCount).toBe(1);
      expect(component.currentMatch).toBe(-1);
    });

    it('componentWillLoad with invalid currentMatch & matchCount', async () => {
      component.currentMatch = -1;
      component.matchCount = -1;
      await component.componentWillLoad();
      component.render();
      expect(component.matchCount).toBe(-1);
      expect(component.currentMatch).toBe(-1);
    });

    it('componentWillLoad with currentMatch greater than matchCount', async () => {
      component.currentMatch = 11;
      component.matchCount = 10;
      await component.componentWillLoad();
      component.render();
      expect(component.matchCount).toBe(10);
      expect(component.currentMatch).toBe(11);
    });

    it('componentDidLoad with currentMatch when matchCount is 0', async () => {
      component.currentMatch = 11;
      component.matchCount = 0;
      await component.componentWillLoad();
      component.render();
      expect(component.matchCount).toBe(0);
      expect(component.currentMatch).toBe(11);
    });

    describe('methods', () => {
      it('clear', async () => {
        const InputEventSpy = jest.fn();
        global.InputEvent = InputEventSpy;
        const guxCurrentMatchChangedSpy = jest.fn();
        component.guxcurrentmatchchanged = {
          emit: guxCurrentMatchChangedSpy
        };
        component.matchCount = 100;
        component.currentMatch = 3;
        await component.clear();
        expect(component.matchCount).toEqual(0);
        expect(component.currentMatch).toEqual(0);
        expect(component.guxcurrentmatchchanged.emit).toHaveBeenCalledWith(0);
        expect(InputEventSpy).toHaveBeenCalledTimes(2);
      });

      it('clear when disable is true', async () => {
        const page = await newSpecPage({
          components: [GuxContentSearch],
          html: `<gux-content-search current-match="1" match-count="10"><input disabled="true" type="text" placeholder="Search" value="Default Search Text"/></gux-content-search>`,
          language: 'en'
        });
        component = page.rootInstance;
        const guxCurrentMatchChangedSpy = jest.fn();
        component.guxcurrentmatchchanged = {
          emit: guxCurrentMatchChangedSpy
        };
        component.matchCount = 100;
        component.currentMatch = 3;
        await component.clear();
        expect(component.matchCount).not.toEqual(0);
        expect(component.currentMatch).not.toEqual(0);
        expect(component.guxcurrentmatchchanged.emit).not.toHaveBeenCalledWith(
          0
        );
      });
    });
  });
});
