# gux-pagination-items-per-page

An internal component used by the gux-pagination component.


<!-- Auto Generated Below -->


## Properties

| Property       | Attribute        | Description | Type                    | Default |
| -------------- | ---------------- | ----------- | ----------------------- | ------- |
| `itemsPerPage` | `items-per-page` |             | `100 \| 25 \| 50 \| 75` | `25`    |


## Events

| Event                        | Description | Type                  |
| ---------------------------- | ----------- | --------------------- |
| `internalitemsperpagechange` |             | `CustomEvent<number>` |


## Dependencies

### Used by

 - [gux-pagination](..)

### Depends on

- [gux-dropdown](../../gux-dropdown)
- [gux-option](../../gux-dropdown/gux-option)

### Graph
```mermaid
graph TD;
  gux-pagination-items-per-page --> gux-dropdown
  gux-pagination-items-per-page --> gux-option
  gux-dropdown --> gux-text-field-legacy
  gux-dropdown --> gux-icon
  gux-text-field-legacy --> gux-icon
  gux-option --> gux-text-highlight
  gux-pagination --> gux-pagination-items-per-page
  style gux-pagination-items-per-page fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
