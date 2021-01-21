# gux-command-palette
A command palette. This control is used to display possible commands and allows for those commands to be triggered.

## Example
```xml
  <head>
    <script type="text/javascript">
      function openCommandPalette() {
        document.getElementById('palette').open();
      }
    </script>
  </head>
  <body onload="openCommandPalette()">
    <gux-command-palette id="palette">
      <gux-command-action text="test" details="shows an alert" shortcut="⌘ T"></gux-command-action>
      <gux-command-action text="test2" details="Does a thing" shortcut="⌥ T"></gux-command-action>
      <gux-command-action text="test3" shortcut="⌃ T"></gux-command-action>
      <gux-command-action text="apple" details="a fruit" common></gux-command-action>
      <gux-command-action text="banana" recent></gux-command-action>
    </gux-command-palette>
  </body>
```

<!-- Auto Generated Below -->


## Methods

### `close() => Promise<void>`

Closes the command palette.

#### Returns

Type: `Promise<void>`



### `open() => Promise<void>`

Opens the command palette.

#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [gux-search-beta](../gux-search)
- [gux-list](../../stable/gux-list)
- [gux-list-item](../../stable/gux-list/list-item)
- [gux-text-highlight](../../stable/gux-text-highlight)

### Graph
```mermaid
graph TD;
  gux-command-palette-beta --> gux-search-beta
  gux-command-palette-beta --> gux-list
  gux-command-palette-beta --> gux-list-item
  gux-command-palette-beta --> gux-text-highlight
  gux-search-beta --> gux-text-field-legacy
  gux-search-beta --> gux-icon
  gux-text-field-legacy --> gux-icon
  gux-list-item --> gux-text-highlight
  style gux-command-palette-beta fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
