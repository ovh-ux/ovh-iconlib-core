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
const rp = require('request-promise');
const archiver = require('archiver');

const BaseCleanerProvider = require('ovh-iconlib-provider-svg-cleaner/lib/base');
const BaseStorageProvider = require('ovh-iconlib-provider-storage/lib/base');

const defaultCleaner = require('ovh-iconlib-provider-svg-cleaner');
const defaultStorage = require('ovh-iconlib-provider-storage');

const svgUtils = require('../utils/svg'); 

const CustomError = require('../errors/custom');
const UnprocessableEntityError = require('../errors/unprocessableEntity');

/**
 * ctor
 * 
 * create a new instance of SvgService
 * 
 * @param {ovh-iconlib-provider-svg-cleaner/lib/base} cleaner SVG Cleaner provider (if null, load instance according to the configuration)
 * @param {ovh-iconlib-provider-storage/lib/base} storage Storage provider (if null, load instance according to the configuration)
 */
function SvgService(cleaner, storage) {
    logger.info(`SVG service: initialization...`);

    if (cleaner && cleaner instanceof BaseCleanerProvider !== true) {
        throw new CustomError('Invalid Type for cleaner argument');
    }

    if (storage && storage instanceof BaseStorageProvider !== true) {
        throw new CustomError('Invalid Type for storage argument');
    }

    this.cleaner = cleaner || defaultCleaner.getInstance();
    logger.info(`SVG service: ${this.cleaner.config.type.name} loaded...`);

    this.storage = storage || defaultStorage.getInstance();
    logger.info(`SVG service: ${this.storage.config.type.name} loaded...`);
}

SvgService.prototype.assert = function(svg) {
    if (!svgUtils.viewbox.isCorrect(svg)) {
        return Promise.reject(new UnprocessableEntityError('invalid svg format'));
    }

    return Promise.resolve(svg);
};

SvgService.prototype.sanitize = function(svg) {
    let [w, h] = svgUtils.viewport.get(svg);
    
    if (!!w && !!h && !svgUtils.viewbox.isPresent(svg)) {
        svg = svg.replace(/<svg[^>]+/i, function(match) {
            return `${match} viewBox="0 0 ${w.length} ${h.length}"`;
        });
    }

    return Promise.resolve(svg);
};

/**
 * clean
 * 
 * Clean the svg passed as argument
 * 
 * @param {string} svg
 * @return {Promise<string>}
 */
SvgService.prototype.clean = function(svg) {
    logger.info(`SVG service: clean...`);
    return this.cleaner.clean(svg);
};

/**
 * store
 * 
 * @param {Stream} stream
 * @param {string} filename
 * @return {Promise<FileInfo>}
 */
SvgService.prototype.store = function(stream, filename) {
    logger.info(`SVG service: store ${filename}...`);
    return this.storage.upload(stream, {name: filename});
};

/**
 * list
 * 
 * @return {Promise<Array<File>>}
 */
SvgService.prototype.list = function(path, skip, take) {
    logger.info(`SVG service: list files...`);
    let self = this;
    
    // get files list
    return this.storage.list(path, skip, take)
        .then(files => {
            logger.debug(`SVG service: get ${files.length} files...`);

            //for each file
            let promises = files.map(function(file) {
                //retrieve file content
                return self.get(`${file.client._serviceUrl}/${file.container}/${file.name}`)
                    .then(svg => {
                        return {
                            name: file.name,
                            etag: file.etag,
                            size: file.size,
                            lastModified: file.lastModified,
                            container: file.container,
                            raw: svg //add content to response
                        };
                    });
            });

            return Promise.all(promises).then(files => files);
        });
};

/**
 * get
 */
SvgService.prototype.get = function(path) {
    return rp(path);
};

/**
 * remove
 * 
 * @param {string} filename
 * @return {Promise<boolean>}
 */
SvgService.prototype.remove = function(filename) {
    logger.info(`SVG service: remove ${filename}...`);
    return this.storage.remove(filename);
};

/**
 * zip
 * 
 * @param {string[]} files
 * @return {ZipStream}
 */
SvgService.prototype.zip = function(files) {
    logger.debug(`SVG service: generate archive with ${files}...`);

    var archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    files.map(file => {
        archive.append(this.storage.download(file), {name: file});
    });

    archive.finalize();
    return archive;
};

module.exports = SvgService;
