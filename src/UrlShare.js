import domify from 'min-dom/lib/domify';
import domQuery from 'min-dom/lib/query';
import domEvent from 'min-dom/lib/event';
import domClasses from 'min-dom/lib/classes';

import Clipboard from 'clipboard';

const pako = require('pako');
const zlib = require('zlib');

const BASE_URL = 'https://philippfromme.github.io/gitter-demo/?';

export default class UrlShare {
  constructor(gitter) {
    this._gitter = gitter;

    this.url = null;

    this._init();
  }

  _init() {
    const $container = this._gitter.get('canvas').getContainer();

    const $el = domify(
      `<div id="share">
        <i class="fa fa-share" aria-hidden="true"></i>
        Share
        <span class="url hidden"></span>
      </div>`);

    domEvent.bind($el, 'click', () => {
      this.openShareDialog();
    });

    $container.appendChild($el);

    const $overlay = this.$overlay = domify('<div id="share-dialog-overlay" class="hidden"></div>');

    $container.appendChild($overlay);

    const $shareDialog = this.$shareDialog = domify(`
      <div id="share-dialog" class="hidden">
        <div id="close-share-dialog"><i class="fa fa-close"></i></div>
        Share
        <div id="share-url"></div>
        <div id="share-url-copied" class="hidden"><i class="fa fa-check"></i> Copied</div>
      </div>
    `);

    domEvent.bind($shareDialog, 'mousedown', e => e.stopPropagation());

    $container.appendChild($shareDialog);

    const $closeShareDialog = domQuery('#close-share-dialog', $shareDialog);

    domEvent.bind($closeShareDialog, 'click', this.closeShareDialog.bind(this));

    const $shareUrl = this.$shareUrl = domQuery('#share-url', $shareDialog);

    new Clipboard(this.$shareUrl, {
      text: () => this.url
    });

    const $shareUrlCopied = this.$shareUrlCopied = domQuery('#share-url-copied', $shareDialog);

    domEvent.bind($shareUrl, 'click', () => {
      domClasses($shareUrlCopied).remove('hidden');
    })

    domEvent.bind(document, 'click', (e) => {
      if (!e.target.closest('#share-dialog')) {
        this.closeShareDialog();
      }
    });
  }

  openShareDialog() {
    this.generateUrl((url) => {
      this.url = url;
      this.$shareUrl.textContent = url;

      domClasses(this.$overlay).remove('hidden');
      domClasses(this.$shareDialog).remove('hidden');
    });
  }

  closeShareDialog() {
    domClasses(this.$shareUrlCopied).add('hidden');
    domClasses(this.$overlay).add('hidden');
    domClasses(this.$shareDialog).add('hidden');
  }

  generateUrl(done) {
    const config = this._gitter.save();

    zlib.deflate(config, (err, buffer) => {
      if (!err) {
        done(BASE_URL + buffer.toString('base64'));
      } else {
        console.log(err);
      }
    });
  }

  intercept() {
    const config = window.location.search.substring(1);

    if (!config.length) {
      return;
    }

    const buffer = Buffer.from(config, 'base64');

    zlib.unzip(buffer, (err, buffer) => {
      if (!err) {
        console.log(buffer.toString());

        this._gitter.load(buffer.toString());
      } else {
        console.log(err);
      }
    });
  }
}