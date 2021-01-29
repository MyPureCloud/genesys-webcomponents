import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop,
  State,
  writeTask
} from '@stencil/core';

import { eventIsFrom } from '../../../../utils/dom/event-is-from';

@Component({
  styleUrl: 'gux-tab.less',
  tag: 'gux-tab'
})
export class GuxTab {
  /**
   * unique id for the tab
   */
  @Prop() tabId: string;

  /**
   * indicates whether or not the tab is selected
   */
  @Prop() active: boolean = false;

  /**
   * indicates the gux-icon to display on the left side of the tab (similar to a favicon in the browser)
   */
  @Prop() tabIconName: string;

  @State() private popoverHidden: boolean = true;
  @State() private hasAnimated: boolean = false;

  @Element()
  private root: HTMLElement;

  @Event()
  private internaltabselected: EventEmitter<void>;

  private get hasDropdownOptions() {
    return !!this.root.querySelector('[slot="dropdown-options"]');
  }

  toggleOptions() {
    this.popoverHidden = !this.popoverHidden;
  }

  onSelectDropdownOption(e: MouseEvent) {
    this.popoverHidden = true;
    e.stopPropagation();
  }

  selectTab(e: MouseEvent) {
    if (eventIsFrom('.tab-dropdown-container', e)) {
      return;
    }

    this.popoverHidden = true;
    this.internaltabselected.emit();
  }

  componentDidLoad() {
    if (!this.hasAnimated) {
      writeTask(() => {
        this.root.querySelector('.gux-tab').classList.add('show');
        this.hasAnimated = true;
      });
    }
  }

  render() {
    return (
      <button
        class={`gux-tab ${this.active ? 'selected' : ''}`}
        onClick={e => this.selectTab(e)}
        role="button"
      >
        {this.tabIconName ? (
          <div class="tab-icon-container">
            <gux-icon iconName={this.tabIconName} decorative={true}></gux-icon>
          </div>
        ) : null}
        <span class="tab-title">
          <slot name="title" />
        </span>
        {this.hasDropdownOptions && (
          <button
            id={this.tabId}
            class="tab-dropdown-container"
            onClick={() => this.toggleOptions()}
          >
            <gux-icon iconName="ellipsis-v" decorative={true}></gux-icon>
          </button>
        )}

        {this.hasDropdownOptions && (
          <gux-popover
            position="top-start"
            for={this.tabId}
            displayDismissButton={false}
            hidden={this.popoverHidden}
            closeOnClickOutside={true}
            onGuxdismiss={() => (this.popoverHidden = true)}
          >
            <div onClick={(e: MouseEvent) => this.onSelectDropdownOption(e)}>
              <slot name="dropdown-options" />
            </div>
          </gux-popover>
        )}
      </button>
    );
  }
}
