# gux-tab



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute       | Description                                                                                         | Type      | Default     |
| ------------- | --------------- | --------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `active`      | `active`        | indicates whether or not the tab is selected                                                        | `boolean` | `false`     |
| `tabIconName` | `tab-icon-name` | indicates the gux-icon to display on the left side of the tab (similar to a favicon in the browser) | `string`  | `undefined` |
| `tabId`       | `tab-id`        | unique id for the tab                                                                               | `string`  | `undefined` |


## Events

| Event                 | Description | Type                |
| --------------------- | ----------- | ------------------- |
| `internaltabselected` |             | `CustomEvent<void>` |


## Dependencies

### Depends on

- [gux-icon](../../gux-icon)
- [gux-popover](../../gux-popover)

### Graph
```mermaid
graph TD;
  gux-tab --> gux-icon
  gux-tab --> gux-popover
  gux-popover --> gux-icon
  style gux-tab fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
