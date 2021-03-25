# gux-text-field-legacy

This component is an html input component having update indicator or error/warning message on it.
You can specify a validation function to add this test on input. You can do it by yourself using the input event and
changing error-message attribute.

## Example usage

``` html
<gux-text-field-legacy>
</gux-text-field-legacy>
```

<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description | Type      | Default     |
| ----------- | ----------- | ----------- | --------- | ----------- |
| `clearable` | `clearable` |             | `boolean` | `undefined` |


## Slots

| Slot      | Description                           |
| --------- | ------------------------------------- |
| `"input"` | Required slot for input[type="radio"] |


## Dependencies

### Used by

 - [gux-form-field](../..)
 - [gux-pagination-buttons](../../../gux-pagination/gux-pagination-buttons)

### Depends on

- [gux-icon](../../../gux-icon)

### Graph
```mermaid
graph TD;
  gux-input-text-like --> gux-icon
  gux-form-field --> gux-input-text-like
  gux-pagination-buttons --> gux-input-text-like
  style gux-input-text-like fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
