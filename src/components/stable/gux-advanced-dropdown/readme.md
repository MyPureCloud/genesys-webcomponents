# gux-advanced-dropdown

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 

<!-- Auto Generated Below -->


## Properties

| Property                | Attribute                 | Description                                                   | Type      | Default     |
| ----------------------- | ------------------------- | ------------------------------------------------------------- | --------- | ----------- |
| `disabled`              | `disabled`                | Disable the input and prevent interactions.                   | `boolean` | `false`     |
| `filterDebounceTimeout` | `filter-debounce-timeout` | Timeout between filter input changed and event being emitted. | `number`  | `500`       |
| `noFilter`              | `no-filter`               | Whether the list should filter its current options.           | `boolean` | `false`     |
| `placeholder`           | `placeholder`             | The dropdown's placeholder.                                   | `string`  | `undefined` |


## Events

| Event    | Description                                             | Type                  |
| -------- | ------------------------------------------------------- | --------------------- |
| `filter` | Fires when the filter of the advanced dropdown changes. | `CustomEvent<string>` |
| `input`  | Fires when the value of the advanced dropdown changes.  | `CustomEvent<string>` |


## Methods

### `getSelectedValues() => Promise<string[]>`

Gets the currently selected values.

#### Returns

Type: `Promise<string[]>`



### `setLabeledBy(id: string) => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [gux-icon](../gux-icon)
- [gux-search-beta](../../beta/gux-search)

### Graph
```mermaid
graph TD;
  gux-advanced-dropdown --> gux-icon
  gux-advanced-dropdown --> gux-search-beta
  gux-search-beta --> gux-text-field-legacy
  gux-search-beta --> gux-icon
  gux-text-field-legacy --> gux-icon
  style gux-advanced-dropdown fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
