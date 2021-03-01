import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop
} from '@stencil/core';
import { JSXBase } from '@stencil/core/internal';

import { trackComponent } from '../../../usage-tracking';

import { KeyCode } from '../../../common-enums';

export type AllowedLayouts = 'small' | 'medium' | 'large';

export interface ISwitchItem {
  displayName: string;
  isDisabled?: boolean;
  value: string;
}

@Component({
  styleUrl: 'gux-switch.less',
  tag: 'gux-switch-legacy'
})
export class GuxSwitch {
  @Element()
  private root: HTMLElement;

  /**
   * The names and values of the switch buttons
   */
  @Prop()
  items: ISwitchItem[];

  /**
   * Used to keep track of the currently selected value
   */
  @Prop({ mutable: true })
  selectedValue: string;

  /**
   * The allowed sizes
   */
  @Prop()
  layout: AllowedLayouts = 'medium';

  /**
   * Triggers when a switch is selected.
   * @return the value of the newly selected switch
   */
  @Event()
  selectionChanged: EventEmitter;

  selectSwitchAtIndex(index: number) {
    this.selectedValue = this.items[index].value;
    this.selectionChanged.emit(this.selectedValue);
  }

  onKeyDownAtIndex(index: number, event: KeyboardEvent) {
    if (this.items[index].isDisabled) {
      event.stopPropagation();
    } else if ([KeyCode.Enter, KeyCode.Space].includes(event.keyCode)) {
      this.selectSwitchAtIndex(index);
    }
  }

  classForSwtichItemAtIndex(item: ISwitchItem): string {
    return `gux-switch ${this.layout}${
      item.value === this.selectedValue ? ' selected' : ''
    }${item.isDisabled ? ' disabled' : ''}`;
  }

  listElementForSwtichItemAtIndex(
    item: ISwitchItem,
    index: number
  ): JSXBase.LiHTMLAttributes<HTMLLIElement> {
    if (item.isDisabled) {
      return (
        <li class={this.classForSwtichItemAtIndex(item)}>
          <button class="switch-button" disabled={item.isDisabled}>
            <div class="display-text">{item.displayName}</div>
          </button>
        </li>
      );
    }
    return (
      <li class={this.classForSwtichItemAtIndex(item)}>
        <button
          class="switch-button"
          disabled={item.isDisabled}
          onKeyDown={ev => this.onKeyDownAtIndex(index, ev)}
          onClick={() => this.selectSwitchAtIndex(index)}
        >
          <div class="display-text">{item.displayName}</div>
        </button>
      </li>
    );
  }

  componentWillLoad(): void {
    trackComponent(this.root, { variant: this.layout });
  }

  render() {
    return (
      <ul class="gux-switch-group">
        {this.items &&
          this.items.map((item, index) =>
            this.listElementForSwtichItemAtIndex(item, index)
          )}
      </ul>
    );
  }
}
