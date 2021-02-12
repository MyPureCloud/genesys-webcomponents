# gux-content-search



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                        | Type     | Default |
| -------------- | --------------- | -------------------------------------------------- | -------- | ------- |
| `currentMatch` | `current-match` | The Current match count which needs to highlighted | `number` | `0`     |
| `matchCount`   | `match-count`   | The Match Count                                    | `number` | `0`     |


## Events

| Event                    | Description                                | Type                  |
| ------------------------ | ------------------------------------------ | --------------------- |
| `guxcurrentmatchchanged` | Triggered when Current match value changes | `CustomEvent<number>` |


## Methods

### `clear() => Promise<void>`

Clears the input.

#### Returns

Type: `Promise<void>`




## Slots

| Slot | Description                 |
| ---- | --------------------------- |
|      | Required slot for input tag |


## Dependencies

### Depends on

- [gux-icon](../gux-icon)

### Graph
```mermaid
graph TD;
  gux-content-search --> gux-icon
  style gux-content-search fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
