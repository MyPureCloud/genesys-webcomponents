import { Component, h, Prop } from '@stencil/core';

@Component({
  styleUrl: 'gux-tab-dropdown-option.less',
  tag: 'gux-tab-dropdown-option'
})
export class GuxTabDropdownOption {
  /**
   * unique id for the option
   */
  @Prop() optionId: string;

  /**
   * name of the gux-icon to display for the option
   */
  @Prop() iconName: string;

  render() {
    return (
      <button class="tab-dropdown-option">
        <gux-icon iconName={this.iconName} decorative={true}></gux-icon>
        <span>
          <slot />
        </span>
      </button>
    );
  }
}
