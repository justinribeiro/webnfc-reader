# \<webnfc-reader\>

> A web component that uses [WebNFC](https://w3c.github.io/web-nfc/) to read NFC tags.

## Features

* Props down / events up model: set watch options and simply listen for events via `addEventListener`.
* `sound` attribute uses Web Audio API to make a beep when a tag is read (so hip)
* Built as a web component on Polymer 3 / LitElement

## Install

This web component is built with Polymer 3 and ES modules in mind and is
available on NPM:

Install webnfc-reader:

```sh
npm i @justinribeiro/webnfc-reader
# or
yarn add @justinribeiro/webnfc-reader
```

After install, import into your project:

```js
import 'webnfc-reader';
```

Finally, use as required:

```html
<webnfc-reader sound></webnfc-reader>
```

## Chrome Flag Required

Currently, WebNFC is behind a Chrome flag on Android. To enable, go to chrome://flags and enabled WebNFC on an Android compatible device.

 #### Attributes
 | Name | Description | Default |
 | --- | --- | --- |
 | `src` | NFCWatchOptions.url property denotes the URL pattern which is used for matching the Web NFC Id of Web NFC messages which are being read. The default value "" means that no matching happens. | `` |
 | `recordtype` | NFCWatchOptions.recordType property denotes the string value which is used for matching the type property of each NFCRecord object in a Web NFC message. The default value "" means that no matching happens. | `` |
 | `mediatype` | NFCWatchOptions.mediaType property denotes the match pattern which is used for matching the type property of each NFCRecord object in a Web NFC message. The default value "" means that no matching happens. | `` |
 | `mode` | NFCWatchOptions.mode property denotes the NFCWatchMode value telling whether only Web NFC content or any NFC content will be watched. | `any` |
 | `verbose` | Status messages sent through custom event `webnfc-reader-status` | false |
 | `sound` | Make a beep sound through Web Audio API when tag is read | false |

 #### Events
 | Name | Description
 | --- | --- |
 | webnfc-reader-status | Watch and status messages |
 | webnfc-reader-watch | Receive WebNFC records on tag read |