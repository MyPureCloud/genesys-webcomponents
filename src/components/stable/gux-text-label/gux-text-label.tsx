import { Component, h, Prop } from '@stencil/core';

let nextLabelId = 1;
@Component({
  styleUrl: 'gux-text-label.less',
  tag: 'gux-text-label'
})
export class GuxTextLabel {
  labeledComponent: HTMLDivElement;

  /**
   * The string of text to use for the label.  If the 'label' slot is
   * provided, that dom will be used instead of this property.
   */
  @Prop()
  label: string;

  /**
   * The position of the label relative to its contained element.
   */
  @Prop()
  position: 'above' | 'beside' = 'above';

  id: string;

  constructor() {
    this.id = this.generateId();
  }

  componentDidLoad() {
    const labeledComponentSlot = this.labeledComponent.querySelector(
      '*'
    ) as any;

    labeledComponentSlot.setAttribute('aria-labelledby', this.id);
  }

  render() {
    return (
      <div class={`gux-text-label-container gux-${this.position}`}>
        <label class="gux-label" id={this.id}>
          <slot name="label">{this.label}</slot>
        </label>
        <div
          class="gux-labeled-component"
          ref={el => (this.labeledComponent = el)}
        >
          <slot />
        </div>
      </div>
    );
  }

  private generateId(): string {
    return 'gux-text-label-' + nextLabelId++;
  }
}
