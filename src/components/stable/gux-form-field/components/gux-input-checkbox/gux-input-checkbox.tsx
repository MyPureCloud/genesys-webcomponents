import { Component, Element, h, JSX } from '@stencil/core';

/**
 * @slot input - Required slot for input[type="checkbox"]
 * @slot label - Required slot for label
 */
@Component({
  styleUrl: 'gux-input-checkbox.less',
  tag: 'gux-input-checkbox'
})
export class GuxInputCheckbox {
  private input: HTMLInputElement;
  private label: HTMLLabelElement;

  @Element()
  private root: HTMLElement;

  componentWillLoad() {
    this.input = this.root.querySelector('input[slot="input"]');
    this.label = this.root.querySelector('label[slot="label"]');

    this.setLabelClassForCheckedState();

    this.input.addEventListener('click', (): void => {
      this.setLabelClassForCheckedState();
    });
  }

  render(): JSX.Element {
    return (
      <div class="gux-input-checkbox-container">
        <slot name="input" />
        <slot name="label" />
      </div>
    );
  }

  private setLabelClassForCheckedState(): void {
    this.label.classList.remove('gux-checked', 'gux-unchecked');
    this.label.classList.add(
      this.input.checked ? 'gux-checked' : 'gux-unchecked'
    );
  }
}
