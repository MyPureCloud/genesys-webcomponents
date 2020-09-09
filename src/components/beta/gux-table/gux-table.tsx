import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Listen,
  Prop,
  readTask,
  State
} from '@stencil/core';
import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import tableResources from './i18n/en.json';

@Component({
  styleUrl: 'gux-table.less',
  tag: 'gux-table-beta'
})
export class GuxTable {
  @Element()
  root: HTMLElement;

  private resizeObserver: ResizeObserver;

  private i18n: GetI18nValue;

  /**
   * Indicates that vertical scroll is presented for table
   */
  @State()
  private isVerticalScroll: boolean = false;

  /**
   * Indicates that horizontal scroll is presented for table
   */
  @State()
  private isHorizontalScroll: boolean = false;

  /**
   * Indicates that table content scrolled to it's last column
   */
  @State()
  private isScrolledToFirstCell: boolean = true;

  /**
   * Indicates that table content scrolled to it's first column
   */
  @State()
  private isScrolledToLastCell: boolean = false;

  /**
   * Indicates table row density style
   */
  @Prop()
  compact: boolean = false;

  /**
   * Indicates that object table specific styles should be applied
   */
  @Prop()
  objectTable: boolean = false;

  /**
   * Represents info message that should be displayed for empty table
   */
  @Prop()
  emptyMessage: string;

  /**
   * Indicates columns in order they should be displayed
   */
  @Prop()
  columnsOrder: string;

  /**
   * Triggers when the sorting of the table column is changed.
   */
  @Event() sortChanged: EventEmitter;

  @Listen('scroll', { capture: true })
  onScroll(): void {
    const scrollLeft = this.tableContainer.querySelector('.gux-table-container')
      .scrollLeft;
    const maxScrollLeft =
      this.tableContainer.querySelector('.gux-table-container').scrollWidth -
      this.tableContainer.querySelector('.gux-table-container').clientWidth;

    if (scrollLeft === 0) {
      this.isScrolledToFirstCell = true;
    } else if (maxScrollLeft - scrollLeft - this.tableScrollbarConstant === 0) {
      this.isScrolledToLastCell = true;
    }
  }

  private get tableContainer(): HTMLElement {
    return this.root.children[0] as HTMLElement;
  }

  private get isTableEmpty(): boolean {
    return (
      !this.root.children[0] ||
      this.root.children[0].querySelectorAll('tbody tr').length < 1
    );
  }

  private get tableScrollbarConstant(): number {
    const container = this.tableContainer.querySelector(
      '.gux-table-container'
    ) as HTMLElement;
    return container ? container.offsetWidth - container.clientWidth : 0;
  }

  private get tableClasses(): string {
    return [
      'gux-table',
      this.isVerticalScroll ? 'vertical-scroll' : '',
      this.isHorizontalScroll ? 'horizontal-scroll' : ''
    ]
      .join(' ')
      .trim();
  }

  private get tableContainerClasses(): string {
    return [
      'gux-table-container',
      this.compact ? 'compact' : '',
      this.objectTable ? 'object-table' : ''
    ]
      .join(' ')
      .trim();
  }

  private previousColumn(): void {
    const columns = Array.from(
      this.tableContainer.querySelectorAll('.gux-table-container thead th')
    );

    /**
     * Get current horizontal scroll postion
     */
    const currentScrollX = this.tableContainer.querySelector(
      '.gux-table-container'
    ).scrollLeft;
    const containerWidth = this.root.getBoundingClientRect().width;
    let columnsWidth = 0;

    /**
     * Adding up all of the column widths until we get
     * to a column that is previous for the last visible
     */
    for (const column of columns) {
      const columnWidth = column.getBoundingClientRect().width;

      if (
        columnsWidth + columnWidth <
        containerWidth + Math.floor(currentScrollX - 1)
      ) {
        columnsWidth += columnWidth;
      } else {
        break;
      }
    }

    this.isScrolledToLastCell = false;

    /**
     * Manually decreasing scroll position of table container
     * for the width of last visible column
     */
    const scrollToValue = currentScrollX + containerWidth - columnsWidth;
    this.tableContainer.querySelector(
      '.gux-table-container'
    ).scrollLeft = Math.ceil(currentScrollX - scrollToValue);
  }

