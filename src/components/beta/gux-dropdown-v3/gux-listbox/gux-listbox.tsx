import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  JSX,
  Listen,
  Prop,
  State
} from '@stencil/core';

import {
  clearActiveOptions,
  setInitialActiveOption,
  setFirstOptionActive,
  setNextOptionActive,
  setPreviousOptionActive,
  setLastOptionActive,
  onEnterList,
  onClickedOption,
  goToOption
} from './gux-listbox.service';

import { whenEventIsFrom } from '../../../../utils/dom/when-event-is-from';
import simulateNativeEvent from '../../../../utils/dom/simulate-native-event';
import { trackComponent } from '../../../../usage-tracking';

/**
 * @slot - collection of gux-option-v3s
 */
@Component({
  styleUrl: 'gux-listbox.less',
  tag: 'gux-listbox',
  shadow: true
})
export class GuxListbox {
  @Element()
  root: HTMLGuxListboxElement;

  @Prop({ mutable: true })
  value: string;

  @State()
  listboxOptions: HTMLGuxOptionV3Element[] = [];

  @Event()
  internallistboxoptionsupdated: EventEmitter;

  @Listen('focus')
  onFocus(): void {
    setInitialActiveOption(this.root);
  }

  @Listen('blur')
  onBlur(): void {
    clearActiveOptions(this.root);
  }

  @Listen('keydown')
  onKeydown(event: KeyboardEvent): void {
    if (event.key.length === 1) {
      goToOption(this.root, event.key);
      return;
    }

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        onEnterList(this.root, this.updateValue.bind(this));
        return;

      case 'ArrowDown':
        event.preventDefault();
        setNextOptionActive(this.root);
        return;

      case 'ArrowUp': {
        event.preventDefault();
        setPreviousOptionActive(this.root);
        return;
      }

      case 'Home': {
        event.preventDefault();
        setFirstOptionActive(this.root);
        return;
      }

      case 'End': {
        event.preventDefault();
        setLastOptionActive(this.root);
        return;
      }
    }
  }

  @Listen('mousemove', {})
  onMousemove(): void {
    clearActiveOptions(this.root);
  }

  @Listen('click')
  onClick(event: MouseEvent): void {
    whenEventIsFrom(
      'gux-option-v3',
      event,
      (option: HTMLGuxOptionV3Element) => {
        onClickedOption(option, this.updateValue.bind(this));
      }
    );
  }

  private setListboxOptions(): void {
    this.listboxOptions = Array.from(
      this.root.children
    ) as HTMLGuxOptionV3Element[];

    this.internallistboxoptionsupdated.emit();
  }

  private updateValue(newValue: string): void {
    if (this.value !== newValue) {
      this.value = newValue;

      simulateNativeEvent(this.root, 'input');
      simulateNativeEvent(this.root, 'change');
    }
  }

  componentWillLoad(): void {
    trackComponent(this.root);

    this.setListboxOptions();
  }

  componentWillRender(): void {
    this.listboxOptions.forEach(listboxOption => {
      listboxOption.selected = listboxOption.value === this.value;
    });
  }

  render(): JSX.Element {
    return (
      <Host role="listbox" tabIndex={0}>
        <slot onSlotchange={() => this.setListboxOptions()} />
      </Host>
    );
  }
}
