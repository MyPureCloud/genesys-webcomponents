# gux-input



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type      | Default     |
| -------------- | --------------- | ----------- | --------- | ----------- |
| `clearable`    | `clearable`     |             | `boolean` | `undefined` |
| `displayUnits` | `display-units` |             | `string`  | `undefined` |


## Slots

| Slot      | Description                 |
| --------- | --------------------------- |
| `"input"` | Required slot for input tag |
| `"label"` | Required slot for label tag |


## Dependencies

### Depends on

- [gux-input-checkbox](./components/gux-input-checkbox)
- [gux-input-radio](./components/gux-input-radio)
- [gux-input-color](./components/gux-input-color)
- [gux-input-range](./components/gux-input-range)
- [gux-input-number](./components/gux-input-number)
- [gux-input-text-like](./components/gux-input-text-like)

### Graph
```mermaid
graph TD;
  gux-form-field --> gux-input-checkbox
  gux-form-field --> gux-input-radio
  gux-form-field --> gux-input-color
  gux-form-field --> gux-input-range
  gux-form-field --> gux-input-number
  gux-form-field --> gux-input-text-like
  gux-input-color --> gux-icon
  gux-input-color --> gux-color-select
  gux-color-select --> gux-input-color-option
  gux-input-number --> gux-icon
  gux-input-text-like --> gux-icon
  style gux-form-field fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