  private nextColumn(): void {
    const columns = Array.from(
      this.tableContainer.querySelectorAll('.gux-table-container thead th')
    );

    /**
     * Get current horizontal scroll postion
     */
    const currentScrollX = this.tableContainer.querySelector(
      '.gux-table-container'
    ).scrollLeft;
    const containerWidth = this.root.getBoundingClientRect().width;
    let columnsWidth = 0;

    this.isScrolledToFirstCell = false;

    /**
     * Adding up all of the column widths until we get to a column
     * that overflows current viewport for the table
     */
    for (const column of columns) {
      columnsWidth += column.getBoundingClientRect().width;

      if (columnsWidth > containerWidth + currentScrollX) {
        break;
      }
    }

    /**
     * Manually increasing scroll position of table container with value,
     * where next partially visible column being fully visible
     */
    this.tableContainer.querySelector(
      '.gux-table-container'
    ).scrollLeft = Math.ceil(columnsWidth - containerWidth);
  }

  private setRowsCellsNames(): void {
    const columnsElements = Array.from(
      this.tableContainer.querySelectorAll('thead th')
    );
    const rowsElements = Array.from(
      this.tableContainer.querySelectorAll('tbody tr')
    );

    rowsElements.map(row => {
      Array.from(row.querySelectorAll('td')).forEach((cell, cellIndex) => {
        cell.setAttribute(
          'data-column-name',
          columnsElements[cellIndex].getAttribute('data-column-name')
        );
      });
    });
  }

  private prepareSortableColumns(): void {
    const columnsElements = Array.from(
      this.tableContainer.querySelectorAll('thead th')
    );
    const downArrow = document.createElement('gux-icon');
    const upArrow = document.createElement('gux-icon');
    const sortingHiglight = document.createElement('div');

    downArrow.setAttribute('icon-name', 'ic-arrow-solid-down');
    downArrow.setAttribute('screenreader-text', 'test');
    downArrow.setAttribute('class', 'gux-column-sort-arrow-down');

    upArrow.setAttribute('icon-name', 'ic-arrow-solid-up');
    upArrow.setAttribute('screenreader-text', 'test');
    upArrow.setAttribute('class', 'gux-column-sort-arrow-up');

    sortingHiglight.setAttribute('class', 'gux-column-sort-highlight');

    columnsElements.forEach((column: HTMLElement) => {
      if (column.dataset.hasOwnProperty('sortable')) {
        column.appendChild(downArrow.cloneNode(true));
        column.appendChild(upArrow.cloneNode(true));
        column.appendChild(sortingHiglight.cloneNode(true));
        column.onclick = (event: MouseEvent) => {
          const columnElement = event.target as HTMLElement;
          const sortDirection = columnElement.dataset.sortDirection || '';

          switch (sortDirection) {
            case '':
              columnElement.setAttribute('data-sort-direction', 'asc');
              break;
            case 'asc':
              columnElement.setAttribute('data-sort-direction', 'desc');
              break;
            case 'desc':
              columnElement.removeAttribute('data-sort-direction');
              break;
          }

          this.sortChanged.emit({
            columnName: columnElement.dataset.columnName,
            sortDirection: columnElement.dataset.sortDirection || null
          });
        };
      }
    });
  }

  // private prepareTableData(): void {
  //   const columnsElements = Array.from(
  //     this.tableContainer.querySelectorAll('thead th')
  //   );
  //   const rowsElements = Array.from(
  //     this.tableContainer.querySelectorAll('tbody tr')
  //   );

  //   this.columns = columnsElements.map((column: HTMLElement, index: number) => {
  //     return {
  //       name: column.dataset.columnName || index.toString(),
  //       sortable: column.dataset.hasOwnProperty('sortable'),
  //       sortDirection: ''
  //     };
  //   });

