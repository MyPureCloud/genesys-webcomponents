import { GuxColorSelectBeta } from '../gux-color-select';

describe('gux-color-select-legacy', () => {
  it('builds', () => {
    expect(new GuxColorSelectBeta()).toBeTruthy();
  });

  describe('render tiles', () => {
    it('returns the number tiles from default tiles', () => {
      const component = new GuxColorSelectBeta();
      expect(component.renderDefaultTiles().length).toEqual(10);
    });

    it('returns number of tiles for custom and blank', () => {
      const component = new GuxColorSelectBeta();
      expect(component.renderDefaultTiles().length).toEqual(10);
      expect(component.renderBlankTiles().length).toEqual(0);
    });
  });
});
