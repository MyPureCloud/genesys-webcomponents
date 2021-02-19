# gux-advanced-dropdown

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 

<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description           | Type                                                                                                                                                                     | Default     |
| ----------- | ----------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| `color`     | `color`     | Tag background color. | `"alert-ellow-green" \| "aqua-green" \| "blue" \| "bubblegum-pink" \| "dark-purple" \| "default" \| "electric-purple" \| "fuscha" \| "lilac" \| "navy" \| "olive-green"` | `'default'` |
| `disabled`  | `disabled`  | Tag is removable.     | `boolean`                                                                                                                                                                | `false`     |
| `icon`      | `icon`      | Tag icon name.        | `string`                                                                                                                                                                 | `undefined` |
| `removable` | `removable` | Tag is removable.     | `boolean`                                                                                                                                                                | `false`     |
| `value`     | `value`     | Index for remove tag  | `string`                                                                                                                                                                 | `undefined` |


## Events

| Event       | Description                           | Type                  |
| ----------- | ------------------------------------- | --------------------- |
| `guxdelete` | Triggered when click on remove button | `CustomEvent<string>` |


## Dependencies

### Depends on

- [gux-icon](../../stable/gux-icon)

### Graph
```mermaid
graph TD;
  gux-tag-beta --> gux-icon
  style gux-tag-beta fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
