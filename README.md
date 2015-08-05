# bower-typings
Utility to retrieve typescript definitions from bower dependencies using unify.json.
See [fayde-unify](https://github.com/wsick/fayde-unify) for more information on unify.json.

## Usage

`require('bower-typings')([options])`

options
- `unifyPath` (default `./unify.json`) - path to unify file
- `includeSelf` (default: true) - include/exclude typings defined in `typings` in own `unify.json`.
- `includeDevSelf` (default: true) - include/exclude typings defined in `devTypings` in own `unify.json`.

```javascript
// Simple - Finds all typings from unify.json
var typings = require('bower-typings')();

// Exclude my own typings
var typings = require('bower-typings')({includeSelf: false});

// Exclude my dev typings
var typings = require('bower-typings')({includeDevSelf: false});
```
