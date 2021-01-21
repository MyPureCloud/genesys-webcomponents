# gux-radio-group-legacy

This component aggregates events and selection logic for `gux-radio-legacy` components.  Any child `gux-radio-legacy` will automatically be detected, and have it's `name` updated to match the group, so as to keep them in sync.

## Example Usage

```
<gux-radio-group-legacy name="food-selection" onInput={ev => this.handleRadioSelection(ev)}>
  <gux-radio-legacy value="pizza">I like pizza!</gux-radio-legacy>
  <gux-radio-legacy value="pasta">I like pasta!</gux-radio-legacy>
</gux-radio-group-legacy>
```

<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                                                       | Type     | Default     |
| -------- | --------- | --------------------------------------------------------------------------------- | -------- | ----------- |
| `name`   | `name`    | The name of the radio group.  Automatically propagates down to gux-radio-legacys. | `string` | `undefined` |
| `value`  | `value`   | The selected value of the radio group.                                            | `any`    | `undefined` |


## Events

| Event   | Description                                                             | Type               |
| ------- | ----------------------------------------------------------------------- | ------------------ |
| `input` | Fires when the selected radio value changes, with the groups new value. | `CustomEvent<any>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
