# gux-input



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute          | Description | Type                           | Default     |
| ---------------- | ------------------ | ----------- | ------------------------------ | ----------- |
| `clearable`      | `clearable`        |             | `boolean`                      | `undefined` |
| `displayUnits`   | `display-units`    |             | `string`                       | `undefined` |
| `resize`         | `resize`           |             | `"auto" \| "manual" \| "none"` | `undefined` |
| `valueInTooltip` | `value-in-tooltip` |             | `boolean`                      | `undefined` |


## Slots

| Slot      | Description                 |
| --------- | --------------------------- |
| `"input"` | Required slot for input tag |
| `"label"` | Required slot for label tag |


## Dependencies

### Used by

 - [gux-all-row-select](../../beta/gux-table/gux-all-row-select)
 - [gux-row-select](../../beta/gux-table/gux-row-select)

### Depends on

- [gux-input-checkbox](./components/gux-input-checkbox)
- [gux-input-radio](./components/gux-input-radio)
- [gux-input-color](./components/gux-input-color)
- [gux-input-range](./components/gux-input-range)
- [gux-input-number](./components/gux-input-number)
- [gux-input-select](./components/gux-input-select)
- [gux-input-text-like](./components/gux-input-text-like)
- [gux-input-search](./components/gux-input-search)
- [gux-input-textarea](./components/gux-input-textarea)

### Graph
```mermaid
graph TD;
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
  gux-all-row-select --> gux-form-field
  gux-row-select --> gux-form-field
  style gux-form-field fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
