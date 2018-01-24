/**
 * Copyright (c) 2013-2018, OVH SAS.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 *   * Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *   * Neither the name of OVH SAS nor the
 *     names of its contributors may be used to endorse or promote products
 *     derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY OVH SAS AND CONTRIBUTORS ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL OVH SAS AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

const logger = require('@rduk/logger');
const toArray = require('stream-to-array');
const SvgService = require('./svg');
const svg2png = require('svg2png');
const svgUtils = require('../utils/svg');
const bufferUtils = require('../utils/buffer');

function getDim(buffer) {
    let svg = buffer.toString('utf8');

    let [w, h] = svgUtils.viewbox.getDimension(svg);
    
    if (!w || !h) {
        throw new Error('Cannot get dimensions from viewbox !');
    }

    return [w.length, h.length];
}

/**
 * ctor
 * 
 * create a new instance of PngService
 * 
 * @param {./svg} svgService
 */
function PngService(svgService) {
    logger.debug(`PNG service: initialization...`);

    if (svgService && svgService instanceof SvgService !== true) {
        throw new Error('Invalid Type for svgService argument');
    }

    this.svgService = svgService || new SvgService();
}

PngService.prototype.generateFromSvg = function(svgPath, dim) {
    return toArray(this.svgService.storage.download(svgPath))
        .then(bufferUtils.concat)
        .then(buffer => {
            let [w, h] = dim || getDim(buffer);
            return svg2png(buffer, { width: w, height: h } );
        });
};

module.exports = PngService;
