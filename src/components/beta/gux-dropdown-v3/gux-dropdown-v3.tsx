import {
  Component,
  Element,
  forceUpdate,
  h,
  Listen,
  JSX,
  Prop,
  State,
  Watch
} from '@stencil/core';
import { ClickOutside } from 'stencil-click-outside';

import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import simulateNativeEvent from '../../../utils/dom/simulate-native-event';
import { trackComponent } from '../../../usage-tracking';
import {
  createDropdownPopper,
  DropdownPopperInstance
} from '../../../utils/popper/dropdown-popper';
import { OnMutation } from '../../../utils/decorator/on-mutation';

import translationResources from './i18n/en.json';

/**
 * @slot - for list of gux-option-v3
 */
@Component({
  styleUrl: 'gux-dropdown-v3.less',
  tag: 'gux-dropdown-v3-beta'
})
export class GuxDropdownV3Beta {
  private dropdownPopperInstance: DropdownPopperInstance;
  private i18n: GetI18nValue;
  private fieldButtonElement: HTMLElement;
  private listboxContainerElement: HTMLElement;
  private listboxElement: HTMLGuxListboxElement;

  @Element()
  private root: HTMLElement;

  @Prop()
  value: string;

  @Prop()
  disabled: boolean = false;

  @Prop()
  placeholder: string;

  // filterable prop removed (for now)
  // @Prop()
  // filterable: boolean = false;

  // mode prop removed
  // @Prop()
  // mode: 'default' | 'page' | 'palette' = 'default';

  // setLabeledBy method removed
  // @Method()
  // async setLabeledBy(labeledBy: string): Promise<void> {}

  // setSelected method removed
  // @Method()
  // async setSelected(): Promise<void> {}

  @State()
  private listboxExpanded: boolean = false;

  @Watch('listboxExpanded')
  focusSelectedItemAfterRender(listboxExpanded: boolean) {
    if (listboxExpanded && this.listboxElement) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.listboxElement.focus();
        });
      });
    }
  }

  @Listen('keydown')
  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        this.shrinkListbox(true);
        return;
      case 'Tab':
        this.shrinkListbox(false);
        return;
    }
  }

  @Listen('internallistboxoptionsupdated')
  onInternallistboxoptionsupdated(event: CustomEvent): void {
    event.stopPropagation();
    forceUpdate(this.root);
  }

  @ClickOutside({ triggerEvents: 'mousedown' })
  checkForClickOutside() {
    this.shrinkListbox(false);
  }

  @OnMutation({ childList: true })
  onMutation() {
    forceUpdate(this.root);
  }

  async componentWillLoad(): Promise<void> {
    trackComponent(this.root);
    this.i18n = await buildI18nForComponent(this.root, translationResources);
  }

  componentDidLoad(): void {
    this.dropdownPopperInstance = createDropdownPopper(
      this.fieldButtonElement,
      this.listboxContainerElement
    );

    this.listboxElement.addEventListener('input', (event: InputEvent) => {
      event.stopPropagation();

      const newValue = (event.target as HTMLGuxListElement).value;
      this.updateValue(newValue);
    });
    this.listboxElement.addEventListener('change', (event: InputEvent) => {
      event.stopPropagation();
    });
  }

  disconnectedCallback(): void {
    this.dropdownPopperInstance.destroy();
  }

  private renderFieldButton(): JSX.Element {
    return (
      <button
        type="button"
        class="gux-field-button"
        disabled={this.disabled}
        onClick={this.fieldButtonClick.bind(this)}
        ref={el => (this.fieldButtonElement = el)}
        aria-haspopup="listbox"
        aria-expanded={this.listboxExpanded}
      >
        <div class="gux-selected-option">
          {this.renderFieldButtonDisplayText()}
        </div>
        <gux-icon
          class="gux-expand-icon"
          decorative
          iconName="chevron-small-down"
        ></gux-icon>
      </button>
    );
  }

  private renderFieldButtonDisplayText(): JSX.Element {
    const selectedListboxOptionElement = this.root.querySelector(
      `gux-option-v3[value="${this.value}"]`
    );

    if (selectedListboxOptionElement) {
      return (
        <div class="gux-selected-option">
          {selectedListboxOptionElement.textContent}
        </div>
      );
    } else if (this.value) {
      return (
        <div class="gux-unknown-option">
          {this.i18n('unknownSelection')} ({this.value})
        </div>
      );
    }

    return (
      <div class="gux-placeholder">
        {this.placeholder || this.i18n('noSelection')}
      </div>
    );
  }

  private renderListboxContainer(): JSX.Element {
    return (
      <div
        class="gux-listbox-container"
        ref={el => (this.listboxContainerElement = el)}
      >
        <gux-listbox ref={el => (this.listboxElement = el)} value={this.value}>
          <slot />
        </gux-listbox>
      </div>
    );
  }

  private fieldButtonClick(): void {
    this.listboxExpanded = !this.listboxExpanded;
  }

  private shrinkListbox(focusOnFieldButton: boolean): void {
    if (this.listboxExpanded) {
      this.listboxExpanded = false;
    }

    if (focusOnFieldButton) {
      this.fieldButtonElement.focus();
    }
  }

  private updateValue(newValue: string): void {
    if (this.value !== newValue) {
      this.value = newValue;
      this.shrinkListbox(true);
      simulateNativeEvent(this.root, 'input');
      simulateNativeEvent(this.root, 'change');
    }
  }

  render(): JSX.Element {
    return (
      <div
        class={{
          'gux-dropdown-v3-container': true,
          'gux-disabled': this.disabled,
          'gux-listbox-expanded': this.listboxExpanded
        }}
      >
        {this.renderFieldButton()}
        {this.renderListboxContainer()}
      </div>
    );
  }
}
