import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Prop
} from '@stencil/core';

import { buildI18nForComponent, GetI18nValue } from '../../../../i18n';
import { GuxPaginationLayout } from '../gux-pagination.types';

import paginationResources from './i18n/en.json';
import { GuxPaginationButtonsService } from './gux-pagination-button.service';

@Component({
  styleUrl: 'gux-pagination-buttons.less',
  tag: 'gux-pagination-buttons'
})
export class GuxPaginationButtons {
  @Element()
  private root: HTMLElement;

  private textFieldRef: HTMLInputElement;

  private i18n: GetI18nValue;

  @Prop()
  currentPage: number;

  @Prop()
  totalPages: number;

  @Prop()
  layout: GuxPaginationLayout = 'full';

  @Event({ bubbles: false })
  private internalcurrentpagechange: EventEmitter<number>;

  private get onFirstPage(): boolean {
    return this.currentPage <= 1;
  }

  private get onLastPage(): boolean {
    return this.currentPage >= this.totalPages;
  }

  private handleClickFirst(): void {
    this.internalcurrentpagechange.emit(1);
  }

  private handleClickPrevious(): void {
    this.internalcurrentpagechange.emit(this.currentPage - 1);
  }

  private handleClickNext(): void {
    this.internalcurrentpagechange.emit(this.currentPage + 1);
  }

  private handleClickLast(): void {
    this.internalcurrentpagechange.emit(this.totalPages);
  }

  private handleClickPage(pageNumber: number): void {
    this.internalcurrentpagechange.emit(pageNumber);
  }

  private setPageFromInput(value: string): void {
    const page = parseInt(value, 10);

    if (!page || isNaN(page)) {
      this.textFieldRef.value = String(this.currentPage);
    } else {
      this.internalcurrentpagechange.emit(page);
    }
  }

  private getPageListEnteries(
    currentPage: number,
    totalPages: number
  ): JSX.Element[] {
    return GuxPaginationButtonsService.getPageList(
      currentPage,
      totalPages
    ).reduce((acc, cv) => {
      if (cv.current) {
        return acc.concat(
          <button class="gux-pagination-buttons-list-current">
            {cv.display}
          </button>
        );
      }

      return acc.concat(
        <button
          class="gux-pagination-buttons-list-target"
          onClick={() => this.handleClickPage(cv.pageNumber)}
        >
          {cv.display}
        </button>
      );
    }, []);
  }

  private getSmallPagePicker(): JSX.Element {
    return <div class={'gux-pagination-buttons-spacer'}></div>;
  }

  private getExpandedPagePicker(): JSX.Element {
    return (
      <div class="gux-pagination-buttons-list-container">
        {this.getPageListEnteries(this.currentPage, this.totalPages)}
      </div>
    );
  }

  private getFullPagePicker(): JSX.Element {
    return (
      <div class="gux-pagination-buttons-input-container">
        <div>{this.i18n('page')}</div>
        <div class="gux-pagination-buttons-input">
          <gux-input-text-like>
            <input
              slot="input"
              value={String(this.currentPage)}
              ref={ref => (this.textFieldRef = ref)}
              onChange={() => this.setPageFromInput(this.textFieldRef.value)}
            />
          </gux-input-text-like>
        </div>
        <div>{this.i18n('totalPages', { totalPages: this.totalPages })}</div>
      </div>
    );
  }

  private getPagePicker(layout: GuxPaginationLayout): JSX.Element {
    if (layout === 'small') {
      return this.getSmallPagePicker();
    }

    if (layout === 'expanded') {
      return this.getExpandedPagePicker();
    }

    return this.getFullPagePicker();
  }

  async componentWillLoad(): Promise<void> {
    this.i18n = await buildI18nForComponent(this.root, paginationResources);
  }

  render(): JSX.Element {
    return (
      <div class={`gux-pagination-buttons-container gux-${this.layout}`}>
        <div class="gux-pagination-buttons-group">
          <gux-button
            title={this.i18n('first')}
            disabled={this.onFirstPage}
            onClick={this.handleClickFirst.bind(this)}
          >
            <gux-icon decorative iconName="ic-arrow-left-dbl"></gux-icon>
          </gux-button>
          <gux-button
            title={this.i18n('previous')}
            disabled={this.onFirstPage}
            onClick={this.handleClickPrevious.bind(this)}
          >
            <gux-icon decorative iconName="ic-chevron-small-left"></gux-icon>
          </gux-button>
        </div>

        {this.getPagePicker(this.layout)}

        <div class="gux-pagination-buttons-group">
          <gux-button
            title={this.i18n('next')}
            disabled={this.onLastPage}
            onClick={this.handleClickNext.bind(this)}
          >
            <gux-icon decorative iconName="ic-chevron-small-right"></gux-icon>
          </gux-button>
          <gux-button
            title={this.i18n('last')}
            disabled={this.onLastPage}
            onClick={this.handleClickLast.bind(this)}
          >
            <gux-icon decorative iconName="ic-arrow-right-dbl"></gux-icon>
          </gux-button>
        </div>
      </div>
    );
  }
}
