# gux-row-select



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description | Type      | Default |
| ---------- | ---------- | ----------- | --------- | ------- |
| `selected` | `selected` |             | `boolean` | `false` |


## Events

| Event                        | Description | Type               |
| ---------------------------- | ----------- | ------------------ |
| `internalallrowselectchange` |             | `CustomEvent<any>` |


## Dependencies

### Depends on

- [gux-form-field](../../../stable/gux-form-field)

### Graph
```mermaid
graph TD;
  gux-all-row-select --> gux-form-field
  gux-form-field --> gux-input-checkbox
  gux-form-field --> gux-input-radio
  gux-form-field --> gux-input-color
  gux-form-field --> gux-input-range
  gux-form-field --> gux-input-number
  gux-form-field --> gux-input-select
  gux-form-field --> gux-input-text-like
  gux-form-field --> gux-input-search
  gux-form-field --> gux-input-textarea
  gux-input-color --> gux-icon
  gux-input-color --> gux-color-select
  gux-color-select --> gux-input-color-option
  gux-input-number --> gux-icon
  gux-input-select --> gux-icon
  gux-input-text-like --> gux-icon
  gux-input-search --> gux-icon
  style gux-all-row-select fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
