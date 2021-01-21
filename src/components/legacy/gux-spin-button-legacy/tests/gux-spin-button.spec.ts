import { newSpecPage } from '@stencil/core/testing';
import { GuxSpinButtonLegacy } from '../gux-spin-button';

describe('gux-spin-button-legacy', () => {
  let component: GuxSpinButtonLegacy;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxSpinButtonLegacy],
      html: `<gux-spin-button-legacy></gux-spin-button-legacy>`,
      language: 'en'
    });

    component = page.rootInstance;

    component.min = 15;
    component.max = 60;
    component.step = 15;
  });

  it('should build', async () => {
    expect(component).toBeInstanceOf(GuxSpinButtonLegacy);
  });

  describe('Class Logic', () => {
    it('incrementing should change value by step', () => {
      component.value = 30;
      component.incrementValue(true);
      expect(component.value).toEqual(45);
    });

    it('incrementing should change value by step', () => {
      component.value = 30;
      component.incrementValue(false);
      expect(component.value).toEqual(15);
    });

    it('incrementing should not go above max value', () => {
      component.value = 60;
      component.incrementValue(true);
      expect(component.value).toEqual(60);
    });

    it('incrementing values not in step should not go above max value', () => {
      component.value = 55;
      component.incrementValue(true);
      expect(component.value).toEqual(60);
    });

    it('decrementing should change value by step', () => {
      component.value = 30;
      component.incrementValue(false);
      expect(component.value).toEqual(15);
    });

    it('decrementing should not go below min value', () => {
      component.value = 15;
      component.incrementValue(false);
      expect(component.value).toEqual(15);
    });

    it('decrementing values not in step should not go below min value', () => {
      component.value = 17;
      component.incrementValue(false);
      expect(component.value).toEqual(15);
    });

    it('setting a value too low and incrementing goes to min', () => {
      component.value = 0;
      component.incrementValue(true);
      expect(component.value).toEqual(15);
    });

    it('setting a value too low and decrementing goes to min', () => {
      component.value = 0;
      component.incrementValue(false);
      expect(component.value).toEqual(15);
    });

    it('setting a value too high and incrementing goes to max', () => {
      component.value = 90;
      component.incrementValue(true);
      expect(component.value).toEqual(60);
    });

    it('setting a value too high and decrementing goes to max', () => {
      component.value = 90;
      component.incrementValue(false);
      expect(component.value).toEqual(60);
    });

    it('validate fails if value is NaN', async () => {
      component.value = NaN;
      const valid = await component.validate();
      expect(valid).toBeFalsy();
    });

    it('validate fails if value is greater than max', async () => {
      component.value = 90;
      const valid = await component.validate();
      expect(valid).toBeFalsy();
    });

    it('validate fails if value is less than min', async () => {
      component.value = 5;
      const valid = await component.validate();
      expect(valid).toBeFalsy();
    });

    it('validate fails if value is not valid increment of step', async () => {
      component.value = 25;
      const valid = await component.validate();
      expect(valid).toBeFalsy();
    });

    it('validate passes for happy path', () => {
      component.value = 30;
      const valid = component.validate();
      expect(valid).toBeTruthy();
    });

    it('validate does not set error message if ignoreValidation set', async () => {
      component.value = NaN;
      component.ignoreValidation = true;
      const valid = await component.validate();
      expect(valid).toBeFalsy();
      expect(component.errorMessage).toBeFalsy();
    });
  });
});
