import { newSpecPage } from '@stencil/core/testing';
import MutationObserver from 'mutation-observer';

import { GuxInputCheckbox } from '../../gux-form-field/components/gux-input-checkbox/gux-input-checkbox';
import { GuxInputColor } from '../../gux-form-field/components/gux-input-color/gux-input-color';
import { GuxInputRadio } from '../../gux-form-field/components/gux-input-radio/gux-input-radio';
import { GuxInputRange } from '../../gux-form-field/components/gux-input-range/gux-input-range';
import { GuxInputTextLike } from '../../gux-form-field/components/gux-input-text-like/gux-input-text-like';

import { GuxFormField } from '../gux-form-field';

const components = [
  GuxFormField,
  GuxInputCheckbox,
  GuxInputColor,
  GuxInputRadio,
  GuxInputRange,
  GuxInputTextLike
];
const language = 'en';

describe('gux-form-field', () => {
  beforeEach(async () => {
    global.MutationObserver = MutationObserver;
  });

  it('should build', async () => {
    const html = `
      <gux-form-field>
        <input slot="input" type="unknown">
        <label slot="label">Text</label>
      </gux-form-field>
    `;
    const page = await newSpecPage({ components, html, language });

    expect(page.rootInstance).toBeInstanceOf(GuxFormField);
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
            <gux-form-field>
              <input
                slot="input"
                type="${type}"
                id="test"
                value="test"
              />
              <label slot="label" for="test">Test</label>
            </gux-form-field>
          `;
          const page = await newSpecPage({ components, html, language });

          expect(page.root).toMatchSnapshot();
        });
      });
    });

    describe('seect tag', () => {
      it(`should render component type "select"`, async () => {
        const html = `
          <gux-form-field>
            <select slot="input" name="select" type="select">
              <option value="option1">Option 1</option>
              <option value="option1">Option 2</option>
              <option value="option1">Option 3</option>
            </select>
            <label slot="label">Select</label>
          </gux-form-field>
        `;
        const page = await newSpecPage({ components, html, language });

        expect(page.root).toMatchSnapshot();
      });
    });
  });
});
