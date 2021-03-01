import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop,
  State,
  Watch
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';

import { GuxDisclosureButtonPosition } from './gux-disclosure-button.types';

@Component({
  styleUrl: 'gux-disclosure-button.less',
  tag: 'gux-disclosure-button'
})
export class GuxDisclosureButton {
  @Element()
  private root: HTMLElement;

  /**
   * Indicates the position of the button panel
   */
  @Prop()
  position: GuxDisclosureButtonPosition = 'left';

  /**
   * Indicates the label for the disclosure button
   */
  @Prop()
  label: string = 'open';

  /**
   * Used to open or close the disclosure panel
   */
  @Prop({ mutable: true })
  isOpen: boolean = false;

  /**
   * Indicated image used by button
   */
  @State()
  icon: string = 'ic-expand-right';

  /**
   * Return the state of the components panel on state change
   * @return the panel state
   */
  @Event()
  active: EventEmitter;

  @Watch('isOpen')
  watchIsOpen() {
    this.updateIcon();
  }

  changeState() {
    this.togglePanel();
    this.active.emit(this.isOpen);
  }

  togglePanel() {
    this.isOpen = !this.isOpen;
  }

  updateIcon() {
    if (this.position === 'right') {
      this.icon = this.isOpen ? 'ic-expand-right' : 'ic-expand-left';
    } else {
      this.icon = this.isOpen ? 'ic-expand-left' : 'ic-expand-right';
    }
  }

  componentWillLoad() {
    trackComponent(this.root, { variant: this.position });
    this.updateIcon();
  }

  render() {
    const activeClass = this.isOpen ? 'gux-active' : '';
    return (
      <div class={`gux-disclosure-button-container gux-${this.position}`}>
        <button
          class="gux-disclosure-button"
          onClick={() => this.changeState()}
        >
          <gux-icon
            icon-name={`${this.icon}`}
            screenreader-text={this.label}
          ></gux-icon>
        </button>
        <div class={`gux-disclosure-panel gux-${this.position} ${activeClass}`}>
          <slot name="panel-content" />
        </div>
      </div>
    );
  }
}
