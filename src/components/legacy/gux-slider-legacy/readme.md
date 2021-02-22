# gux-slider-legacy

This is a basic slider component that allows users to select from values on a numerical scale, percentages may also be used.

The scroll bar users to increase or decrease the rating using arrow keys located on the keyboard.

<!-- Auto Generated Below -->


## Properties

| Property         | Attribute          | Description                                   | Type      | Default |
| ---------------- | ------------------ | --------------------------------------------- | --------- | ------- |
| `disabled`       | `disabled`         | Whether or not the slider is disabled.        | `boolean` | `false` |
| `displayTextBox` | `display-text-box` | Indicates if the input box will be displayed  | `boolean` | `true`  |
| `isPercentage`   | `is-percentage`    | Indicate if the value is a percentage         | `boolean` | `false` |
| `max`            | `max`              | Indicates the maximum value for the slider    | `number`  | `100`   |
| `min`            | `min`              | Indicates the minimum value for the slider    | `number`  | `0`     |
| `srLabel`        | `sr-label`         | Set an invisible label for accessibility uses | `string`  | `''`    |
| `step`           | `step`             | Inicates the step value of the slider         | `number`  | `1`     |
| `value`          | `value`            | Indicates the value of the slider             | `number`  | `0`     |


## Events

| Event    | Description                         | Type                  |
| -------- | ----------------------------------- | --------------------- |
| `update` | Triggered when the value is changed | `CustomEvent<number>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
