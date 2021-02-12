# gux-input-color-option



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                                                      | Type      | Default     |
| -------- | --------- | -------------------------------------------------------------------------------- | --------- | ----------- |
| `active` | `active`  | Indicate if the tile is active                                                   | `boolean` | `undefined` |
| `value`  | `value`   | Indicate the color of the tile, if undefined, tile will be blank and be disabled | `string`  | `undefined` |


## Events

| Event         | Description                       | Type               |
| ------------- | --------------------------------- | ------------------ |
| `colorSelect` | Triggers when a color is selected | `CustomEvent<any>` |


## Dependencies

### Used by

 - [gux-color-select](../gux-color-select)

### Graph
```mermaid
graph TD;
  gux-color-select --> gux-input-color-option
  style gux-input-color-option fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
