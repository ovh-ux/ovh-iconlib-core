/**
 * Copyright (c) 2013-2017, OVH SAS.
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

const BaseCleanerProvider = require('ovh-iconlib-provider-svg-cleaner/lib/base');
const BaseStorageProvider = require('ovh-iconlib-provider-storage/lib/base');

const defaultCleaner = require('ovh-iconlib-provider-svg-cleaner');
const defaultStorage = require('ovh-iconlib-provider-storage');

function SvgService(cleaner, storage) {
    if (cleaner && cleaner instanceof BaseCleanerProvider !== true) {
        throw new Error('Invalid Type for cleaner argument');
    }

    if (storage && storage instanceof BaseStorageProvider !== true) {
        throw new Error('Invalid Type for storage argument');
    }

    this.cleaner = cleaner || defaultCleaner.getInstance();
    this.storage = storage || defaultStorage.getInstance();
}

SvgService.prototype.clean = function(svg) {
    return this.cleaner.clean(svg);
};

SvgService.prototype.store = function(stream, filename) {
    return this.storage.upload(stream, {name: filename});
};

SvgService.prototype.remove = function(filename) {
    return this.storage.remove(filename);
};

module.exports = SvgService;
