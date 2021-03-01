import { Component, Element, h, Method, Prop } from '@stencil/core';
import { KeyCode } from '../../../common-enums';
import { trackComponent } from '../../../usage-tracking';

interface ISection {
  slotName: string;
  slotRef: HTMLElement;
}

function getToggleButton(slot: HTMLElement): HTMLElement {
  return slot.children[0].children[0] as HTMLElement;
}

@Component({
  styleUrl: 'gux-accordion.less',
  tag: 'gux-accordion'
})
export class GuxAccordion {
  @Element()
  root: HTMLElement;

  sections: ISection[] = [];

  /**
   * The heading level within the page the
   * accordion section headers should be set to.
   * heading-level="3" woudl be equivalent to an
   * h3 element.
   */
  @Prop()
  headingLevel: number = null;

  initializeSections() {
    const children = Array.from(this.root.children);
    children.map(element => {
      const slot = element.getAttribute('slot');
      if (slot) {
        this.sections.push({
          slotName: slot,
          slotRef: null
        });
      } else {
        element.parentNode.removeChild(element);
      }
    });
  }

  componentWillLoad() {
    trackComponent(this.root);
    this.initializeSections();
  }

  /**
   * Opens a section.
   * @param slot The slot name
   */
  @Method()
  async open(slot: string) {
    const section = this.getSectionByName(slot);
    if (section) {
      section.slotRef.classList.add('gux-opened');
    }
  }
  /**
   * Closes a section.
   * @param slot The slot name
   */
  @Method()
  async close(slot: string) {
    const section = this.getSectionByName(slot);
    if (section) {
      section.slotRef.classList.remove('gux-opened');
    }
  }
  /**
   * Toggles a section.
   * @param slot The slot name
   */
  @Method()
  async toggle(slot: string) {
    const section = this.getSectionByName(slot);
    if (section) {
      section.slotRef.classList.toggle('gux-opened');
    }
  }

  getSectionByName(slot: string): ISection {
    const slotIndex = this.sections
      .map(section => {
        return section.slotName;
      })
      .indexOf(slot);
    return this.sections[slotIndex];
  }

  getPreviousSlot(slot: string): HTMLElement {
    const currentIndex = this.sections
      .map(section => {
        return section.slotName;
      })
      .indexOf(slot);
    if (currentIndex <= 0) {
      return this.sections[this.sections.length - 1].slotRef;
    } else {
      return this.sections[currentIndex - 1].slotRef;
    }
  }

  getNextSlot(slot: string): HTMLElement {
    const currentIndex = this.sections
      .map(section => {
        return section.slotName;
      })
      .indexOf(slot);
    if (currentIndex >= this.sections.length - 1) {
      return this.sections[0].slotRef;
    } else {
      return this.sections[currentIndex + 1].slotRef;
    }
  }

  onKeyDown(event: KeyboardEvent, slotName: string) {
    switch (event.keyCode) {
      case KeyCode.Up:
        const previousSlot = this.getPreviousSlot(slotName);
        getToggleButton(previousSlot).focus();
        break;
      case KeyCode.Down:
        const nextSlot = this.getNextSlot(slotName);
        getToggleButton(nextSlot).focus();
        break;
      case KeyCode.End:
        const lastSlot = this.sections[this.sections.length - 1].slotRef;
        getToggleButton(lastSlot).focus();
        break;
      case KeyCode.Home:
        const firstSlot = this.sections[0].slotRef;
        getToggleButton(firstSlot).focus();
        break;
    }
  }

  render() {
    return (
      <div class="gux-accordion">
        {this.sections.map(slot => (
          <section
            class="gux-section"
            onKeyDown={e => this.onKeyDown(e, slot.slotName)}
            ref={el => (slot.slotRef = el)}
          >
            <div
              aria-role="heading"
              aria-level={this.headingLevel}
              class="gux-header"
            >
              <button type="button" onClick={() => this.toggle(slot.slotName)}>
                <span class="gux-heading-text">{slot.slotName}</span>
                <span class="gux-toggle-arrow">
                  <gux-icon decorative iconName="ic-dropdown-arrow"></gux-icon>
                </span>
              </button>
            </div>
            <div class="gux-content">
              <slot name={slot.slotName} />
            </div>
          </section>
        ))}
      </div>
    );
  }
}
