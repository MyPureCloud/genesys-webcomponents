import { Component, Element, h, JSX, Method, Prop, State } from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';

import {
  GuxAccordionArrowPosition,
  IGuxAccordionSection
} from './gux-accordion.types';
import {
  getSections,
  modifyClassList,
  onKeyboardNavigation
} from './gux-accordion.service';

@Component({
  styleUrl: 'gux-accordion.less',
  tag: 'gux-accordion'
})
export class GuxAccordion {
  @Element()
  root: HTMLElement;

  @State()
  sections: IGuxAccordionSection[] = [];

  /**
   * The heading level within the page the
   * accordion section headers should be set to.
   * heading-level="3" woudl be equivalent to an
   * h3 element.
   */
  @Prop()
  headingLevel: number = null;

  @Prop()
  arrowPosition: GuxAccordionArrowPosition = 'default';

  /**
   * Opens a section.
   * @param slotName The slot name
   */
  @Method()
  async open(slotName: string): Promise<void> {
    modifyClassList(slotName, 'add', this.sections);
  }
  /**
   * Closes a section.
   * @param slotName The slot name
   */
  @Method()
  async close(slotName: string): Promise<void> {
    modifyClassList(slotName, 'remove', this.sections);
  }
  /**
   * Toggles a section.
   * @param slotName The slot name
   */
  @Method()
  async toggle(slotName: string): Promise<void> {
    modifyClassList(slotName, 'toggle', this.sections);
  }

  componentWillLoad(): void {
    trackComponent(this.root);
    this.sections = getSections(this.root);
  }

  render(): JSX.Element {
    return (
      <div class="gux-accordion">
        {this.sections.map(section => (
          <section
            class="gux-section"
            onKeyDown={event =>
              onKeyboardNavigation(event, section.slotName, this.sections)
            }
            ref={el => (section.ref = el)}
          >
            <div
              aria-role="heading"
              aria-level={this.headingLevel}
              class="gux-header"
            >
              <button
                class="gux-header-button"
                type="button"
                onClick={() => this.toggle(section.slotName)}
              >
                <div class="gux-text">{section.slotName}</div>
                {this.arrowPosition === 'beside-text' ? null : (
                  <div class="gux-spacer"></div>
                )}
                <div class="gux-toggle-arrow">
                  <gux-icon
                    decorative
                    icon-name="chevron-small-down"
                  ></gux-icon>
                </div>
              </button>
            </div>
            <div class="gux-content">
              <slot name={section.slotName}></slot>
            </div>
          </section>
        ))}
      </div>
    );
  }
}
