# gux-radio-legacy

A radio button component, intended to be used in conjunction with the `gux-radio-group-legacy` component.  Labels should be provided through the component's main slot.

## Example Usage

See documentation for the `gux-radio-group-legacy` documentation for a more thourough example.

```
<gux-radio-legacy value="pizza">I like pizza!</gux-radio-legacy>
```

<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                                   | Type      | Default     |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `checked`  | `checked`  | Whether or not this radio is checked.                                                                         | `boolean` | `false`     |
| `disabled` | `disabled` | Whether or not the radio is disabled.                                                                         | `boolean` | `false`     |
| `name`     | `name`     | The radio group name for this radio button.  Automatically inherited/overwritten by a gux-radio-group-legacy. | `string`  | `undefined` |
| `value`    | `value`    | The form value to use for the radio button.                                                                   | `string`  | `undefined` |


## Events

| Event   | Description                                         | Type                   |
| ------- | --------------------------------------------------- | ---------------------- |
| `check` | Fired when the checked status of the radio changes. | `CustomEvent<boolean>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
