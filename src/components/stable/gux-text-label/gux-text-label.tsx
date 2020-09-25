import { Component, Element, h, Prop } from '@stencil/core';

let nextLabelId = 1;
@Component({
  styleUrl: 'gux-text-label.less',
  tag: 'gux-text-label'
})
export class GuxTextLabel {
  @Element()
  root: HTMLGuxTextLabelElement;
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
    if (
      typeof labeledComponentSlot.componentOnReady !== 'function' ||
      typeof labeledComponentSlot.setLabelledBy !== 'function'
    ) {
      // Only set labeled by if its supported by the contained element.
      return;
    }

    labeledComponentSlot.componentOnReady().then(() => {
      labeledComponentSlot.setLabelledBy(this.id);
    });
  }

  render() {
    return (
      <div class={'gux-text-label-container ' + this.position}>
        <label class="label" id={this.id}>
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
