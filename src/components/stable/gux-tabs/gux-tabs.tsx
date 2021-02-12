import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Listen,
  Prop,
  readTask,
  State,
  Watch,
  writeTask
} from '@stencil/core';
import Sortable, { MoveEvent } from 'sortablejs';
import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import tabsResources from './i18n/en.json';
import { whenEventIsFrom } from '../../../utils/dom/when-event-is-from';

@Component({
  styleUrl: 'gux-tabs.less',
  tag: 'gux-tabs',
  shadow: true
})
export class GuxTabs {
  /**
   * Enable tab sorting by drag/drop
   */
  @Prop() allowSort: boolean = false;

  /**
   * Enable new tab button
   */
  @Prop() showNewTabButton: boolean = false;

  /**
   * tabId of the currently selected tab
   */
  @Prop() value: string = '';

  /**
   * Triggers when the new tab button is selected.
   */
  @Event() newTab: EventEmitter;

  /**
   * Triggers when a tab is selected.
   */
  @Event() input: EventEmitter;

  /**
   * Triggers when the sorting of the tabs is changed.
   */
  @Event() sortChanged: EventEmitter<string[]>;

  @Element()
  private root: HTMLElement;

  @State() private hasScrollbar: boolean = false;

  private i18n: GetI18nValue;

  private sortableInstance?: Sortable;

  private resizeObserver?: ResizeObserver;

  private domObserver?: MutationObserver;

  @Watch('value')
  watchHandler(newValue: string) {
    const tabs: HTMLGuxTabElement[] = Array.from(
      this.root.querySelectorAll('gux-tab')
    );

    for (const tab of tabs) {
      tab.active = tab.tabId === newValue;
    }
  }

  @Listen('internaltabselected')
  internaltabselectedHandler(e: CustomEvent) {
    whenEventIsFrom('gux-tab', e, elem => {
      const tab = elem as HTMLGuxTabElement;
      if (!tab.active) {
        this.value = tab.tabId;
        this.input.emit();
      }
    });
  }

  createSortable() {
    this.sortableInstance = new Sortable(this.root, {
      animation: 250,
      draggable: 'gux-tab',
      filter: '.ignore-sort',
      onMove: (event: MoveEvent) => {
        return !event.related.classList.contains('ignore-sort');
      },
      onUpdate: () => {
        const tabIds = Array.from(this.root.querySelectorAll('gux-tab')).map(
          tabElement => tabElement.tabId
        );
        this.sortChanged.emit(tabIds);
      }
    });
  }

  destroySortable() {
    if (this.sortableInstance) {
      this.sortableInstance.destroy();
      this.sortableInstance = null;
    }
  }

  disconnectedCallback() {
    if (this.sortableInstance) {
      this.destroySortable();
    }

    if (this.resizeObserver) {
      this.resizeObserver.unobserve(
        this.root.shadowRoot.querySelector('.gux-tabs')
      );
    }

    if (this.domObserver) {
      this.domObserver.disconnect();
    }
  }

  async componentWillLoad(): Promise<void> {
    this.i18n = await buildI18nForComponent(this.root, tabsResources);
  }

  checkForScrollbarHideOrShow() {
    readTask(() => {
      const el = this.root.shadowRoot.querySelector('.scrollable-section');
      const hasScrollbar = el.clientWidth !== el.scrollWidth;

      if (hasScrollbar !== this.hasScrollbar) {
        this.hasScrollbar = hasScrollbar;
      }
    });
  }

  componentDidLoad() {
    if (this.allowSort && !this.sortableInstance) {
      this.createSortable();
    }

    if (!this.resizeObserver && window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(
        this.checkForScrollbarHideOrShow.bind(this)
      );
    }

    if (this.resizeObserver) {
      this.resizeObserver.observe(
        this.root.shadowRoot.querySelector('.gux-tabs')
      );
    }

    if (!this.domObserver && window.MutationObserver) {
      this.domObserver = new MutationObserver(
        this.checkForScrollbarHideOrShow.bind(this)
      );
    }

    if (this.domObserver) {
      this.domObserver.observe(this.root, {
        childList: true,
        attributes: false,
        subtree: true
      });
    }
  }

  componentDidRender() {
    setTimeout(() => {
      readTask(() => {
        this.checkForScrollbarHideOrShow();

        if (this.value) {
          const activeTab: any = this.root.querySelector(
            `gux-tab[tab-id='${this.value}']`
          );
          if (activeTab) {
            activeTab.active = true;
          }
        }
      });
    }, 500);
  }

  scrollLeft() {
    writeTask(() => {
      this.root.shadowRoot
        .querySelector('.scrollable-section')
        .scrollBy(-100, 0);
    });
  }

  scrollRight() {
    writeTask(() => {
      this.root.shadowRoot
        .querySelector('.scrollable-section')
        .scrollBy(100, 0);
    });
  }

  render() {
    const AddNewTabButton = (props: { onClick: () => void }) => {
      return (
        <button
          title={this.i18n('createNewTab')}
          class="add-tab"
          onClick={() => props.onClick()}
        >
          <gux-icon iconName="ic-add" decorative={true} />
        </button>
      );
    };
    return (
      <div class="gux-tabs">
        <div class="action-button-container">
          {this.hasScrollbar ? (
            <button
              title={this.i18n('scrollLeft')}
              class="arrow-button"
              onClick={() => this.scrollLeft()}
            >
              <gux-icon iconName="ic-chevron-left" decorative={true} />
            </button>
          ) : null}
        </div>
        <div class="scrollable-section">
          <slot />
          {this.showNewTabButton && !this.hasScrollbar ? (
            <AddNewTabButton onClick={() => this.newTab.emit()} />
          ) : null}
        </div>
        <div class="action-button-container">
          {this.hasScrollbar ? (
            <button
              title={this.i18n('scrollRight')}
              class="arrow-button"
              onClick={() => this.scrollRight()}
            >
              <gux-icon iconName="ic-chevron-right" decorative={true} />
            </button>
          ) : null}

          {this.showNewTabButton && this.hasScrollbar ? (
            <AddNewTabButton onClick={() => this.newTab.emit()} />
          ) : null}
        </div>
      </div>
    );
  }
}
