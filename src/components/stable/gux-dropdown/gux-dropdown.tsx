import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Listen,
  Method,
  Prop,
  State
} from '@stencil/core';

import { KeyCode } from '../../../common-enums';
import { whenEventIsFrom } from '../../../utils/dom/when-event-is-from';
import { trackComponent } from '../../../usage-tracking';

@Component({
  styleUrl: 'gux-dropdown.less',
  tag: 'gux-dropdown'
})
export class GuxDropdown {
  @Element()
  root: HTMLElement;

  textFieldElement: HTMLGuxTextFieldLegacyElement;

  /**
   * Sets the select mode (default, page or palette).
   */
  @Prop()
  mode: 'default' | 'page' | 'palette' = 'default';
  /**
   * Disable the input and prevent interactions.
   */
  @Prop()
  disabled: boolean = false;
  /**
   * Indicate the dropdown input value
   */
  @Prop({ mutable: true })
  value: string = '';
  /**
   * The dropdown placeholder.
   */
  @Prop()
  placeholder: string;
  /**
   * Whether the user can filter or not.
   */
  @Prop()
  filterable: boolean;

  @State()
  opened: boolean;

  @State()
  forcedGhostValue: string;

  @State()
  srLabeledBy: string;

  inputIsFocused: boolean = false;

  valueEdited: boolean = false;

  /**
   * Emits when selection is changed.
   */
  @Event()
  change: EventEmitter<string>;
  emitChange(value: string) {
    this.change.emit(value);
  }

  @Listen('focusout')
  onFocusOut(e: FocusEvent) {
    if (!e.relatedTarget || !this.root.contains(e.relatedTarget as Node)) {
      this.opened = false;
      this.forcedGhostValue = '';
      const selectionOptions = this.getSelectionOptions();
      const match = selectionOptions.some(item => {
        return item.text === this.value;
      });
      if (!match) {
        this.value = '';
      }
    }
  }

  @Method()
  async setLabeledBy(labeledBy: string): Promise<void> {
    this.textFieldElement.setLabelledBy(labeledBy);
  }

  @Method()
  async setSelected(): Promise<void> {
    const selectionOptions = this.getSelectionOptions();
    const selectedOptionIndex = selectionOptions
      .map(selectionOption => selectionOption.selected)
      .lastIndexOf(true);

    if (selectedOptionIndex >= 0) {
      const option = selectionOptions[selectedOptionIndex];
      this.value = option.text;
    }
  }

  // TODO: Fix the keyboard navigation I broke
  onKeyDown(event: KeyboardEvent) {
    const selectionOptions = this.getSelectionOptions();
    const focusIndex = this.getFocusIndex(selectionOptions);
    switch (event.keyCode) {
      case KeyCode.Up:
        if (focusIndex > 0) {
          selectionOptions[focusIndex - 1].focus();
        }
        break;
      case KeyCode.Down:
        if (this.inputIsFocused) {
          this.opened = true;
        }
        if (focusIndex < selectionOptions.length - 1) {
          selectionOptions[focusIndex + 1].focus();
        }
        break;
      case KeyCode.Home:
        if (!selectionOptions.length) {
          return;
        }
        selectionOptions[0].focus();
        break;
      case KeyCode.End:
        if (!selectionOptions.length) {
          return;
        }
        selectionOptions[selectionOptions.length - 1].focus();
        break;
      case KeyCode.Enter:
      case KeyCode.Space:
        break;
      default:
        this.valueEdited = true;
        if (!this.filterable) {
          const arr = selectionOptions.filter(item => {
            return item.text.startsWith(event.key);
          });
          if (arr[0]) {
            arr[0].focus();
          }
        }
    }
  }

  setValue(text: string, value: string) {
    this.value = text;
    this.opened = false;
    this.valueEdited = false;
    this.emitChange(value);
  }

  _clickHandler() {
    if (!this.disabled) {
      this.opened = !this.opened;
    }
  }

  _focusHandler() {
    this.inputIsFocused = true;
  }

  _optionFocusedHandler(e: FocusEvent) {
    whenEventIsFrom('gux-option', e, elem => {
      const option = elem as HTMLGuxOptionElement;
      this.forcedGhostValue =
        this.value + option.text.substring(this.value.length);
    });
  }

  private _optionClickedHandler(e: MouseEvent) {
    whenEventIsFrom('gux-option', e, elem => {
      const option = elem as HTMLGuxOptionElement;
      this.setValue(option.text, option.value || option.text);
    });
  }

