// ==UserScript==
// @name         YouTube Leanback HQ Thumbnail Fork
// @namespace    https://github.com/ItBePhill
// @version      22-08-2025
// @description  Replace YouTube TV's default thumbnails with really HQ ones
// @author       ItBePhill
// @match        https://www.youtube.com/tv
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

const hook = (target, prop, handler) => {
    const oldDescriptor = Object.getOwnPropertyDescriptor(target, prop)
    const newDescriptor = handler(oldDescriptor)
    Object.defineProperty(target, prop, newDescriptor)
}

function urlExists(url, callback) {
  fetch(url, { method: 'head' })
  .then(function(status) {
    callback(status.ok)
  });
}


(function() {
    'use strict';

    const {HTMLElement} = document.defaultView

    const proxyHandler = {
        set(target, prop, value) {
            if (prop === 'cssText' && !value.startsWith('background-image:url("data:')) {
                urlExists(url, function(exists) {
                      if (exists) {
                        value = value.replace('hqdefault', 'maxresdefault')
                          return Reflect.set(target, prop, value)
                      }
                    });
                }
            }

            
        }
    }

    hook(HTMLElement.prototype, 'style', ({get, set}) => {
        return {
            get() {
                const _style = get.call(this)
                if (this.tagName === 'YTLR-THUMBNAIL-DETAILS') {
                    return new Proxy(_style, proxyHandler)
                }
                return _style
            },
            set(val) {
                console.log('Setting style of', this.tagName, ':', val)
                set.call(this, val)
            }
        }
    })
})();
