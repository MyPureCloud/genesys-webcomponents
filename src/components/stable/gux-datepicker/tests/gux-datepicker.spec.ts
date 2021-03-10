import { CalendarModes } from '../../../../common-enums';
import { GuxDatepicker } from '../gux-datepicker';

describe('gux-datepicker', () => {
  let component: GuxDatepicker;
  let componentRoot: any;

  beforeEach(async () => {
    document.getSelection = () => {
      return {
        toString() {
          return '';
        }
      } as any;
    };
    component = new GuxDatepicker();

    component.inputElement = {
      blur: jest.fn() as any,
      setSelectionRange: jest.fn() as any,
      value: ''
    } as HTMLInputElement;

    component.toInputElement = {
      blur: jest.fn() as any,
      setSelectionRange: jest.fn() as any,
      value: ''
    } as HTMLInputElement;

    component.textFieldElement = {
      querySelector() {
        return component.inputElement;
      }
    } as any;

    component.toTextFieldElement = {
      querySelector() {
        return component.toInputElement;
      }
    } as any;

    component.calendarElement = {
      focusPreviewDate: jest.fn(),
      setValue: jest.fn()
    } as any;

    component.input = {
      emit: jest.fn()
    };

    component.i18n = jest.fn();

    componentRoot = component.root;

    componentRoot.contains = () => {
      return null;
    };
  });

  it('builds', async () => {
    await component.componentWillLoad();
    component.componentDidLoad();
    component.render();
    expect(component).toBeTruthy();
  });

  // Methods
  describe('methods', () => {
    const value1str = '11/22/1970';
    const value1Iso = '1970-11-22';
    const value1date = new Date(1970, 10, 22);
    const value2str = '11/25/1970';
    const value2date = new Date(1970, 10, 25);
    const rangeIso = '1970-11-22/1970-11-25';
    // Private
    describe('private', () => {
      it('setValue', () => {
        component.inputElement.value = value1str;
        component.setValue();
        expect(component.calendarElement.setValue).toHaveBeenCalledWith(
          value1date
        );
        component.mode = CalendarModes.Range;
        component.toInputElement.value = value2str;
        component.setValue();
        expect(component.calendarElement.setValue).toHaveBeenCalledWith([
          value1date,
          value2date
        ]);
      });

      describe('onDaySelect', () => {
        it('selecting a single day', () => {
          const calendarEvent = {
            stopPropagation: jest.fn(),
            target: {
              value: value1Iso
            }
          } as any;
          component.onCalendarSelect(calendarEvent);
          expect(component.inputElement.value).toEqual(value1str);
          expect(calendarEvent.stopPropagation).toHaveBeenCalled();
        });

        it('selecting a range', () => {
          component.mode = CalendarModes.Range;
          const calendarRangeEvent = {
            stopPropagation: jest.fn(),
            target: {
              value: rangeIso
            }
          } as any;
          component.onCalendarSelect(calendarRangeEvent);
          expect(component.inputElement.value).toEqual(value1str);
          expect(component.toInputElement.value).toEqual(value2str);
          expect(calendarRangeEvent.stopPropagation).toHaveBeenCalled();
        });
      });

      it('onKeyDown', async () => {
        await component.componentWillLoad();
        component.componentDidLoad();
        spyOn(component, 'setCursorRange').and.callThrough();
        let event = {
          key: 'Enter',
          preventDefault: jest.fn()
        } as any;
        component.onKeyDown(event);
        event = {
          key: 'Enter',
          preventDefault: jest.fn(),
          target: component.inputElement
        } as any;
        component.onKeyDown(event);
        expect(component.active).toEqual(false);
        event = {
          key: 'Tab',
          preventDefault: jest.fn(),
          target: component.inputElement
        } as any;
        component.onKeyDown(event);
        expect(component.calendarElement.focusPreviewDate).toHaveBeenCalled();
        event = {
          key: 'ArrowUp',
          preventDefault: jest.fn(),
          target: component.inputElement
        } as any;
        component.onKeyDown(event);
        expect(component.setCursorRange).toHaveBeenCalledTimes(1);
        event = {
          key: 'ArrowRight',
          preventDefault: jest.fn(),
          target: component.inputElement
        } as any;
        component.onKeyDown(event);
        expect(component.setCursorRange).toHaveBeenCalledTimes(2);
        event = {
          key: 'ArrowDown',
          preventDefault: jest.fn(),
          target: component.inputElement
        } as any;
        component.onKeyDown(event);
        expect(component.setCursorRange).toHaveBeenCalledTimes(3);
        event = {
          key: 'ArrowLeft',
          preventDefault: jest.fn(),
          target: component.inputElement
        } as any;
        component.onKeyDown(event);
        expect(component.setCursorRange).toHaveBeenCalledTimes(4);
      });
    });

    it('calendarLabels', () => {
      component.mode = CalendarModes.Range;
      expect(component.getCalendarLabels().length).toEqual(2);
      expect(component.i18n).toHaveBeenCalledTimes(2);
    });
  });
});
