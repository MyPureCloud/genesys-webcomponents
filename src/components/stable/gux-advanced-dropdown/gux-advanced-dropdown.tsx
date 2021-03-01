import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Listen,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';
import { buildI18nForComponent, GetI18nValue } from '../../../i18n';

import advancedDropDownResources from './i18n/en.json';

@Component({
  styleUrl: 'gux-advanced-dropdown.less',
  tag: 'gux-advanced-dropdown'
})
export class GuxAdvancedDropdown {
  @Element()
  root: HTMLElement;

  searchElement: HTMLGuxSearchBetaElement;
  inputBox: HTMLElement;

  private i18n: GetI18nValue;

  /**
   * Disable the input and prevent interactions.
   */
  @Prop()
  disabled: boolean = false;

  /**
   * The dropdown's placeholder.
   */
  @Prop()
  placeholder: string;

  /**
   * Whether the list should filter its current options.
   */
  @Prop()
  noFilter: boolean = false;

  /**
   * Timeout between filter input changed and event being emitted.
   */
  @Prop()
  filterDebounceTimeout: number = 500;

  /**
   * Fires when the value of the advanced dropdown changes.
   */
  @Event()
  input: EventEmitter<string>;

  /**
   * Fires when the filter of the advanced dropdown changes.
   */
  @Event()
  filter: EventEmitter<string>;

  @State()
  srLabelledby: string;

  @State()
  opened: boolean;
  value: string;
  currentlySelectedOption: HTMLGuxDropdownOptionElement;
  selectionOptions: HTMLGuxDropdownOptionElement[];

  @Watch('disabled')
  watchValue(newValue: boolean) {
    if (this.opened && newValue) {
      this.closeDropdown(false);
    }
  }

  /**
   * Gets the currently selected values.
   *
   * @returns The array of selected values.
   */
  @Method()
  getSelectedValues(): Promise<string[]> {
    // Once multi-select gets added there will
    // be multiple values selectable.
    return Promise.resolve([this.value]);
  }

  @Method()
  async setLabeledBy(id: string) {
    this.srLabelledby = id;
  }

  @Listen('focusout')
  onFocusOut(e: FocusEvent) {
    if (!e.relatedTarget || !this.root.contains(e.relatedTarget as Node)) {
      this.closeDropdown(false);
    }
  }

  async componentWillLoad() {
    trackComponent(this.root);
    this.i18n = await buildI18nForComponent(
      this.root,
      advancedDropDownResources
    );
  }

  componentDidLoad() {
    this.selectionOptions = this.getSelectionOptions();
    for (const option of this.selectionOptions) {
      if (option.selected) {
        this.currentlySelectedOption = option;
      }

      option.addEventListener('selectedChanged', async () => {
        this.value = await option.getDisplayedValue();
        this.input.emit(option.value);
        this.closeDropdown(true);

        if (this.currentlySelectedOption) {
          this.currentlySelectedOption.selected = false;
        }
        this.currentlySelectedOption = option;
      });
    }
  }

  render() {
    return (
      <div
        class={`gux-dropdown
        ${this.disabled ? 'gux-disabled' : ''}
        ${this.opened ? 'gux-active' : ''}`}
      >
        <div class="gux-select-field" onMouseDown={() => this.inputMouseDown()}>
          <a
            ref={el => (this.inputBox = el)}
            class="gux-select-input"
            aria-labelledby={this.srLabelledby}
            tabindex="0"
            onKeyDown={e => this.inputKeyDown(e)}
          >
            {this.placeholder && !this.value && (
              <span class="gux-select-placeholder">{this.placeholder}</span>
            )}
            {this.value && <span class="gux-select-value">{this.value}</span>}
          </a>
          <div class="gux-icon-wrapper">
            <gux-icon decorative iconName="ic-dropdown-arrow"></gux-icon>
          </div>
        </div>
        <div
          class={`gux-advanced-dropdown-menu ${
            this.opened ? 'gux-opened' : ''
          }`}
        >
          <div class="gux-dropdown-menu-container">
            <gux-search-beta
              ref={el => (this.searchElement = el as HTMLGuxSearchBetaElement)}
              class="gux-light-theme"
              srLabel={this.i18n('searchAria')}
              dynamic-search="true"
              onInput={e => e.stopPropagation()}
              onSearch={e => this.searchRequested(e)}
              searchTimeout={this.filterDebounceTimeout}
            />
            <div
              class="gux-dropdown-options"
              onKeyDown={e => this.optionsKeyDown(e)}
            >
              <slot />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getSelectionOptions(): HTMLGuxDropdownOptionElement[] {
    const result: HTMLGuxDropdownOptionElement[] = [];
    const options: HTMLElement = this.root.getElementsByClassName(
      'gux-dropdown-options'
    )[0] as HTMLElement;

    // Hack around TSX not supporting for..of on HTMLCollection, this
    // needs to be tested in IE11
    const childrenElements: any = options.children;
    for (const child of childrenElements) {
      if (child.matches('gux-dropdown-option')) {
        result.push(child as HTMLGuxDropdownOptionElement);
      }
    }

    return result;
  }

  private inputMouseDown() {
    if (this.disabled) {
      return;
    }

    if (this.opened) {
      this.closeDropdown(true);
    } else {
      this.openDropdown(false);
    }
  }

  private getFocusIndex(): number {
    return this.selectionOptions.findIndex(option => {
      return option.matches(':focus');
    });
  }

  private optionsKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp': {
        const focusIndex = this.getFocusIndex();
        if (focusIndex > 0) {
          this.selectionOptions[focusIndex - 1].focus();
        }
        break;
      }
      case 'ArrowDown': {
        const focusIndex = this.getFocusIndex();
        if (focusIndex < this.selectionOptions.length - 1) {
          this.selectionOptions[focusIndex + 1].focus();
        }
        break;
      }
      case 'Home':
        if (!this.selectionOptions.length) {
          return;
        }
        this.selectionOptions[0].focus();
        break;
      case 'End':
        if (!this.selectionOptions.length) {
          return;
        }
        this.selectionOptions[this.selectionOptions.length - 1].focus();
        break;
      default:
    }
  }

  private inputKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case ' ':
        this.openDropdown(true);
        break;
      default:
    }
  }

  private searchRequested(event: CustomEvent) {
    this.filter.emit(event.detail);

    if (!this.noFilter) {
      for (const option of this.selectionOptions) {
        option.shouldFilter(event.detail).then(isFiltered => {
          option.filtered = isFiltered;
        });
      }
    }
  }

  private changeFocusToSearch() {
    setTimeout(() => {
      this.searchElement.setInputFocus();
    });
  }

  private openDropdown(focusSearch: boolean) {
    this.opened = true;

    if (focusSearch) {
      this.changeFocusToSearch();
    }
  }

  private closeDropdown(focus: boolean) {
    this.opened = false;
    this.searchElement.value = '';

    if (focus) {
      this.inputBox.focus();
    }
  }
}