  //   this.rows = rowsElements.map((row, rowIndex) => {
  //     Array.from(row.querySelectorAll('td')).forEach((cell, cellIndex) => {
  //       cell.setAttribute('data-row', rowIndex.toString());
  //       cell.setAttribute('data-row-cell', cellIndex.toString());
  //     });

  //     return {
  //       selected: false
  //     };
  //   });
  // }

  private reorderColumns(): void {
    const columnsOrder = this.columnsOrder.split(' ');
    const tableHead = this.tableContainer.querySelector('thead tr');
    const tableBody = this.tableContainer.querySelectorAll('tbody tr');
    const reorderedColumns = [];

    columnsOrder.forEach(columnName => {
      reorderedColumns.push(
        Array.from(tableHead.children).find(el => {
          return el.getAttribute('data-column-name') === columnName;
        })
      );
    });

    tableHead.innerHTML = '';
    reorderedColumns.forEach(el => {
      tableHead.appendChild(el);
    });

    tableBody.forEach(row => {
      const reorderedRowCells = [];

      columnsOrder.forEach(columnName => {
        reorderedRowCells.push(
          Array.from(row.children).find(el => {
            return el.getAttribute('data-column-name') === columnName;
          })
        );
      });

      row.innerHTML = '';
      reorderedRowCells.forEach(el => {
        row.appendChild(el);
      });
    });
  }

  private checkHorizontalScroll(): void {
    const tableWidth = this.tableContainer
      .querySelector('.gux-table-container table')
      .getBoundingClientRect().width;
    const containerWidth = this.root.getBoundingClientRect().width;

    if (tableWidth <= containerWidth) {
      this.isHorizontalScroll = false;
    } else {
      this.isHorizontalScroll = true;
    }
  }

  private checkVerticalScroll(): void {
    const tableContainerElement = this.root.querySelector(
      '.gux-table-container'
    );
    this.isVerticalScroll =
      tableContainerElement.scrollHeight > tableContainerElement.clientHeight;
  }

  async componentWillLoad(): Promise<void> {
    this.i18n = await buildI18nForComponent(this.root, tableResources);
    if (!this.emptyMessage) {
      this.emptyMessage = this.i18n('emptyMessage');
    }

    this.setRowsCellsNames();

    if (this.columnsOrder) {
      this.reorderColumns();
    }

    this.prepareSortableColumns();

    setTimeout(() => {
      this.checkHorizontalScroll();
      this.checkVerticalScroll();

      if (!this.resizeObserver && window.ResizeObserver) {
        this.resizeObserver = new ResizeObserver(() => {
          readTask(() => {
            this.checkHorizontalScroll();
            this.checkVerticalScroll();
          });
        });
      }

      this.resizeObserver.observe(
        this.tableContainer.querySelector('.gux-table-container table')
      );
    });
  }

  disconnectedCallback(): void {
    this.resizeObserver.unobserve(
      this.tableContainer.querySelector('.gux-table-container table')
    );
  }

  render() {
    return (
      <div class={this.tableClasses}>
        <div class={this.tableContainerClasses}>
          <slot name="data" />
        </div>
        {this.isHorizontalScroll && (
          <button
            class={
              this.isScrolledToFirstCell
                ? 'gux-table-scroll-left disabled'
                : 'gux-table-scroll-left'
            }
            onClick={
              !this.isScrolledToFirstCell && this.previousColumn.bind(this)
            }
          >
            <gux-icon
              icon-name="ic-chevron-left"
              screenreader-text={this.i18n('scrollLeft')}
            />
          </button>
        )}
        {this.isHorizontalScroll && (
          <button
            class={
              this.isScrolledToLastCell
                ? 'gux-table-scroll-right disabled'
                : 'gux-table-scroll-right'
            }
            style={{ marginRight: `${this.tableScrollbarConstant}px` }}
            onClick={!this.isScrolledToLastCell && this.nextColumn.bind(this)}
          >
            <gux-icon
              icon-name="ic-chevron-right"
              screenreader-text={this.i18n('scrollRight')}
            />
          </button>
        )}
        {this.isTableEmpty && (
          <div class="empty-table">
            <h2>{this.emptyMessage}</h2>
          </div>
        )}
      </div>
    );
  }
}
