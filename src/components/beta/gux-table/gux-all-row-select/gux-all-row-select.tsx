import {
  Component,
  h,
  Element,
  Event,
  EventEmitter,
  JSX,
  Listen,
  Prop
} from '@stencil/core';

import { buildI18nForComponent, GetI18nValue } from '../../../../i18n';
import { randomHTMLId } from '../../../../utils/dom/random-html-id';
import tableResources from '../i18n/en.json';

@Component({
  tag: 'gux-all-row-select'
})
export class GuxAllRowSelect {
  @Element()
  root: HTMLElement;

  private id: string = randomHTMLId('gux-all-row-select');
  private i18n: GetI18nValue;

  @Prop({ mutable: true })
  selected = false;

  @Event()
  internalallrowselectchange: EventEmitter;

  @Listen('input')
  onCheck(event: CustomEvent): void {
    event.stopPropagation();

    const input = event.target as HTMLInputElement;

    this.selected = input.checked;
    this.internalallrowselectchange.emit();
  }

  async componentWillLoad(): Promise<void> {
    this.i18n = await buildI18nForComponent(this.root, tableResources);
  }

  render(): JSX.Element {
    return (
      <gux-form-field>
        <input
          slot="input"
          id={this.id}
          type="checkbox"
          checked={this.selected}
        />
        <label slot="label" htmlFor={this.id}>
          &#8203;
          <span class="gux-sr-only">{this.i18n('selectAllTableRows')}</span>
        </label>
      </gux-form-field>
    );
  }
}
