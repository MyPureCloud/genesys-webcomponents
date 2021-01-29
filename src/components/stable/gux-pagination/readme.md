# gux-pagination

A pagination control intended to be used underneath a table or grid with paged
content. Given a total number of items, the view will automatically calculate
a total number of pages (you can optionally supply the number of items per page
and/or initial starting page).

When a user changes pages, the component will emit a `guxpaginationchange` event with
the pagination state.


<!-- Auto Generated Below -->


## Properties

| Property       | Attribute        | Description                                                                     | Type                              | Default  |
| -------------- | ---------------- | ------------------------------------------------------------------------------- | --------------------------------- | -------- |
| `currentPage`  | `current-page`   | The currently select page. Changes are watched by the component.                | `number`                          | `1`      |
| `itemsPerPage` | `items-per-page` | The max number of items on a page. Used to calculate total page count           | `100 \| 25 \| 50 \| 75`           | `25`     |
| `layout`       | `layout`         | The pagination component can have different layouts to suit the available space | `"expanded" \| "full" \| "small"` | `'full'` |
| `totalItems`   | `total-items`    | The total number of items in the data set. Used to calculate total page count   | `number`                          | `0`      |


## Events

| Event                 | Description | Type                                                          |
| --------------------- | ----------- | ------------------------------------------------------------- |
| `guxpaginationchange` |             | `CustomEvent<{ currentPage: number; itemsPerPage: number; }>` |


## Dependencies

### Depends on

- [gux-pagination-item-counts](gux-pagination-item-counts)
- [gux-pagination-items-per-page](gux-pagination-items-per-page)
- [gux-pagination-buttons](gux-pagination-buttons)

### Graph
```mermaid
graph TD;
  gux-pagination --> gux-pagination-item-counts
  gux-pagination --> gux-pagination-items-per-page
  gux-pagination --> gux-pagination-buttons
  gux-pagination-items-per-page --> gux-dropdown
  gux-pagination-items-per-page --> gux-option
  gux-dropdown --> gux-text-field-legacy
  gux-dropdown --> gux-icon
  gux-text-field-legacy --> gux-icon
  gux-option --> gux-text-highlight
  gux-pagination-buttons --> gux-input-text-like
  gux-pagination-buttons --> gux-button
  gux-pagination-buttons --> gux-icon
  gux-input-text-like --> gux-icon
  style gux-pagination fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
