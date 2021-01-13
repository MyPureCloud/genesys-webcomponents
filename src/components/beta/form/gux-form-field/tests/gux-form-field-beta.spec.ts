import { newSpecPage } from '@stencil/core/testing';
import MutationObserver from 'mutation-observer';

import { GuxInputCheckboxBeta } from '../../gux-form-field/components/gux-input-checkbox-beta/gux-input-checkbox-beta';
import { GuxInputColorBeta } from '../../gux-form-field/components/gux-input-color-beta/gux-input-color-beta';
import { GuxInputRadioBeta } from '../../gux-form-field/components/gux-input-radio-beta/gux-input-radio-beta';
import { GuxInputRangeBeta } from '../../gux-form-field/components/gux-input-range-beta/gux-input-range-beta';
import { GuxInputTextLikeBeta } from '../../gux-form-field/components/gux-input-text-like-beta/gux-input-text-like-beta';

import { GuxFormFieldBeta } from '../gux-form-field-beta';

const components = [
  GuxFormFieldBeta,
  GuxInputCheckboxBeta,
  GuxInputColorBeta,
  GuxInputRadioBeta,
  GuxInputRangeBeta,
  GuxInputTextLikeBeta
];
const language = 'en';

describe('gux-form-field-beta', () => {
  beforeEach(async () => {
    global.MutationObserver = MutationObserver;
  });

  it('should build', async () => {
    const html = `
      <gux-form-field-beta>
        <input slot="input" type="unknown">
        <label slot="label">Text</label>
      </gux-form-field-beta>
    `;
    const page = await newSpecPage({ components, html, language });

    expect(page.rootInstance).toBeInstanceOf(GuxFormFieldBeta);
  });

  describe('#render', () => {
    describe('input tag', () => {
      [
        'checkbox',
        'color',
        'email',
        'number',
        'password',
        'radio',
        'range',
        'search',
        'text',
        'unknown'
      ].forEach(type => {
        it(`should render component type "${type}"`, async () => {
          const html = `
            <gux-form-field-beta>
              <input
                slot="input"
                type="${type}"
                id="test"
                value="test"
              />
              <label slot="label" for="test">Test</label>
            </gux-form-field-beta>
          `;
          const page = await newSpecPage({ components, html, language });

          expect(page.root).toMatchSnapshot();
        });
      });
    });

    describe('seect tag', () => {
      it(`should render component type "select"`, async () => {
        const html = `
          <gux-form-field-beta>
            <select slot="input" name="select" type="select">
              <option value="option1">Option 1</option>
              <option value="option1">Option 2</option>
              <option value="option1">Option 3</option>
            </select>
            <label slot="label">Select</label>
          </gux-form-field-beta>
        `;
        const page = await newSpecPage({ components, html, language });

        expect(page.root).toMatchSnapshot();
      });
    });
  });
});
