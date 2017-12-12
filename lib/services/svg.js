'use strict';

const provider = require('ovh-iconlib-provider-svg-cleaner');

function SVGService() {}

SVGService.prototype.clean = function(svg) {
    return provider.getInstance().clean(svg);
};

module.exports = SVGService;