  private _optionKeyDownHandler(e: KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      whenEventIsFrom('gux-option', e, elem => {
        const option = elem as HTMLGuxOptionElement;
        this.setValue(option.text, option.value || option.text);
      });
    }
  }

  _blurHandler() {
    this.inputIsFocused = false;
    this.forcedGhostValue = '';
  }

  _inputHandler(event: CustomEvent) {
    this.value = event.detail;
    this.opened = true;
  }

  private _showDropdownIcon() {
    const selectionOptions = this.getSelectionOptions();
    const match = selectionOptions.filter(item => {
      return item.text === this.value;
    });
    const filterableBehavior = !this.value || !!match.length;
    return this.filterable ? filterableBehavior : true;
  }

  getFilteredItems() {
    const selectionOptions = this.getSelectionOptions();
    if (this.filterable) {
      const arr = selectionOptions.filter(item => {
        return item.text.toLowerCase().startsWith(this.value.toLowerCase());
      });
      return arr;
    } else {
      return selectionOptions;
    }
  }

  getGhost() {
    this.searchHighlightAndFilter(this.value);
    const firstFilteredItem = this.getFilteredItems().length
      ? this.getFilteredItems()[0].text
      : '';
    const valueGhost =
      this.value + firstFilteredItem.substring(this.value.length);
    const ghost = this.forcedGhostValue ? this.forcedGhostValue : valueGhost;
    const placeholder = !this.value ? this.placeholder : '';
    return this.opened && this.filterable ? ghost : placeholder;
  }

  componentWillLoad(): void {
    trackComponent(this.root, {
      variant: this.filterable ? 'filterable' : 'full'
    });
  }

  componentDidLoad(): void {
    this.setSelected();

    if (!this.filterable) {
      this.textFieldElement.readonly = true;
    }
  }

  private getSelectionOptions(): HTMLGuxOptionElement[] {
    const result: HTMLGuxOptionElement[] = [];
    const options: HTMLElement = this.root.getElementsByClassName(
      'gux-options'
    )[0] as HTMLElement;

    if (!options) {
      return [];
    }
    // Hack around TSX not supporting for..of on HTMLCollection, this
    // needs to be tested in IE11
    const childrenElements: any = options.children;
    for (const child of childrenElements) {
      if (child.matches('gux-option')) {
        result.push(child as HTMLGuxOptionElement);
      }
    }
    return result;
  }

  render() {
    return (
      <div
        class={`gux-dropdown gux-${this.mode} ${
          this.disabled ? 'gux-disabled' : ''
        } ${this.opened ? 'gux-active' : ''}`}
        onKeyDown={e => this.onKeyDown(e)}
      >
        <div class="gux-select-field">
          <span class="gux-ghost" aria-hidden="true">
            {this.getGhost()}
          </span>
          <gux-text-field-legacy
            title={this.value}
            ref={el =>
              (this.textFieldElement = el as HTMLGuxTextFieldLegacyElement)
            }
            onMouseDown={() => {
              this._clickHandler();
            }}
            onFocus={() => {
              this._focusHandler();
            }}
            onBlur={() => {
              this._blurHandler();
            }}
            onInput={e => {
              this._inputHandler(e);
            }}
            value={this.value}
            disabled={this.disabled}
            class={this._showDropdownIcon() ? 'gux-unclearable' : ''}
          />
          {this._showDropdownIcon() && (
            <button
              class="gux-dropdown-indicator"
              aria-hidden="true"
              tabindex="-1"
              type="button"
            >
              <gux-icon decorative iconName="ic-dropdown-arrow"></gux-icon>
            </button>
          )}
        </div>
        <div
          class={`gux-options ${this.opened ? 'gux-opened' : ''}`}
          onClick={this._optionClickedHandler.bind(this)}
          onFocusIn={this._optionFocusedHandler.bind(this)}
          onKeyDown={this._optionKeyDownHandler.bind(this)}
        >
          <slot />
        </div>
      </div>
    );
  }

  private getFocusIndex(selectionOptions: HTMLGuxOptionElement[]): number {
    return selectionOptions.findIndex(option => {
      return option.matches(':focus');
    });
  }

  private searchHighlightAndFilter(searchInput: string) {
    const selectionOptions = this.getSelectionOptions();
    if (selectionOptions) {
      for (const option of selectionOptions) {
        option.shouldFilter(searchInput).then(isFiltered => {
          if (this.filterable && isFiltered && this.valueEdited) {
            option.classList.add('gux-filtered');
          } else {
            option.classList.remove('gux-filtered');
          }
        });
      }
    }
  }
}
