# gux-toggle

This is a basic toggle using a html checkbox component in it.
If the checkedLabel and uncheckedLabel are specified, label apears on the right of the component.
You can use keyboard to change the state of the component.
Space key and enter key are binded.
This component supports dark theme mode also.
A check event is triggered when the state of the component changed.

<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description                               | Type                | Default     |
| ---------------- | ----------------- | ----------------------------------------- | ------------------- | ----------- |
| `checked`        | `checked`         | Indicate if the toggle is checked or not  | `boolean`           | `undefined` |
| `checkedLabel`   | `checked-label`   | Indicate the checked label                | `string`            | `undefined` |
| `disabled`       | `disabled`        | Indicate if the toggle is disabled or not | `boolean`           | `undefined` |
| `labelPosition`  | `label-position`  |                                           | `"left" \| "right"` | `'right'`   |
| `uncheckedLabel` | `unchecked-label` | Indicate the unchecked label              | `string`            | `undefined` |


## Events

| Event   | Description                                        | Type               |
| ------- | -------------------------------------------------- | ------------------ |
| `check` | Triggered when the state of the component changed. | `CustomEvent<any>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
