import {LitElement, html} from '@polymer/lit-element';

/**
 * `webnfc-reader`
 * Read nfc tags with WebNFC.
 * ```
 *  <webnfc-reader mode="any" sound></webnfc-reader>
 * ```
 *
 * #### Attributes
 * | Name | Description | Default |
 * | --- | --- | --- |
 * | `src` | NFCWatchOptions.url property denotes the URL pattern which is used for matching the Web NFC Id of Web NFC messages which are being read. The default value "" means that no matching happens. | `` |
 * | `recordtype` | NFCWatchOptions.recordType property denotes the string value which is used for matching the type property of each NFCRecord object in a Web NFC message. The default value "" means that no matching happens. | `` |
 * | `mediatype` | NFCWatchOptions.mediaType property denotes the match pattern which is used for matching the type property of each NFCRecord object in a Web NFC message. The default value "" means that no matching happens. | `` |
 * | `mode` | NFCWatchOptions.mode property denotes the NFCWatchMode value telling whether only Web NFC content or any NFC content will be watched. | `any` |
 * | `verbose` | Status messages sent through custom event `webnfc-reader-status` | false |
 * | `sound` | Make a beep sound through Web Audio API when tag is read | false |
 *
 * #### Events
 * | Name | Description
 * | --- | --- |
 * | webnfc-reader-status | Watch and status messages |
 * | webnfc-reader-watch | Receive WebNFC records on tag read |
 *
 * @polymer
 * @extends HTMLElement
 * @demo demo/index.html
 */
class WebnfcReader extends LitElement {
  static get properties() {
    return {
      url: String,
      recordtype: String,
      mediatype: String,
      mode: String,
      sound: Boolean,
      verbose: Boolean,
    };
  }

  constructor() {
    super();
    this.url = '';
    this.mediatype = '';
    this.recordtype = '';
    this.mode = 'any';

    this.verbose = false;
    this.sound = false;
    this.initWatch();
  }

  // TODO optional four dot led indicator UI? Add slot for time being.
  _render() {
    return html`
      <slot></slot>
    `
  }

  initWatch() {
    if ('nfc' in navigator) {
      const _watchOpts = {
        url: this.url,
        mediaType: this.mediatype,
        recordType: this.recordType,
        mode: this.mode
      }

      navigator.nfc.watch(message => {
        for (let record of message.records) {
          if (this.sound) {
            this._beep();
          }
          this.dispatchEvent(new CustomEvent('webnfc-reader-watch', {
            bubbles: true,
            composed: true,
            detail: {
              record: record
            }
          }));
        }
      }, _watchOpts )
      .then(_ => this.status('info', 'Added nfc.watch(); tap a tag to read.'))
      .catch(_ => this.status('error', `Failed adding nfc.watch(); ${_.name}`));
    } else {
      this.status('error', 'WebNFC not supported');
    }
  }

  /**
   * Because I like an nfc reader that beeps
   * @memberof WebnfcReader
   */
  _beep() {
    if (!this._audioContext) {
      this._audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = this._audioContext.createOscillator();
    const gain = this._audioContext.createGain();
    oscillator.type = 'square';
    oscillator.frequency.value = 600;
    oscillator.connect(gain);

    gain.connect(this._audioContext.destination);
    gain.gain.setValueAtTime(20, this._audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.00001, this._audioContext.currentTime + 0.2);

    oscillator.onended = () => {
      gain.disconnect(this._audioContext.destination);
      oscillator.disconnect(gain);
    }

    oscillator.start(this._audioContext.currentTime);
    oscillator.stop(this._audioContext.currentTime+0.2);
  }

  status(type, message) {
    if (this.verbose) {
      this.dispatchEvent(new CustomEvent('webnfc-reader-status', {
        bubbles: true,
        composed: true,
        detail: {
          status: {
            type: type,
            message: message
          }
        }
      }));
    }
  }
}

window.customElements.define('webnfc-reader', WebnfcReader);