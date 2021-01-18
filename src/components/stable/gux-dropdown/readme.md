# gux-dropdown

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 

<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                      | Type                               | Default     |
| ------------- | ------------- | ------------------------------------------------ | ---------------------------------- | ----------- |
| `disabled`    | `disabled`    | Disable the input and prevent interactions.      | `boolean`                          | `false`     |
| `filterable`  | `filterable`  | Whether the user can filter or not.              | `boolean`                          | `undefined` |
| `mode`        | `mode`        | Sets the select mode (default, page or palette). | `"default" \| "page" \| "palette"` | `'default'` |
| `placeholder` | `placeholder` | The dropdown placeholder.                        | `string`                           | `undefined` |
| `value`       | `value`       | Indicate the dropdown input value                | `string`                           | `''`        |


## Events

| Event    | Description                      | Type                  |
| -------- | -------------------------------- | --------------------- |
| `change` | Emits when selection is changed. | `CustomEvent<string>` |


## Methods

### `setLabeledBy(labeledBy: string) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setSelected() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [gux-pagination-items-per-page](../gux-pagination/gux-pagination-items-per-page)

### Depends on

- [gux-text-field-legacy](../../legacy/gux-text-field-legacy)
- [gux-icon](../gux-icon)

### Graph
```mermaid
graph TD;
  gux-dropdown --> gux-text-field-legacy
  gux-dropdown --> gux-icon
  gux-text-field-legacy --> gux-icon
  gux-pagination-items-per-page --> gux-dropdown
  style gux-dropdown fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
