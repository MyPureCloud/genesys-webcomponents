import {
  Component,
  h,
  Event,
  EventEmitter,
  JSX,
  Listen,
  Prop
} from '@stencil/core';

@Component({
  tag: 'gux-row-select'
})
export class GuxRowSelect {
  @Prop()
  selected = false;

  @Event()
  internalrowselectchange: EventEmitter;

  @Listen('check')
  onCheck(event: CustomEvent): void {
    event.stopPropagation();

    this.selected = event.detail;
    this.internalrowselectchange.emit();
  }

  render(): JSX.Element {
    return <gux-checkbox-legacy checked={this.selected}></gux-checkbox-legacy>;
  }
}
