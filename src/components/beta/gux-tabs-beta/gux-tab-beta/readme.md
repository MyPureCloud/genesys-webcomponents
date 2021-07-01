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

- [gux-icon](../../../stable/gux-icon)
- [gux-tooltip](../../../stable/gux-tooltip)

### Graph
```mermaid
graph TD;
  gux-tab-beta --> gux-icon
  gux-tab-beta --> gux-tooltip
  style gux-tab-beta fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
