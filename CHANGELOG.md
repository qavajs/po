# Change Log

All notable changes to the "@qavajs/po" will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

:rocket: - new feature
:beetle: - bugfix
:x: - deprecation/removal
:pencil: - chore

## [1.10.0]
- :rocket: added capability to pass parent element into NativeSelector

## [1.9.0]
- :x: disabled auto-split arguments in selector function

## [1.8.0]
- :rocket: added capability to use driver-built selector
```javascript
const { NativeSelector } = require('@qavajs/po');

class App {
    Element = $(NativeSelector(browser => browser.$('.single-element')));
}
```

## [1.7.0]
- :rocket: updated d.ts
- :beetle: fixed logger for Selector function

## [1.6.0]
- :rocket: added capability to provide logger

## [1.5.0]
- :rocket: added capability to dynamically generate selectors

## [1.4.1]
- :beetle: removed getting text from text content

## [1.4.0]
- :rocket: added element query validation
- :rocket: added auto-retry for element
- :rocket: added immediate flag to skip auto-retry

## [1.3.0]
- :rocket: added text selector by regexp

## [1.2.0]
- :rocket: made selector property as optional

## [1.1.0]
- :rocket: added capability to ignore hierarchy
